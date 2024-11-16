const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../../config/amazon");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { ImageUpload, VendingMachine } = require("../../models");

exports.uploadSingleImage = async (req, res) => {
  const file = req.file;
  const bucketName = process.env.AWS_ACCESS_POINT;
  const Machine = await VendingMachine.findById(req.body.vending_machine_id);
  console.log(Machine);
  const key = `images/${Date.now()}-${file.originalname}`;
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({ Bucket: bucketName, Key: key }),
      { expiresIn: 3600 }
    );
    const image = await ImageUpload.create({
      url: signedUrl,
      name: file.originalname,
      size: file.size,
      key,
      mimetype: file.mimetype,
      vending_machine_id: req.body.vending_machine_id,
    });
    await image.save();
    Machine.images.push(image._id);
    await Machine.save();
    res.send({ message: "Image uploaded successfully", image });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error uploading image" });
  }
};

exports.uploadMultipleImages = async (req, res) => {
  const files = req.files;
  const bucketName = process.env.AWS_ACCESS_POINT; // Ensure correct case
  const Machine = await VendingMachine.findById(req.body.vending_machine_id);
  const uploadPromises = files.map(async (file) => {
    const key = `images/${Date.now()}-${file.originalname}`;
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Generate signed URL
    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({ Bucket: bucketName, Key: key }),
      {
        expiresIn: 3600,
      }
    );
    const image = await ImageUpload.create({
      url: signedUrl,
      name: file.originalname,
      size: file.size,
      key,
      mimetype: file.mimetype,
      vending_machine_id: req.body.vending_machine_id,
    });
    await image.save();
    return { image };
  });

  try {
    const results = await Promise.all(uploadPromises);
    results.forEach((result) => {
      Machine.images.push(result.image._id);
    });
    await Machine.save();
    res.send({ message: "Images uploaded successfully", results });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error uploading images" });
  }
};

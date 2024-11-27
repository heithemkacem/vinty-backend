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
  console.log(req.files);
  console.log(req.body);

  const bucketName = process.env.AWS_ACCESS_POINT; // Ensure correct case
  const Machine = await VendingMachine.findById(req.body.id);

  if (!Machine) {
    return res.status(404).send({ message: "Vending machine not found." });
  }

  const currentImageCount = Machine.images.length; // Current number of images
  const newImageCount = files.length; // Number of new images to upload

  // Calculate total images after upload
  const totalImages = currentImageCount + newImageCount;

  // Check if total exceeds limit
  if (totalImages > 6) {
    const maxUploadable = 6 - currentImageCount; // Calculate how many more can be uploaded
    return res.status(400).send({
      message: `Maximum number of images allowed is 6. You can only upload ${maxUploadable} more image(s).`,
    });
  }

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
    console.log(Machine);
    res.status(200).send({ message: "Images uploaded successfully", results });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error uploading images" });
  }
};

const mongoose = require("mongoose");

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
}

// Call the connection function
connectToDatabase();

// Export mongoose for use in other parts of your application
module.exports = mongoose;

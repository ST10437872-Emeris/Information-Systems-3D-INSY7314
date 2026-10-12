const mongoose = require('mongoose');
const config = require('./config');
async function connectDatabase() {
  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 7000 });
  } catch (err) {
    console.error('Cannot connect to MongoDB. Confirm that the MongoDB Windows service is running on port 27017.');
    throw err;
  }
  console.log(`MongoDB connected to ${mongoose.connection.name}`);
}
module.exports = connectDatabase;

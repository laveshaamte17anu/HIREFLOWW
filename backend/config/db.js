const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbName = process.env.DB_NAME || 'HireFlow';
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: dbName,
    });
    console.log(`MongoDB Connected: ${conn.connection.host} | Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

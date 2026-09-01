const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Atlas connection failed (${error.message}). Starting Local In-Memory MongoDB...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ In-Memory MongoDB Active: ${conn.connection.host}`);

      // Automatically seed demo data into the memory instance
      const { seedData } = require('../scripts/generateComprehensiveDemo');
      if (typeof seedData === 'function') {
        await seedData();
      }
    } catch (memError) {
      console.error(`❌ Critical Database Error: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Tạo admin mặc định nếu chưa có
    await createDefaultAdmin();
    
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

const createDefaultAdmin = async () => {
  const User = require('../models/User');
  const bcrypt = require('bcrypt');
  
  const adminExists = await User.findOne({ email: process.env.DEFAULT_ADMIN_EMAIL });
  
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(
      process.env.DEFAULT_ADMIN_PASSWORD,
      parseInt(process.env.BCRYPT_SALT_ROUNDS)
    );
    
    await User.create({
      email: process.env.DEFAULT_ADMIN_EMAIL,
      password: hashedPassword,
      name: 'Super Admin',
      role: 'admin',
      isActive: true
    });
    
    console.log('Default admin user created');
  }
};

module.exports = connectDB;
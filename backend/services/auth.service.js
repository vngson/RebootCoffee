const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AccessLog = require('../models/AccessLog');

class AuthService {
  async login(email, password, ipAddress, userAgent) {
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    await this.logAccess('POST /api/public/auth/login', 'POST', ipAddress, userAgent, user._id);

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token,
      expiresIn: process.env.JWT_EXPIRES_IN
    };
  }

  async logAccess(route, method, ipAddress, userAgent, userId = null) {
    try {
      await AccessLog.create({
        route,
        method,
        ipAddress,
        userAgent,
        userId,
        date: new Date()
      });
    } catch (error) {
      console.error('Failed to log access:', error);
    }
  }
}

module.exports = new AuthService();
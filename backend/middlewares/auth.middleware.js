const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');
const User = require('../models/User');

const authMiddleware = {
  authenticate: async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return errorResponse(res, 'Access denied. No token provided.', 401);
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ 
        _id: decoded.userId, 
        isActive: true 
      });

      if (!user) {
        return errorResponse(res, 'User not found or inactive.', 401);
      }

      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return errorResponse(res, 'Invalid token.', 401);
      }
      if (error.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token expired.', 401);
      }
      return errorResponse(res, 'Authentication failed.', 401);
    }
  },

  authorizeAdmin: (req, res, next) => {
    if (req.user.role !== 'admin') {
      return errorResponse(res, 'Access denied. Admin role required.', 403);
    }
    next();
  },

  authorizeStaff: (req, res, next) => {
    if (!['admin', 'staff'].includes(req.user.role)) {
      return errorResponse(res, 'Access denied. Staff role required.', 403);
    }
    next();
  }
};

module.exports = authMiddleware;
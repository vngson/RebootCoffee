const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
  route: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  }
});

accessLogSchema.index({ date: 1, route: 1 });

module.exports = mongoose.model('AccessLog', accessLogSchema);
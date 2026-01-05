const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authValidators } = require('../utils/validators');

// Public routes không cần xác thực
router.post('/auth/login', validate(authValidators.login), authController.login);

module.exports = router;
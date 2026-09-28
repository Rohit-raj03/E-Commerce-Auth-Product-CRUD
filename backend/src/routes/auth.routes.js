const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  logout,
  me,
} = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const validate = require('../middleware/validation.middleware');
const authenticateToken = require('../middleware/auth.middleware');

// Public auth endpoints
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/refresh-token', refreshToken);

// Protected auth endpoints
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, me);

module.exports = router;

const { verifyAccessToken } = require('../utils/jwt');

/**
 * Middleware to protect routes that require JWT access token authentication.
 * Checks Authorization header: Bearer <ACCESS_TOKEN>
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
      errors: [],
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // Contains payload e.g. { id: user._id }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired access token',
      errors: [],
    });
  }
};

module.exports = authenticateToken;

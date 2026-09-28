/**
 * Centralized express error middleware.
 * Prevents stack trace leakages in production and standardizes API response format.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500;
  const status = statusCode >= 500 ? 500 : statusCode;

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);

  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    errors: err.errors || [],
  });
};

module.exports = errorHandler;

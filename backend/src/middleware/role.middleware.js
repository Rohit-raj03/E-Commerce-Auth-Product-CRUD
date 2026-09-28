/**
 * Role-based authorization middleware.
 * Verifies that the authenticated user possesses one of the allowed roles.
 * Must be used after authenticateToken middleware.
 *
 * @param  {...string} allowedRoles - E.g. 'seller', 'user'
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No role found.',
        errors: [],
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Action restricted to [${allowedRoles.join(', ')}] role. Your role is '${req.user.role}'.`,
        errors: [],
      });
    }

    next();
  };
};

module.exports = roleMiddleware;

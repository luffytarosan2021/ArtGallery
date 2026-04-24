const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Requires authMiddleware first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Check if user role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Role '${req.user.role}' not authorized. Required: [${allowedRoles.join(', ')}]`
      });
    }

    next();
  };
};

module.exports = authorizeRoles;


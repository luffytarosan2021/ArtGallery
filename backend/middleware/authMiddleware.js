const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-art-gallery-jwt-key-change-in-production';

const authMiddleware = (req, res, next) => {
  try {
    // Extract token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access token missing or invalid format. Use: Authorization: Bearer <token>'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user info to req
    req.user = decoded; // { userId, email, role }

    next();
  } catch (err) {
    console.error('JWT Error:', err.name, err.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

module.exports = authMiddleware;


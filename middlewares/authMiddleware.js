const jwt = require('jsonwebtoken');
const  RevokedToken  = require('../models/revokedToken'); // Import your RevokedToken model
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Check if token is revoked using Sequelize
    const revokedToken = await RevokedToken.findOne({ where: { token } });
    if (revokedToken) {
      return res.status(401).json({ error: 'Token revoked. Login again.' });
    }

    // Verify token if not revoked
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
      }
      req.user = user;
      next();
    });

  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authenticateToken;
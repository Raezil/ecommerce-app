// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models/user'); // Import User model

// Usually you'd keep this in an env var:
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: 'Missing Authorization header' });
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res
      .status(401)
      .json({ message: 'Invalid Authorization format' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    
    // Check if user still exists in database
    const user = await User.findByPk(payload.sub);
    if (!user) {
      return res
        .status(401)
        .json({ message: 'User no longer exists. Register new account and log in.' });
    }

    // Attach user info to the request
    req.user = {
      id: user.Id,
      username: user.Username,
      email: user.Email,
      role: user.Role
    };
    
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res
        .status(401)
        .json({ message: 'Invalid token' });
    } else if (err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token expired' });
    } else {
      console.error('Authentication error:', err);
      return res
        .status(401)
        .json({ message: 'Authentication failed' });
    }
  }
}

module.exports = authenticateJWT;
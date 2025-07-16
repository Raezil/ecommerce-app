// middleware/auth.js
const jwt = require('jsonwebtoken');

// Usually you’d keep this in an env var:
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

function authenticateJWT(req, res, next) {
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
    // attach payload (e.g. user info) to the request
    req.user = payload;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: 'Invalid or expired token' });
  }
}

module.exports = authenticateJWT;

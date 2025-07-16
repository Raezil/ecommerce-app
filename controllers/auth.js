// controllers/auth.js
const { User } = require('../models/user'); // Assuming you have a User model
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const bcrypt = require('bcrypt'); 
async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ where: { Username: username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.PasswordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { sub: user.Id, role: user.Role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.json({ token });

  } catch (err) {
    console.error('Login error:', err);        // ← logs the real exception
    return res
      .status(500)
      .json({ error: err.message || 'Internal server error' });
  }
}


module.exports = { login };

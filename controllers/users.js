// controllers/users.js
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

// List all users (you might restrict this to admins)
async function getUsers(req, res) {
  const users = await User.findAll({
    attributes: ['Id', 'Username', 'Email', 'Role'],
  });
  res.json(users);
}

// Get a single user by ID
async function getUserById(req, res) {
  const id = parseInt(req.params.id, 10);
  const user = await User.findByPk(id, {
    attributes: ['Id', 'Username', 'Email', 'Role'],
  });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

// Register a new user
async function registerUser(req, res) {
  const { username, email, password, role } = req.body;
  try {
    const newUser = await User.create({
      Username: username,
      Email: email,
      PasswordHash: password, // will be hashed by hook
      Role: role || 'user',
    });
    res.status(201).json({
      Id: newUser.Id,
      Username: newUser.Username,
      Email: newUser.Email,
      Role: newUser.Role,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Update user (e.g. change role or email)
async function updateUser(req, res) {
  const id = parseInt(req.params.id, 10);
  const { email, role } = req.body;
  const [updated] = await User.update(
    { Email: email, Role: role },
    { where: { Id: id } }
  );
  if (!updated) return res.status(404).json({ message: 'User not found' });
  const updatedUser = await User.findByPk(id, {
    attributes: ['Id', 'Username', 'Email', 'Role'],
  });
  res.json(updatedUser);
}

// Delete a user
async function deleteUser(req, res) {
  const id = parseInt(req.params.id, 10);
  const deleted = await User.destroy({ where: { Id: id } });
  if (!deleted) return res.status(404).json({ message: 'User not found' });
  res.status(204).send();
}

module.exports = {
  getUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
};

// backend/controllers/userController.js
const User = require('../models/User');

// GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ message: 'Server error', detail: e.message });
  }
};

// POST /api/users
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body || {};
    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ message: 'name & email are required' });
    }
    const created = await User.create({ name: name.trim(), email: email.trim() });
    res.status(201).json(created);
  } catch (e) {
    if (e.code === 11000) { // duplicate email
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', detail: e.message });
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updated);
  } catch (e) {
    res.status(500).json({ message: 'Server error', detail: e.message });
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted', user: deleted });
  } catch (e) {
    res.status(500).json({ message: 'Server error', detail: e.message });
  }
};

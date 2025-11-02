// --- File: backend/routes/userRoutes.js (Corrected) ---

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware kiểm tra đăng nhập
const admin = require('../middleware/admin'); // Middleware kiểm tra Admin
const User = require('../models/User'); // Model User

// API: Lấy danh sách người dùng (Chỉ Admin)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error("Lỗi GET /api/users:", err.message);
    res.status(500).send('Server error');
  }
}); // <-- Ensure closing brace and parenthesis are correct

// API: Xóa người dùng (Chỉ Admin)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Không tìm thấy user' });
    }

    // Use deleteOne() or findByIdAndDelete() instead of remove() (which is deprecated)
    // Ensure this line is correct - likely where the error was
    await User.findByIdAndDelete(req.params.id); 
    // OR: await user.deleteOne(); 

    res.json({ msg: 'Xóa user thành công' });
  } catch (err) {
    console.error("Lỗi DELETE /api/users/:id:", err.message);
     if (err.kind === 'ObjectId') { 
         return res.status(400).json({ msg: 'ID người dùng không hợp lệ' });
    }
    res.status(500).send('Server error');
  }
}); // <-- Ensure closing brace and parenthesis are correct

module.exports = router; // <-- Ensure this line is present and correct
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware
const User = require('../models/User'); // Import User model
const bcrypt = require('bcryptjs'); // Needed for password change

// --- Dependencies for Avatar Upload ---
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary'); // Your Cloudinary config

// Configure Multer for avatar upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
  }
});
// ------------------------------------

// API: Xem thông tin cá nhân (GET /profile)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err.message);
    res.status(500).send('Server error');
  }
});

// API: Cập nhật thông tin cá nhân (PUT /profile) - Name & Email
router.put('/', auth, async (req, res) => {
  try {
    const { name, email } = req.body; // Only handle name and email here
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
        return res.status(404).json({ msg: 'Không tìm thấy người dùng' });
    }
    const updateFields = {};
    if (name && name.trim() !== currentUser.name) {
        updateFields.name = name.trim();
    }
    if (email && email.trim().toLowerCase() !== currentUser.email) {
        const newEmail = email.trim().toLowerCase();
        if (!/\S+@\S+\.\S+/.test(newEmail)) {
            return res.status(400).json({ msg: 'Định dạng email không hợp lệ.' });
        }
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser && existingUser._id.toString() !== req.user.id) {
            return res.status(400).json({ msg: 'Email này đã được người khác sử dụng.' });
        }
        updateFields.email = newEmail;
    }

    if (Object.keys(updateFields).length === 0) {
        // Return current user if no valid fields to update were provided
         const userToReturn = await User.findById(req.user.id).select('-password'); // Fetch again without password
        return res.json(userToReturn);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');
    res.json(updatedUser);

  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).send('Server error');
  }
});

// === API: Đổi Mật Khẩu (PUT /profile/password) ===
router.put('/password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ msg: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới.' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ msg: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
    }
    try {
        const user = await User.findById(req.user.id).select('+password'); // Select password here
        if (!user) {
            return res.status(404).json({ msg: 'Không tìm thấy người dùng.' });
        }
         if (!user.password) { // Safety check
             console.error("User password missing for password change:", user.email);
             return res.status(500).json({ msg: 'Lỗi server khi xử lý yêu cầu.' });
         }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Mật khẩu hiện tại không đúng.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedNewPassword;
        await user.save();
        res.json({ msg: 'Đổi mật khẩu thành công!' });
    } catch (err) {
        console.error("Lỗi đổi mật khẩu:", err.message);
        res.status(500).send('Server error');
    }
});

// === API: UPLOAD AVATAR (POST /profile/avatar) ===
// THIS WAS MISSING
router.post('/avatar', [auth, upload.single('avatar')], async (req, res) => {
    console.log(">>> /api/profile/avatar REQ RECEIVED"); // Debug log

    // Check if multer added a validation error
     if (req.fileValidationError) {
        return res.status(400).json({ msg: req.fileValidationError });
     }
    if (!req.file) {
        return res.status(400).json({ msg: 'Vui lòng chọn một file ảnh để tải lên.' });
    }

    try {
        // Function to upload buffer to Cloudinary
        let uploadFromBuffer = (buffer) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    { folder: "user_avatars" }, // Optional folder
                    (error, result) => {
                        if (result) { resolve(result); }
                        else { reject(error); }
                    }
                );
                streamifier.createReadStream(buffer).pipe(stream);
            });
        };

        // Upload the buffer
        let result = await uploadFromBuffer(req.file.buffer);
        const avatarUrl = result.secure_url;

        // Update DB
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { avatar: avatarUrl },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
             return res.status(404).json({ msg: 'Không tìm thấy người dùng để cập nhật.' });
        }

        // Send success response
        res.json({
            msg: 'Cập nhật ảnh đại diện thành công!',
            avatarUrl: avatarUrl,
            user: updatedUser // Send back updated user
        });

    } catch (err) {
        console.error("Lỗi upload avatar:", err);
         if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
             return res.status(400).json({ msg: 'File ảnh quá lớn, vui lòng chọn file dưới 5MB.' });
         }
        res.status(500).send('Server error trong quá trình upload ảnh.');
    }
});
// ===========================================

module.exports = router; // This must be the last line
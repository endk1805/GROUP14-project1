const express = require('express');
const router = express.Router(); // Ensure router is defined here
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// API: Đăng ký (Sign Up)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Kiểm tra email trùng
    // Use lowercase for consistent checking
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ msg: 'Email đã tồn tại' });
    }

    // 2. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Tạo user mới
    // Store email in lowercase
    user = new User({ name, email: email.toLowerCase(), password: hashedPassword });
    await user.save();

    res.status(201).json({ msg: 'Đăng ký thành công' });

  } catch (err) {
    console.error("Signup Error:", err.message); // Add logging
    res.status(500).send('Server error');
  }
});

// API: Đăng nhập (Login)
router.post('/login', async (req, res) => {
  console.log(">>> Received POST /api/auth/login request"); // Debug log
  try {
    const { email, password } = req.body;
    console.log(">>> Attempting login for:", email); // Debug log

    // === FIX 1: Add .select('+password') ===
    // Retrieve the password field even if 'select: false' is in the schema
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    // ===================================

    console.log(">>> User found:", user ? user.email : 'Not Found'); // Debug log
    if (!user) {
      return res.status(400).json({ msg: 'Email hoặc mật khẩu không đúng' });
    }

    // === FIX 2: Check if password exists before comparing ===
    if (!user.password) {
         console.error("!!! User object retrieved but password field is missing/undefined for:", email);
         return res.status(500).json({ msg: 'Lỗi server khi lấy thông tin xác thực.' });
    }
    // =======================================================

    // 2. So sánh mật khẩu
    console.log(">>> Comparing passwords..."); // Debug log
    // REMOVED tag here
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(">>> Password match result:", isMatch); // Debug log
    if (!isMatch) {
      return res.status(400).json({ msg: 'Email hoặc mật khẩu không đúng' });
    }

    // REMOVED tag here
    // 3. Tạo và trả về JWT token
    const payload = {
      user: {
        id: user.id, // Use user.id ( Mongoose virtual) or user._id
        role: user.role
      }
    };

    // === FIX 3: Use process.env for JWT Secret ===
    const secretKey = process.env.JWT_SECRET; // Read from .env
    // ============================================

    // Check if secretKey is actually defined
    if (!secretKey) {
        console.error('!!! FATAL ERROR: JWT_SECRET is not defined in .env file!');
        return res.status(500).json({ msg: 'Server configuration error.' });
    }

    console.log(">>> Signing JWT..."); // Debug log
    jwt.sign(
        payload,
        secretKey,
        { expiresIn: '7d' },
        (err, token) => {
            if (err) {
                console.error("!!! JWT Sign Error in /login:", err);
                return res.status(500).json({ msg: 'Lỗi khi tạo token xác thực.' });
            }
            console.log(">>> Login successful, sending token."); // Debug log
            res.json({ token });
        }
    );

  } catch (err) {
    console.error("!!! CATCH BLOCK ERROR in /login:", err);
    res.status(500).send('Server error');
  }
});

// API: Đăng xuất (Logout)
router.post('/logout', (req, res) => {
    res.json({ msg: 'Đăng xuất thành công (phía client xử lý)' });
});

// API: Quên mật khẩu - Gửi yêu cầu reset
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ msg: 'Vui lòng cung cấp email.' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.json({ msg: 'Nếu email tồn tại, bạn sẽ nhận được link reset.' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // === FIX 4: Correct Reset URL (Point to Frontend) ===
        // Use environment variable or hardcode frontend port (e.g., 3003)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3003';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
        // ===================================================

        // Check if email credentials are set
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
             console.error('!!! Email credentials (EMAIL_USER, EMAIL_PASS) not found in .env');
             // Don't save the token if email can't be sent
             user.resetPasswordToken = undefined;
             user.resetPasswordExpires = undefined;
             await user.save();
             return res.status(500).json({ msg: 'Lỗi cấu hình server để gửi email.' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // Ensure this is App Password for Gmail
            },
        });

        const mailOptions = {
            to: user.email,
            from: `"${process.env.EMAIL_FROM_NAME || 'Your App Name'}" <${process.env.EMAIL_USER}>`, // Optional: Add sender name
            subject: 'Yêu cầu Reset Mật khẩu',
            text: `Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu reset mật khẩu.\n\n` +
                  `Vui lòng nhấn vào link sau, hoặc dán vào trình duyệt để hoàn tất:\n\n` +
                  `${resetUrl}\n\n` +
                  `Nếu bạn không yêu cầu, vui lòng bỏ qua email này và mật khẩu của bạn sẽ không thay đổi.\n` +
                  `Link có hiệu lực trong 10 phút.\n`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ msg: 'Email reset đã được gửi.' });

    } catch (err) {
        console.error('Lỗi forgot password:', err); // Log the full error
        res.status(500).send('Server error');
    }
});

// API: Đặt lại mật khẩu bằng token
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({ msg: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
        }

        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        // Find user by hashed token and check expiry
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ msg: 'Token reset không hợp lệ hoặc đã hết hạn.' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ msg: 'Đặt lại mật khẩu thành công!' });

    } catch (err) {
        console.error('Lỗi reset password:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router; // Ensure this is the last line
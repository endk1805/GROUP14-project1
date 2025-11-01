require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. IMPORT TẤT CẢ CÁC FILES ROUTE
// (Giả sử bạn tạo 2 file này theo hướng dẫn)
const authRoutes = require('./routes/auth'); 
// (File này bạn đã có)
const profile = require('./routes/profile');
const userRouter = require('./routes/userRoutes'); 

const app = express();


// --- Middleware ---
app.use(express.json());
app.use(cors());

// 2. KẾT NỐI ROUTER VÀO APP
// /api/auth cho Đăng ký, Đăng nhập (Hoạt động 1)
app.use('/api/auth', authRoutes); 

// /api/users cho Admin quản lý user (Hoạt động 3)
// Dòng này của bạn đã đúng!
app.use('/api/users', userRouter); 
// /api/profile cho Xem và Cập nhật profile (Hoạt động 2)
app.use('/api/profile', profile);

// --- Kết nối Database ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- Khởi động Server ---
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

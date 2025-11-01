require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors({
    // THÊM PORT 3002 VÀO ĐÂY
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
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

const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

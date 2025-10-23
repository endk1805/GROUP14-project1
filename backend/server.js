require('dotenv').config(); // 🔥 phải nằm ngay dòng đầu tiên!

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// 🔍 Kiểm tra giá trị MONGO_URI từ file .env
console.log('📂 MONGO_URI =', process.env.MONGO_URI);

// 🔗 Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const userRouter = require('./routes/userRoutes');
app.use('/api/users', userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

(code của nhánh frontend)

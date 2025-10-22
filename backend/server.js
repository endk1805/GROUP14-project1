// 1. Giữ lại dotenv ở dòng đầu tiên (từ nhánh frontend)
require('dotenv').config(); // 🔥 phải nằm ngay dòng đầu tiên!

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// 🔍 Kiểm tra giá trị MONGO_URI từ file .env
console.log('📂 MONGO_URI =', process.env.MONGO_URI);

// 🔗 Kết nối MongoDB (Giữ lại logic kết nối bằng .env)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 📦 Import router (Giữ lại cấu trúc router của frontend)
const userRouter = require('./routes/userRoutes');
app.use('/api/users', userRouter); // Đường dẫn chuẩn là /api/users

const PORT = process.env.PORT || 3000;

// 3. Giữ lại app.listen sạch sẽ (từ nhánh frontend)
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// 2. XÓA BỎ logic app.get, app.post... từ nhánh main
// vì logic này phải nằm trong file controller, không được nằm ở server.js
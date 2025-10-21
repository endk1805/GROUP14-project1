const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Enable CORS for all routes
app.use(cors({
    // THÊM PORT 3002 VÀO ĐÂY
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
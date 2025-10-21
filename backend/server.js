const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://phucvuong175_db_user:EiwJVmkHunE0RZvw@users.ytanauk.mongodb.net/?retryWrites=true&w=majority&appName=users")
  .then(() => console.log("✅ Kết nối MongoDB Atlas thành công"))
  .catch((err) => console.log("❌ Lỗi kết nối:", err));


const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

const User = require("./models/user");

// GET all
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// POST new user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const newUser = new User({ name, email });
  await newUser.save();
  res.json(newUser);
});


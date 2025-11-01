// --- File: backend/routes/userRoutes.js (Corrected) ---

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Dòng này sẽ kiểm tra xem các hàm đã được import đúng chưa
console.log("Các hàm đã import từ controller:", userController);

router.get('/', userController.getUsers);
router.post('/', userController.addUser);
router.put('/:id', userController.updateUser); // Dòng 8 đây
router.delete('/:id', userController.deleteUser);

module.exports = router;

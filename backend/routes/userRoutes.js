const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');

// Thay đổi ở đây: '/users' -> '/'
router.get('/', ctrl.getUsers); 

// Và thay đổi ở đây: '/users' -> '/'
router.post('/', ctrl.createUser);

module.exports = router;
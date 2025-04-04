const express = require('express');
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.post('/logout', auth, userController.logoutUser);

router.get('/profile', auth, userController.getUserProfile);

router.patch('/profile', auth, userController.updateUserProfile);

router.delete('/', auth, userController.deleteUser);

module.exports = router;
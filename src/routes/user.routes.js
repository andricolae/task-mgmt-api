const express = require('express');
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const validator = require('../middleware/validation');

const router = express.Router();

router.post('/register', validator.validateUserRegistration, userController.registerUser);

router.post('/login', validator.validateLogin, userController.loginUser);

router.post('/logout', auth, userController.logoutUser);

router.get('/profile', auth, userController.getUserProfile);

router.patch('/profile', auth, validator.validateUserUpdate, userController.updateUserProfile);

router.delete('/', auth, userController.deleteUser);

module.exports = router;
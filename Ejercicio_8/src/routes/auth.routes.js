const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');

router.get('/logout', authController.logout);
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
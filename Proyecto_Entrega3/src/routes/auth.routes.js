const authController = require('../controller/auth.controller');
const express = require('express');
const router = express.Router();

router.get('/logout', authController.logout);
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
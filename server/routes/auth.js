// server/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Folosiți funcțiile din controller direct
router.post('/register', authController.register);
router.post('/login', authController.login);

// Exportați routerul direct
module.exports = router;
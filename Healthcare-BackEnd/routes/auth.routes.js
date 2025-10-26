// backend/routes/auth.routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller'); // Will be created next

// POST /api/v1/auth/login
router.post('/login', authController.login);

// POST /api/v1/auth/register (For patient registration)
router.post('/register/patient', authController.registerPatient);

module.exports = router;
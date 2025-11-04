// backend/routes/auth.routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js'); // NOTE: Added .js extension for safety

// POST /api/v1/auth/login
router.post('/login', authController.login);

// POST /api/v1/auth/register/patient (Patient self-registration)
router.post('/register/patient', authController.registerPatient);

module.exports = router;
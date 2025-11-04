// backend/routes/auth.routes.js

const express = require('express');
const router = express.Router();
// CRITICAL: Ensure this file path and extension match the actual file on disk.
const authController = require('../controllers/auth.controller.js'); 

// POST /api/v1/auth/login
// This route handles user authentication and issues a JWT token.
router.post('/login', authController.login);

// POST /api/v1/auth/register/patient
// This route handles initial patient self-registration.
router.post('/register/patient', authController.registerPatient);

module.exports = router;
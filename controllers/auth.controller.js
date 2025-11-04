// backend/controllers/auth.controller.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// FIX: Import models correctly by removing the redundant .db property (Required for structural fix)
const { Patient, Doctor, Nurse } = require('../models/index'); 
const JWT_SECRET = process.env.JWT_SECRET || 'a_default_secret_for_development';

// Helper function for standardized success response
const successResponse = (res, message, data, code = 200) => {
    return res.status(code).json({
        status: "success",
        code: code,
        message: message,
        data: data,
        timestamp: new Date().toISOString(),
        requestId: 'req-placeholder' 
    });
};

// 1. Patient Registration (POST /api/v1/auth/register/patient)
exports.registerPatient = async (req, res) => {
    try {
        const { name, email, phone, dob, address, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); 

        const newPatient = await Patient.create({
            Name: name,
            Email: email,
            Phone: phone,
            DOB: dob,
            Address: address,
            PasswordHash: hashedPassword,
            Role: 'Patient' 
        });
        
        // 201 Created - Resource created successfully 
        return successResponse(res, "Patient registered successfully.", { id: newPatient.PatientID, email: newPatient.Email }, 201);

    } catch (error) {
        // Handle Sequelize validation/duplicate errors 
        if (error.name === 'SequelizeUniqueConstraintError') {
             // Return 409 Conflict
             return res.status(409).json({ status: "error", code: 409, message: "Registration failed: Email already in use." });
        }
        // Return 400 Bad Request
        return res.status(400).json({ status: "error", code: 400, message: "Registration failed.", errors: error.errors });
    }
};


// 2. User Login (POST /api/v1/auth/login)
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        // Determine which model to check based on the 'role'
        let Model;
        let idKey;
        
        if (role === 'Doctor') { Model = Doctor; idKey = 'DoctorID'; }
        else if (role === 'Nurse') { Model = Nurse; idKey = 'NurseID'; }
        else { Model = Patient; idKey = 'PatientID'; } 

        // Find the user by email
        const user = await Model.findOne({ where: { Email: email } });
        if (!user) {
            // Return 401 Unauthorized
            return res.status(401).json({ status: "error", code: 401, message: "Invalid email or password." });
        }

        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ status: "error", code: 401, message: "Invalid email or password." });
        }

        // Generate JWT with user ID and Role
        const token = jwt.sign(
            { id: user[idKey], role: user.Role }, 
            JWT_SECRET, 
            {
                expiresIn: '30m' // Adheres to 30-minute inactivity timeout
            }
        );

        // 200 OK - Successful request
        return successResponse(res, "Login successful.", {
            token,
            user: { id: user[idKey], name: user.Name, role: user.Role }
        }, 200);

    } catch (error) {
        // 500 Internal Server Error - Server-side error
        console.error("Login error:", error);
        return res.status(500).json({ status: "error", code: 500, message: "Internal server error during login." });
    }
};
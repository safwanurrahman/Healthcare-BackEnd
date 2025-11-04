// backend/controllers/auth.controller.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// FIX: Imports models directly from index (assuming clean structure)
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
            Name: name, Email: email, Phone: phone, DOB: dob, Address: address,
            PasswordHash: hashedPassword, Role: 'Patient' 
        });
        
        return successResponse(res, "Patient registered successfully.", { id: newPatient.PatientID, email: newPatient.Email }, 201);

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(409).json({ status: "error", code: 409, message: "Registration failed: Email already in use." });
        }
        return res.status(400).json({ status: "error", code: 400, message: "Registration failed.", errors: error.errors });
    }
};


// 2. User Login (POST /api/v1/auth/login)
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        let Model;
        let idKey;
        
        if (role === 'Doctor') { Model = Doctor; idKey = 'DoctorID'; }
        else if (role === 'Nurse') { Model = Nurse; idKey = 'NurseID'; }
        else { Model = Patient; idKey = 'PatientID'; } 

        const user = await Model.findOne({ where: { Email: email } });
        if (!user) {
            return res.status(401).json({ status: "error", code: 401, message: "Invalid email or password." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ status: "error", code: 401, message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { id: user[idKey], role: user.Role }, 
            JWT_SECRET, 
            { expiresIn: '30m' } 
        );

        return successResponse(res, "Login successful.", {
            token,
            user: { id: user[idKey], name: user.Name, role: user.Role }
        }, 200);

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ status: "error", code: 500, message: "Internal server error during login." });
    }
};
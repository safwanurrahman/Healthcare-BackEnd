// backend/controllers/auth.controller.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Patient, Doctor, Nurse } = require('../models/index').db; // Access your models
const JWT_SECRET = process.env.JWT_SECRET || 'a_default_secret_for_development';

// 1. Patient Registration (Initial registration only for Patients)
exports.registerPatient = async (req, res) => {
    try {
        const { name, email, phone, dob, address, password } = req.body;

        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10); 

        // 1. Create the new Patient record
        const newPatient = await Patient.create({
            Name: name,
            Email: email,
            Phone: phone,
            DOB: dob,
            Address: address,
            PasswordHash: hashedPassword, // Assuming you add a PasswordHash field to Patient model
            Role: 'Patient' // Store the role directly in the model for easy lookup
        });
        
        // 201 Created - Resource created successfully [cite: 302]
        res.status(201).json({
            status: "success",
            code: 201,
            message: "Patient registered successfully."
            // NOTE: Do not return the password hash!
        });

    } catch (error) {
        // Handle sequelize validation/duplicate errors (e.g., duplicate email = 409 Conflict)
        res.status(400).json({ status: "error", code: 400, message: "Registration failed.", errors: error.errors });
    }
};


// 2. User Login (Applicable for Patient, Doctor, Nurse, Admin)
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        // 1. Determine which model to check based on the 'role' submitted in the body
        let Model;
        if (role === 'Doctor') Model = Doctor;
        else if (role === 'Nurse') Model = Nurse;
        // NOTE: Admin model/logic would be handled separately in a production system.
        else Model = Patient; 

        // 2. Find the user by email
        const user = await Model.findOne({ where: { Email: email } });
        if (!user) {
            return res.status(401).json({ status: "error", code: 401, message: "Invalid email or password." });
        }

        // 3. Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ status: "error", code: 401, message: "Invalid email or password." });
        }

        // 4. Generate JWT with user ID and Role
        const token = jwt.sign(
            { id: user[`${role}ID`], role: user.Role }, 
            JWT_SECRET, 
            { expiresIn: '30m' } // 30-minute inactivity timeout for session management [cite: 867]
        );

        // 200 OK - Successful request [cite: 301]
        res.status(200).json({
            status: "success",
            code: 200,
            message: "Login successful.",
            data: {
                token,
                user: { id: user[`${role}ID`], name: user.Name, role: user.Role }
            }
        });

    } catch (error) {
        // 500 Internal Server Error - Server-side error [cite: 312]
        res.status(500).json({ status: "error", code: 500, message: "Internal server error during login." });
    }
};
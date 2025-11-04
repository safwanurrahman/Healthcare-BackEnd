// backend/controllers/doctor.controller.js

const { Doctor } = require('../models/index'); 

// Helper function for standardized success response (Defined once, used everywhere)
const successResponse = (res, message, data, code = 200) => {
    return res.status(code).json({
        status: "success",
        code: code,
        message: message,
        data: data,
        timestamp: new Date().toISOString(),
        requestId: 'req-placeholder' // Should be a unique ID in production
    });
};

// 1. POST /doctors (Create a new doctor profile) [cite: 183-184]
// RBAC: Admin only (enforced in route)
exports.createDoctor = async (req, res) => {
    try {
        // NOTE: In a real system, initial password hashing and role assignment would occur here.
        const newDoctor = await Doctor.create(req.body);
        return successResponse(res, "Doctor profile created successfully", newDoctor, 201); // 201 Created
    } catch (error) {
        // Handle sequelize unique constraint errors (e.g., duplicate email)
        if (error.name === 'SequelizeUniqueConstraintError') {
            // 409 Conflict - Resource conflict (duplicate appointment/email) [cite: 307]
            return res.status(409).json({ status: "error", code: 409, message: "Resource conflict: Email already registered." });
        }
        // 400 Bad Request - Client-side validation errors [cite: 303]
        return res.status(400).json({ status: "error", code: 400, message: "Validation failed.", errors: error.errors }); 
    }
};

// 2. GET /doctors (Retrieve list of all doctors) [cite: 180-181]
// RBAC: Admin, Doctor, Nurse can see all
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({ attributes: { exclude: ['PasswordHash'] } }); // Exclude sensitive fields
        return successResponse(res, "Retrieved list of all doctors", doctors); // 200 OK [cite: 301]
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" }); // 500 Internal Server Error [cite: 312]
    }
};

// 3. GET /doctors/:id (Retrieve details of a specific doctor) [cite: 182]
// RBAC: Admin sees all; Doctor can see their own
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findByPk(req.params.id, { attributes: { exclude: ['PasswordHash'] } });
        if (!doctor) {
            return res.status(404).json({ status: "error", code: 404, message: "Resource not found." }); // 404 Not Found [cite: 306]
        }
        return successResponse(res, `Retrieved doctor ID: ${req.params.id}`, doctor);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};

// 4. PUT /doctors/:id (Update doctor information) [cite: 185-186]
// RBAC: Admin or Doctor (updating own profile)
exports.updateDoctor = async (req, res) => {
    try {
        const [updated] = await Doctor.update(req.body, {
            where: { DoctorID: req.params.id }
        });
        if (updated) {
            const updatedDoctor = await Doctor.findByPk(req.params.id);
            return successResponse(res, "Doctor information updated successfully", updatedDoctor);
        }
        return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
    } catch (error) {
        return res.status(400).json({ status: "error", code: 400, message: "Validation failed.", errors: error.errors });
    }
};

// 5. DELETE /doctors/:id (Remove a doctor from the system) [cite: 187]
// RBAC: Admin only (enforced in route)
exports.deleteDoctor = async (req, res) => {
    try {
        const result = await Doctor.destroy({
            where: { DoctorID: req.params.id }
        });
        if (result === 0) {
            return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
        }
        return successResponse(res, "Doctor removed from the system", null);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};
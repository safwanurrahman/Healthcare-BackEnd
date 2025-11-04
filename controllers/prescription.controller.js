// backend/controllers/prescription.controller.js

const { Prescription } = require('../models/index'); 
// const successResponse = (res, message, data, code = 200) => {
//     return res.status(code).json({ status: "success", code: code, message: message, data: data });
// };

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


[cite_start]// 1. POST /prescriptions (Create a new prescription) [cite: 220-221] - Doctor/Admin Only
exports.createPrescription = async (req, res) => {
    try {
        const newPrescription = await Prescription.create(req.body);
        return successResponse(res, "Prescription created successfully", newPrescription, 201);
    } catch (error) {
        return res.status(400).json({ status: "error", code: 400, message: "Validation failed.", errors: error.errors });
    }
};

[cite_start]// 2. GET /prescriptions (List all prescriptions) [cite: 218-219]
exports.getAllPrescriptions = async (req, res) => {
    // NOTE: In a real app, this list is heavily filtered by DoctorID or PatientID.
    try {
        const prescriptions = await Prescription.findAll();
        return successResponse(res, "Retrieved list of all prescriptions", prescriptions);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};

// 3. GET /prescriptions/:id (Get prescription details)
exports.getPrescriptionById = async (req, res) => {
    try {
        const prescription = await Prescription.findByPk(req.params.id);
        if (!prescription) {
            return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
        }
        // NOTE: In controller, you'd check if req.user.id matches the prescription's PatientID/DoctorID.
        return successResponse(res, `Retrieved prescription ID: ${req.params.id}`, prescription);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};

[cite_start]// 4. PUT /prescriptions/:id (Update medication details) [cite: 222] - Doctor/Admin Only
exports.updatePrescription = async (req, res) => {
    try {
        const [updated] = await Prescription.update(req.body, { where: { PrescriptionID: req.params.id } });
        if (updated) {
            const updatedPrescription = await Prescription.findByPk(req.params.id);
            return successResponse(res, "Prescription updated successfully", updatedPrescription);
        }
        return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
    } catch (error) {
        return res.status(400).json({ status: "error", code: 400, message: "Validation failed.", errors: error.errors });
    }
};

[cite_start]// 5. DELETE /prescriptions/:id (Remove a prescription) [cite: 223] - Admin/Doctor Only
exports.deletePrescription = async (req, res) => {
    try {
        const result = await Prescription.destroy({ where: { PrescriptionID: req.params.id } });
        if (result === 0) {
            return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
        }
        return successResponse(res, "Prescription removed successfully", null);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};
// backend/controllers/medicalhistory.controller.js

const { MedicalHistory } = require('../models/index'); 
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


// 1. POST /medical-history (Create a new history record)
exports.createMedicalHistory = async (req, res) => {
    try {
        const newRecord = await MedicalHistory.create(req.body);
        return successResponse(res, "Medical history record created successfully", newRecord, 201);
    } catch (error) {
        return res.status(400).json({ status: "error", code: 400, message: "Validation failed.", errors: error.errors });
    }
};

// 2. GET /medical-history (List all records - Restricted in controller)
exports.getAllMedicalHistory = async (req, res) => {
    // NOTE: This should be heavily filtered by patient ID.
    try {
        const records = await MedicalHistory.findAll();
        return successResponse(res, "Retrieved list of all medical history records", records);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};

// 3. GET /medical-history/:id (Get a specific record)
exports.getMedicalHistoryById = async (req, res) => {
    try {
        const record = await MedicalHistory.findByPk(req.params.id);
        if (!record) {
            return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
        }
        return successResponse(res, `Retrieved medical history record ID: ${req.params.id}`, record);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};

// 4. PUT /medical-history/:id (Update a history record)
exports.updateMedicalHistory = async (req, res) => {
    try {
        const [updated] = await MedicalHistory.update(req.body, { where: { RecordID: req.params.id } });
        if (updated) {
            const updatedRecord = await MedicalHistory.findByPk(req.params.id);
            return successResponse(res, "Medical history record updated successfully", updatedRecord);
        }
        return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
    } catch (error) {
        return res.status(400).json({ status: "error", code: 400, message: "Validation failed.", errors: error.errors });
    }
};

// 5. DELETE /medical-history/:id (Delete a history record)
exports.deleteMedicalHistory = async (req, res) => {
    try {
        const result = await MedicalHistory.destroy({ where: { RecordID: req.params.id } });
        if (result === 0) {
            return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
        }
        return successResponse(res, "Medical history record removed successfully", null);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};
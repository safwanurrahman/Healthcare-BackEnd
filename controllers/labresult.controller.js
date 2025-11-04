// backend/controllers/labresult.controller.js

const { LabResult } = require('../models/index'); 
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


[cite_start]// 1. POST /lab-results (Upload new lab result) [cite: 232, 234] - Admin/Nurse Only
exports.createLabResult = async (req, res) => {
    try {
        const newLabResult = await LabResult.create(req.body);
        return successResponse(res, "Lab result uploaded successfully", newLabResult, 201);
    } catch (error) {
        return res.status(400).json({ status: "error", code: 400, message: "Validation failed.", errors: error.errors });
    }
};

[cite_start]// 2. GET /lab-results (Retrieve all lab results) [cite: 228-229]
exports.getAllLabResults = async (req, res) => {
    try {
        const labResults = await LabResult.findAll();
        return successResponse(res, "Retrieved list of all lab results", labResults);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};

[cite_start]// 3. GET /lab-results/:id (Get specific test result) [cite: 230-231]
exports.getLabResultById = async (req, res) => {
    try {
        const labResult = await LabResult.findByPk(req.params.id);
        if (!labResult) {
            return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
        }
        return successResponse(res, `Retrieved lab result ID: ${req.params.id}`, labResult);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};

[cite_start]// 4. PUT /lab-results/:id (Update test data) [cite: 233, 235] - Admin/Nurse Only
exports.updateLabResult = async (req, res) => {
    try {
        const [updated] = await LabResult.update(req.body, { where: { TestID: req.params.id } });
        if (updated) {
            const updatedLabResult = await LabResult.findByPk(req.params.id);
            return successResponse(res, "Lab result data updated successfully", updatedLabResult);
        }
        return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
    } catch (error) {
        return res.status(400).json({ status: "error", code: 400, message: "Validation failed.", errors: error.errors });
    }
};

[cite_start]// 5. DELETE /lab-results/:id (Delete a lab result) [cite: 236-237] - Admin/Nurse Only
exports.deleteLabResult = async (req, res) => {
    try {
        const result = await LabResult.destroy({ where: { TestID: req.params.id } });
        if (result === 0) {
            return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
        }
        return successResponse(res, "Lab result deleted successfully", null);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};
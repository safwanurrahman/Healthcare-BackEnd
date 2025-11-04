// backend/controllers/nurse.controller.js

const { Nurse } = require('../models/index'); 
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

// 1. POST /nurses (Add a new nurse) [cite: 205-206] - Admin Only
exports.createNurse = async (req, res) => {
    try {
        const newNurse = await Nurse.create(req.body);
        return successResponse(res, "Nurse profile created successfully", newNurse, 201);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ status: "error", code: 409, message: "Resource conflict: Email already registered." });
        }
        return res.status(400).json({ status: "error", code: 400, message: "Validation failed.", errors: error.errors });
    }
};

// 2. GET /nurses (Retrieve list of nurses) [cite: 201-202]
exports.getAllNurses = async (req, res) => {
    try {
        const nurses = await Nurse.findAll({ attributes: { exclude: ['PasswordHash'] } });
        return successResponse(res, "Retrieved list of all nurses", nurses);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};

// 3. GET /nurses/:id (Get nurse details) [cite: 203-204]
exports.getNurseById = async (req, res) => {
    try {
        const nurse = await Nurse.findByPk(req.params.id, { attributes: { exclude: ['PasswordHash'] } });
        if (!nurse) {
            return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
        }
        return successResponse(res, `Retrieved nurse ID: ${req.params.id}`, nurse);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};

// 4. PUT /nurses/:id (Update nurse profile) [cite: 207-208]
exports.updateNurse = async (req, res) => {
    try {
        const [updated] = await Nurse.update(req.body, { where: { NurseID: req.params.id } });
        if (updated) {
            const updatedNurse = await Nurse.findByPk(req.params.id);
            return successResponse(res, "Nurse profile updated successfully", updatedNurse);
        }
        return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
    } catch (error) {
        return res.status(400).json({ status: "error", code: 400, message: "Validation failed.", errors: error.errors });
    }
};

// 5. DELETE /nurses/:id (Remove nurse record) [cite: 209-210] - Admin Only
exports.deleteNurse = async (req, res) => {
    try {
        const result = await Nurse.destroy({ where: { NurseID: req.params.id } });
        if (result === 0) {
            return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
        }
        return successResponse(res, "Nurse record removed successfully", null);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};
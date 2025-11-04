// backend/controllers/appointment.controller.js

const { Appointment } = require('../models/index'); 
//const successResponse = (res, message, data, code = 200) => {
  //  return res.status(code).json({ status: "success", code: code, message: message, data: data });
//};
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



// 1. POST /appointments (Schedule a new appointment) [cite: 214]
exports.scheduleAppointment = async (req, res) => {
    // NOTE: Conflict prevention logic (checking doctor availability) is highly complex and not included here.
    try {
        const newAppointment = await Appointment.create(req.body);
        return successResponse(res, "Appointment scheduled successfully", newAppointment, 201);
    } catch (error) {
        return res.status(400).json({ status: "error", code: 400, message: "Validation or conflict failed.", errors: error.errors });
    }
};

// 2. GET /appointments (List all appointments) [cite: 212]
exports.getAllAppointments = async (req, res) => {
    // NOTE: Real RBAC requires filtering by DoctorID, PatientID, or NurseID
    try {
        const appointments = await Appointment.findAll();
        return successResponse(res, "Retrieved list of all appointments", appointments);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};

// 3. GET /appointments/:id (Get appointment details) [cite: 213]
exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (!appointment) {
            return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
        }
        return successResponse(res, `Retrieved appointment ID: ${req.params.id}`, appointment);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};

// 4. PUT /appointments/:id (Update appointment status or time) [cite: 215]
exports.updateAppointment = async (req, res) => {
    try {
        const [updated] = await Appointment.update(req.body, { where: { AppointmentID: req.params.id } });
        if (updated) {
            const updatedAppointment = await Appointment.findByPk(req.params.id);
            return successResponse(res, "Appointment updated successfully", updatedAppointment);
        }
        return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
    } catch (error) {
        return res.status(400).json({ status: "error", code: 400, message: "Validation failed.", errors: error.errors });
    }
};

// 5. DELETE /appointments/:id (Cancel an appointment) [cite: 216]
exports.cancelAppointment = async (req, res) => {
    // NOTE: Patient/Doctor can only cancel their own, as per RBAC matrix.
    try {
        const result = await Appointment.destroy({ where: { AppointmentID: req.params.id } });
        if (result === 0) {
            return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
        }
        return successResponse(res, "Appointment canceled successfully", null);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};

// Paste this code into ALL controller files:


// ... continue with exports.createEntity, exports.getAllEntities, etc.
// backend/controllers/patient.controller.js

const { Patient } = require('../models/index'); 

// Helper function for standardized success response (from design document)
// NOTE: Ensure this helper function is available in your doctor.controller.js and imported/defined here.
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

[cite_start]// 1. GET /patients (Retrieve list of all patients - RBAC critical) [cite: 191-192, 251]
// Patient can only see their own data; Admin/Doctor see all.
exports.getAllPatients = async (req, res) => {
    try {
        const role = req.user.role;
        const patientId = req.user.id;
        let queryOptions = { attributes: { exclude: ['PasswordHash'] } };

        // RBAC: Patient role is restricted to viewing only their own record.
        if (role === 'Patient') {
            queryOptions.where = { PatientID: patientId };
        } 
        // NOTE: Nurse logic ('Assigned patients') would require linking. 
        
        const patients = await Patient.findAll(queryOptions);
        return successResponse(res, `Retrieved patient list for role: ${role}`, patients);
    } catch (error) {
        console.error("Error retrieving patients:", error);
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" }); // 500 Internal Server Error
    }
};

[cite_start]// 2. GET /patients/:id (Retrieve specific patient details) [cite: 193, 251]
// Critical RBAC check: Only the patient themselves, Admin, Doctor, or Nurse should access this.
exports.getPatientById = async (req, res) => {
    const requestedId = parseInt(req.params.id);
    const { role, id: userId } = req.user; 
    
    // Custom RBAC Check: Patient can only access their own ID
    if (role === 'Patient' && userId !== requestedId) {
        return res.status(403).json({ status: "error", code: 403, message: "Forbidden: Cannot access other patient records." }); // 403 Forbidden
    }
    
    try {
        const patient = await Patient.findByPk(requestedId, { attributes: { exclude: ['PasswordHash'] } });
        if (!patient) {
            return res.status(404).json({ status: "error", code: 404, message: "Resource not found." }); // 404 Not Found
        }
        return successResponse(res, `Retrieved patient ID: ${requestedId}`, patient);
    } catch (error) {
        console.error("Error retrieving patient by ID:", error);
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};

[cite_start]// 3. PUT /patients/:id (Update patient information) [cite: 196-197, 251]
// RBAC: Only Admin or Patient themselves can update.
exports.updatePatient = async (req, res) => {
    const requestedId = parseInt(req.params.id);
    const { role, id: userId } = req.user; 
    
    // Custom RBAC Check: Patient can only update their own profile ('Own profile' matrix rule)
    if (role === 'Patient' && userId !== requestedId) {
        return res.status(403).json({ status: "error", code: 403, message: "Forbidden: You can only update your own profile." }); 
    }
    
    try {
        const [updated] = await Patient.update(req.body, {
            where: { PatientID: requestedId }
        });
        
        if (updated) {
            const updatedPatient = await Patient.findByPk(requestedId, { attributes: { exclude: ['PasswordHash'] } });
            return successResponse(res, "Patient information updated successfully", updatedPatient);
        }
        return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
        
    } catch (error) {
        return res.status(400).json({ status: "error", code: 400, message: "Validation failed.", errors: error.errors }); // 400 Bad Request
    }
};

[cite_start]// 4. DELETE /patients/:id (Delete a patient record) [cite: 198-199]
// RBAC: Strict Admin only for data integrity.
exports.deletePatient = async (req, res) => {
    // RBAC enforced by the restrictTo('Admin') middleware in the router.
    try {
        const result = await Patient.destroy({
            where: { PatientID: req.params.id }
        });
        
        if (result === 0) {
            return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
        }
        return successResponse(res, "Patient record deleted successfully", null); 
        
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};
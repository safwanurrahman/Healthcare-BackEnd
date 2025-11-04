// backend/routes/patient.routes.js

const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

const checkSelfOrHealthcare = (req, res, next) => {
    const requestedId = parseInt(req.params.id);
    const { role, id: userId } = req.user;

    // 1. Allow if Admin, Doctor, or Nurse (full access to view/treat)
    if (role === 'Admin' || role === 'Doctor' || role === 'Nurse') {
        return next();
    }
    
    // 2. Allow if Patient and ID matches the requested resource ID (Own data only rule )
    if (role === 'Patient' && userId === requestedId) {
        return next();
    }

    // 403 Forbidden - If none of the allowed roles/conditions are met
    return res.status(403).json({ 
        status: "error", 
        code: 403, 
        message: "Forbidden: Access restricted. Patients can only access their own record." 
    });
};

// Apply JWT verification to all patient routes
router.use(verifyToken); 

// Route 1: GET /patients - Retrieve list of all patients
// Admin sees all, Doctor sees all, Nurse sees assigned (future logic), Patient sees own (controller handles the restriction).
router.get('/', restrictTo('Admin', 'Doctor', 'Nurse', 'Patient'), patientController.getAllPatients); 

// Route 2: GET /patients/:id - Retrieve specific patient details
// Patient access is handled in the controller (must match ID).
router.get('/:id', restrictTo('Admin', 'Doctor', 'Nurse', 'Patient'), patientController.getPatientById);

// Route 3: PUT /patients/:id - Update patient information
// Admin and Patient can access this endpoint.
router.put('/:id', restrictTo('Admin', 'Patient'), patientController.updatePatient);

// Route 4: DELETE /patients/:id - Delete a patient record
// Strict Admin only access.
router.delete('/:id', restrictTo('Admin'), patientController.deletePatient);

module.exports = router;
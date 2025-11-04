// backend/routes/prescription.routes.js

const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescription.controller'); 
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

router.use(verifyToken); 

// Route 1: GET /prescriptions (List all prescriptions)
router.get('/', restrictTo('Admin', 'Doctor', 'Nurse', 'Patient'), prescriptionController.getAllPrescriptions); 

// Route 2: POST /prescriptions (Create a new prescription)
router.post('/', restrictTo('Admin', 'Doctor'), prescriptionController.createPrescription);

// Route 3: GET /prescriptions/:id
router.get('/:id', restrictTo('Admin', 'Doctor', 'Nurse', 'Patient'), prescriptionController.getPrescriptionById);

// Route 4: PUT /prescriptions/:id (Update medication details)
router.put('/:id', restrictTo('Admin', 'Doctor'), prescriptionController.updatePrescription);

// Route 5: DELETE /prescriptions/:id (Remove a prescription)
router.delete('/:id', restrictTo('Admin', 'Doctor'), prescriptionController.deletePrescription);

module.exports = router;
// backend/routes/medicalhistory.routes.js

const express = require('express');
const router = express.Router();
const medicalHistoryController = require('../controllers/medicalhistory.controller'); 
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

router.use(verifyToken); 

// Route 1: GET /medical-history (List all records)
router.get('/', restrictTo('Admin', 'Doctor', 'Nurse', 'Patient'), medicalHistoryController.getAllMedicalHistory); 

// Route 2: POST /medical-history (Create a new history record)
router.post('/', restrictTo('Admin', 'Doctor', 'Nurse'), medicalHistoryController.createMedicalHistory);

// Route 3: GET /medical-history/:id 
router.get('/:id', restrictTo('Admin', 'Doctor', 'Nurse', 'Patient'), medicalHistoryController.getMedicalHistoryById);

// Route 4: PUT /medical-history/:id (Update a history record)
router.put('/:id', restrictTo('Admin', 'Doctor', 'Nurse'), medicalHistoryController.updateMedicalHistory);

// Route 5: DELETE /medical-history/:id (Delete a history record)
router.delete('/:id', restrictTo('Admin'), medicalHistoryController.deleteMedicalHistory);

module.exports = router;
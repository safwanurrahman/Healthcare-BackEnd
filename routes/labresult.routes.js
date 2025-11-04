// backend/routes/labresult.routes.js

const express = require('express');
const router = express.Router();
const labResultController = require('../controllers/labresult.controller'); 
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

router.use(verifyToken); 

// Route 1: GET /lab-results (Retrieve all lab results)
router.get('/', restrictTo('Admin', 'Doctor', 'Nurse', 'Patient'), labResultController.getAllLabResults); 

// Route 2: POST /lab-results (Upload new lab result)
router.post('/', restrictTo('Admin', 'Nurse'), labResultController.createLabResult);

// Route 3: GET /lab-results/:id (Get specific test result)
router.get('/:id', restrictTo('Admin', 'Doctor', 'Nurse', 'Patient'), labResultController.getLabResultById);

// Route 4: PUT /lab-results/:id (Update test data)
router.put('/:id', restrictTo('Admin', 'Nurse'), labResultController.updateLabResult);

// Route 5: DELETE /lab-results/:id (Delete a lab result)
router.delete('/:id', restrictTo('Admin', 'Nurse'), labResultController.deleteLabResult);

module.exports = router;
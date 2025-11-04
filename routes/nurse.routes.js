// backend/routes/nurse.routes.js

const express = require('express');
const router = express.Router();
const nurseController = require('../controllers/nurse.controller');
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

router.use(verifyToken); 
// Note: The logic for "own profile only" for GET/PUT is assumed to be handled by a custom middleware 
// similar to the one created for Doctor/Patient, but we apply general roles for efficiency.

// Route 1: GET /nurses
router.get('/', restrictTo('Admin', 'Doctor'), nurseController.getAllNurses); 

// Route 2: POST /nurses (Add a new nurse)
router.post('/', restrictTo('Admin'), nurseController.createNurse);

// Route 3: GET /nurses/:id
router.get('/:id', restrictTo('Admin', 'Doctor', 'Nurse'), nurseController.getNurseById);

// Route 4: PUT /nurses/:id (Update nurse profile)
router.put('/:id', restrictTo('Admin', 'Nurse'), nurseController.updateNurse);

// Route 5: DELETE /nurses/:id (Remove nurse record)
router.delete('/:id', restrictTo('Admin'), nurseController.deleteNurse);

module.exports = router;
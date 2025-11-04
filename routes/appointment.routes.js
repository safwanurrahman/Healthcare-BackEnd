// backend/routes/appointment.routes.js

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

router.use(verifyToken); 

// Route 1: GET /appointments (List all appointments - Filtered by role in controller)
router.get('/', restrictTo('Admin', 'Doctor', 'Nurse', 'Patient'), appointmentController.getAllAppointments); 

// Route 2: POST /appointments (Schedule a new appointment)
router.post('/', restrictTo('Admin', 'Patient'), appointmentController.scheduleAppointment); 

// Route 3: GET /appointments/:id 
router.get('/:id', restrictTo('Admin', 'Doctor', 'Nurse', 'Patient'), appointmentController.getAppointmentById);

// Route 4: PUT /appointments/:id (Update status/time)
router.put('/:id', restrictTo('Admin', 'Doctor', 'Nurse'), appointmentController.updateAppointment);

// Route 5: DELETE /appointments/:id (Cancel an appointment) [cite: 251]
// RBAC: 'Own only' is specified in the matrix for Patient/Doctor. Controller handles this.
router.delete('/:id', restrictTo('Admin', 'Doctor', 'Patient'), appointmentController.cancelAppointment);

module.exports = router;
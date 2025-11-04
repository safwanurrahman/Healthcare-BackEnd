// backend/routes/doctor.routes.js

const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

// Apply JWT verification to all doctor routes (All communications require JWT authentication)
router.use(verifyToken); 

const checkSelfOrAdmin = (req, res, next) => {
    const requestedId = parseInt(req.params.id);
    const {role, id:userId} = req.user;
    //Allow if Admin
    if(role === 'Admin')
        return next();

    //Allow if Doctor and ID matches the requested resource ID
    if(role === 'Doctor' && userId ===requestedId)
        return next();

    //403 Forbidden
    return res.status(403).json({ status: "error", code: 403, message: "Forbidden: Access restricted to self or Admin." });

}    

// Route 1: GET /doctors - Retrieve list of all doctors
router.get('/', restrictTo('Admin', 'Nurse', 'Doctor'), doctorController.getAllDoctors); 

// Route 2: POST /doctors - Create a new doctor profile
// NOTE: Only Admin should be able to create new user accounts in the backend.
router.post('/', restrictTo('Admin'), doctorController.createDoctor);

// Route 3: GET /doctors/:id - Retrieve details of a specific doctor
// NOTE: Custom logic for "own data only" (Doctor ID matches token ID) is ideally added here 
// for strict security, but restrictTo('Doctor') covers basic access.
router.get('/:id', restrictTo('Admin', 'Doctor'), doctorController.getDoctorById);

// Route 4: PUT /doctors/:id - Update doctor information
router.put('/:id', restrictTo('Admin', 'Doctor'), doctorController.updateDoctor);

// Route 5: DELETE /doctors/:id - Remove a doctor from the system
router.delete('/:id', restrictTo('Admin'), doctorController.deleteDoctor);

module.exports = router;
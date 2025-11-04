// backend/routes/bill.routes.js

const express = require('express');
const router = express.Router();
const billController = require('../controllers/bill.controller'); 
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

router.use(verifyToken); 

// Route 1: GET /bills (List all bills - Filtered by role in controller)
router.get('/', restrictTo('Admin', 'Doctor', 'Patient'), billController.getAllBills); 

// Route 2: POST /bills (Generate a new bill)
router.post('/', restrictTo('Admin'), billController.createBill);

// Route 3: GET /bills/:id (View bill details)
router.get('/:id', restrictTo('Admin', 'Doctor', 'Patient'), billController.getBillById);

// Route 4: PUT /bills/:id (Update billing information)
router.put('/:id', restrictTo('Admin'), billController.updateBill);

// Route 5: DELETE /bills/:id (Remove a bill record)
router.delete('/:id', restrictTo('Admin'), billController.deleteBill);

module.exports = router;
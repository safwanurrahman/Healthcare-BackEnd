// backend/controllers/bill.controller.js

const { Bill } = require('../models/index'); 
// const successResponse = (res, message, data, code = 200) => {
//     return res.status(code).json({ status: "success", code: code, message: message, data: data });
// };

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


[cite_start]// 1. POST /bills (Generate a new bill) [cite: 242, 244] - Admin Only
exports.createBill = async (req, res) => {
    try {
        const newBill = await Bill.create(req.body);
        return successResponse(res, "Bill generated successfully", newBill, 201);
    } catch (error) {
        return res.status(400).json({ status: "error", code: 400, message: "Validation failed.", errors: error.errors });
    }
};

[cite_start]// 2. GET /bills (List all bills) [cite: 239]
exports.getAllBills = async (req, res) => {
    try {
        const bills = await Bill.findAll();
        return successResponse(res, "Retrieved list of all bills", bills);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};

[cite_start]// 3. GET /bills/:id (View bill details) [cite: 240-241]
exports.getBillById = async (req, res) => {
    try {
        const bill = await Bill.findByPk(req.params.id);
        if (!bill) {
            return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
        }
        return successResponse(res, `Retrieved bill ID: ${req.params.id}`, bill);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};

[cite_start]// 4. PUT /bills/:id (Update billing information - typically status/payment) [cite: 243, 245] - Admin Only
exports.updateBill = async (req, res) => {
    try {
        const [updated] = await Bill.update(req.body, { where: { BillID: req.params.id } });
        if (updated) {
            const updatedBill = await Bill.findByPk(req.params.id);
            return successResponse(res, "Billing information updated successfully", updatedBill);
        }
        return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
    } catch (error) {
        return res.status(400).json({ status: "error", code: 400, message: "Validation failed.", errors: error.errors });
    }
};

[cite_start]// 5. DELETE /bills/:id (Remove a bill record) [cite: 246-247] - Admin Only
exports.deleteBill = async (req, res) => {
    try {
        const result = await Bill.destroy({ where: { BillID: req.params.id } });
        if (result === 0) {
            return res.status(404).json({ status: "error", code: 404, message: "Resource not found." });
        }
        return successResponse(res, "Bill record removed successfully", null);
    } catch (error) {
        return res.status(500).json({ status: "error", code: 500, message: "Internal Server Error" });
    }
};


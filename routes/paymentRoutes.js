const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authenticate = require("../middlewares/authMiddleware");

router.post("/order", authenticate, paymentController.createOrder);
router.post("/verify", authenticate, paymentController.verifyPayment);

module.exports = router;

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken)

// Cart operations
router.post('/cart/add',orderController.addToCart);
router.get('/cart', orderController.getCartDetails);

// Checkout
router.post('/checkout', orderController.checkout);

module.exports = router;
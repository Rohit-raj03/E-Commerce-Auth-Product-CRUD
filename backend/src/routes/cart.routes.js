const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} = require('../controllers/cart.controller');

// All cart operations require authentication
router.use(authenticateToken);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:productId', updateCartItemQuantity);
router.delete('/item/:productId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;

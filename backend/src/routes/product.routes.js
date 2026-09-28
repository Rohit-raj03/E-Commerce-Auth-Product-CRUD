const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getSellerProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const {
  productValidator,
  productIdValidator,
} = require('../validators/product.validator');
const validate = require('../middleware/validation.middleware');
const authenticateToken = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// Public product routes (User + Seller)
router.get('/', getProducts);

// Seller-specific products (Seller only)
router.get(
  '/seller/my-products',
  authenticateToken,
  roleMiddleware('seller'),
  getSellerProducts
);

router.get('/:id', productIdValidator, validate, getProductById);

// Protected product CRUD routes (Strictly Seller only)
router.post(
  '/',
  authenticateToken,
  roleMiddleware('seller'),
  productValidator,
  validate,
  createProduct
);

router.put(
  '/:id',
  authenticateToken,
  roleMiddleware('seller'),
  productIdValidator,
  productValidator,
  validate,
  updateProduct
);

router.delete(
  '/:id',
  authenticateToken,
  roleMiddleware('seller'),
  productIdValidator,
  validate,
  deleteProduct
);

module.exports = router;

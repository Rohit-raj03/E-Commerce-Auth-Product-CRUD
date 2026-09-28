const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
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

// Public product routes
router.get('/', getProducts);
router.get('/:id', productIdValidator, validate, getProductById);

// Protected product routes (require JWT authentication)
router.post('/', authenticateToken, productValidator, validate, createProduct);
router.put(
  '/:id',
  authenticateToken,
  productIdValidator,
  productValidator,
  validate,
  updateProduct
);
router.delete('/:id', authenticateToken, productIdValidator, validate, deleteProduct);

module.exports = router;

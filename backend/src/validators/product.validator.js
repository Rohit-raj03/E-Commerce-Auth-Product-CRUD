const { body, param } = require('express-validator');

const productValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .notEmpty()
    .withMessage('Stock count is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('image')
    .trim()
    .notEmpty()
    .withMessage('Product image URL is required'),
];

const productIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid MongoDB product ID format'),
];

module.exports = {
  productValidator,
  productIdValidator,
};

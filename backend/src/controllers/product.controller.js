const Product = require('../models/Product');

/**
 * Create a new product
 * POST /api/products (Protected)
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, image } = req.body;

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      image,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all products
 * GET /api/products (Public)
 */
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single product by ID
 * GET /api/products/:id (Public)
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing product by ID
 * PUT /api/products/:id (Protected)
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        errors: [],
      });
    }

    const { name, description, price, stock, image } = req.body;

    product.name = name !== undefined ? name : product.name;
    product.description = description !== undefined ? description : product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.image = image !== undefined ? image : product.image;

    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a product by ID
 * DELETE /api/products/:id (Protected)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        errors: [],
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

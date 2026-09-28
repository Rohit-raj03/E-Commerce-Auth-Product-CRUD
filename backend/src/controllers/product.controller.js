const Product = require('../models/Product');

/**
 * Create a new product (Seller only)
 * POST /api/products
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, image, category } = req.body;

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      image,
      category: category ? category.trim() : 'General',
      sellerId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all products (Public - for both User & Seller)
 * GET /api/products
 */
const getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      filter.category = { $regex: `^${category}$`, $options: 'i' };
    }

    const products = await Product.find(filter)
      .populate('sellerId', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get products created by the logged-in seller (Seller only)
 * GET /api/products/seller/my-products
 */
const getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ sellerId: req.user.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single product by ID (Public)
 * GET /api/products/:id
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId', 'name email role');

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
 * Update an existing product by ID (Seller only)
 * PUT /api/products/:id
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

    // Ensure the seller owns this product
    if (product.sellerId && product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only update products you created.',
        errors: [],
      });
    }

    const { name, description, price, stock, image, category } = req.body;

    product.name = name !== undefined ? name : product.name;
    product.description = description !== undefined ? description : product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.image = image !== undefined ? image : product.image;
    product.category = category !== undefined ? category.trim() : product.category;

    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a product by ID (Seller only)
 * DELETE /api/products/:id
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

    // Ensure the seller owns this product
    if (product.sellerId && product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only delete products you created.',
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
  getSellerProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

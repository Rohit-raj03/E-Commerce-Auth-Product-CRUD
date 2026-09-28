const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Get current user's cart
 * GET /api/cart
 */
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    // Filter out items where product may have been deleted
    cart.items = cart.items.filter((item) => item.product !== null);

    // Calculate totals
    let totalItems = 0;
    let totalPrice = 0;

    const formattedItems = cart.items.map((item) => {
      const p = item.product;
      const subtotal = (p.price || 0) * item.quantity;
      totalItems += item.quantity;
      totalPrice += subtotal;

      return {
        _id: item._id,
        productId: p._id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
        stock: p.stock,
        quantity: item.quantity,
        subtotal,
      };
    });

    return res.status(200).json({
      success: true,
      cart: {
        id: cart._id,
        items: formattedItems,
        totalItems,
        totalPrice,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add product to cart
 * POST /api/cart/add
 */
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: 'This product is out of stock',
      });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    const addedQty = Math.max(1, Number(quantity));

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + addedQty;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Available stock limit is ${product.stock}.`,
        });
      }
      cart.items[itemIndex].quantity = newQty;
    } else {
      if (addedQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Requested quantity exceeds available stock (${product.stock}).`,
        });
      }
      cart.items.push({ product: productId, quantity: addedQty });
    }

    await cart.save();
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * Update cart item quantity
 * PUT /api/cart/item/:productId
 */
const updateCartItemQuantity = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const numQty = Number(quantity);
    if (isNaN(numQty) || numQty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (numQty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Quantity cannot exceed available stock (${product.stock})`,
      });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.find((it) => it.product.toString() === productId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Product not in cart',
      });
    }

    item.quantity = numQty;
    await cart.save();

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove an item from cart
 * DELETE /api/cart/item/:productId
 */
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * Clear cart / Checkout
 * DELETE /api/cart/clear
 */
const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
};

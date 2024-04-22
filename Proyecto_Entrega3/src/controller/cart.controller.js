const CartDao = require('../dao/Cart.dao');

const cartService = new CartDao();

exports.getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createCart = async (req, res) => {
  try {
    const newCart = await cartService.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params; // Corregido a pid
    const updatedCart = await cartService.addProductToCart(cid, pid);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params; // Corregido a pid
    const updatedCart = await cartService.removeProductFromCart(cid, pid);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { productId } = req.body;
    const updatedCart = await cartService.updateCart(cid, productId);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProductQuantityInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params; // Corregido a pid
    const { quantity } = req.body;
    const updatedCart = await cartService.updateProductQuantityInCart(cid, pid, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.removeAllProductsFromCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedCart = await cartService.removeAllProductsFromCart(cid);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
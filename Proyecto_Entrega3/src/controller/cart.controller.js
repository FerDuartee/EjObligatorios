import CartDao from '../dao/cart.dao.js'

const cartService = new CartDao();

export const getCartById = async (req, res) => {
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

export const getCartByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // Suponiendo que el ID del usuario está en los parámetros de la solicitud
    const cart = await cartService.getCartByUserId(userId);
    
    if (!cart) {
      return res.status(404).json({ message: "No se encontró el carrito para el usuario." });
    }
    
    return res.json(cart);
  } catch (error) {
    console.error("Error while getting cart by user ID:", error);
    return res.status(500).json({ message: "Error al obtener el carrito por ID de usuario." });
  }
};

export const createCart = async (req, res) => {
  try {
    const newCart = await cartService.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params; // Corregido a pid
    const updatedCart = await cartService.addProductToCart(cid, pid);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params; // Corregido a pid
    const updatedCart = await cartService.removeProductFromCart(cid, pid);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCart = async (req, res) => {
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

export const updateProductQuantityInCart = async (req, res) => {
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

export const removeAllProductsFromCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedCart = await cartService.removeAllProductsFromCart(cid);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const purchaseCart = async (req, res) => {
  const { cid } = req.params;

  try {
    const result = await cartService.purchaseCart(cid);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error al procesar la compra:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
import CartDao from '../dao/cart.dao.js'
import ProductDao from '../dao/Product.dao.js';
import TicketDAO from '../dao/ticket.dao.js';

const cartService = new CartDao();
const productService = new ProductDao();
const ticketService = new TicketDAO();

export const getCartById = async (req, res) => {
  try {
    const cartId  = req.params.cid;
    const cart = await cartService.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserCart = async (req, res) => {
  const userId = req.params.userId;
  try {
    const cartItems = await userDAO.getUserCart(userId);
    res.render('cart', { cartItems }); // Renderiza la vista 'cart' con los datos del carrito
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

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
  try {
    const cartId = req.params.cid;

    // Obtener el carrito
    const cart = await cartService.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Verificar el stock de cada producto en el carrito
    const { productsToPurchase, productsNotPurchased } = await verifyStock(cart.products);
    console.log(productsToPurchase);
    console.log(productsNotPurchased);

    // Acceder a cada objeto 'product' dentro de 'productsToPurchase'
    const productData = productsToPurchase.map(item => item.product);

    // Acceder a cada precio de producto dentro de productData
    const prices = productData.map(product => product.price);

    // Generar un ticket con los datos de la compra
    const ticketData = {
      code: generateTicketCode(),
      user: cart.user,
      products: productData,
      prices: prices, // Aquí agregamos los precios al ticketData
      amount: calculateTotal(productsToPurchase),
    };
    console.log(ticketData);
    const ticket = await ticketService.createTicket(ticketData);   

    // Enviar respuesta con el ticket y los productos no comprados
    res.status(200).json({ ticket, productsNotPurchased });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function verifyStock(cartItems) {
  const productsToPurchase = [];
  const productsNotPurchased = [];

  if (!Array.isArray(cartItems)) {
    throw new Error('Cart items is not an array');
  }

  for (const cartItem of cartItems) {
    const productId = cartItem.product._id;
    const product = cartItem.product; 

    if (!product || product.stock < cartItem.quantity) {
      productsNotPurchased.push(productId);
    } else {
      productsToPurchase.push(cartItem);
    }
  }

  return { productsToPurchase, productsNotPurchased };
}

function calculateTotal(productsToPurchase) {
  let total = 0;

  for (const product of productsToPurchase) {
    total += product.product.price * product.quantity;
  }

  return total;
}

function generateTicketCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 6;
  let code = '';
  
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  
  return 'T-' + code;
}
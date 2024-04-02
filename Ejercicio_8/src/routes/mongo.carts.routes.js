const { Router } = require("express");
const cartController = require('../controller/cart.controller');
const router = Router();

console.log("STARTING CART MANAGER");

// Ruta para mostrar un carrito de compras
router.get('/:cid', cartController.getCartById);

// Ruta para crear un carrito de compras
router.post('/', cartController.createCart);

// Ruta para agregar productos a un carrito de compras
router.post('/:cid/product/:pid', cartController.addProductToCart);

// Ruta para eliminar un producto de un carrito de compras
router.delete('/:cid/product/:pid', cartController.removeProductFromCart);

// Ruta para actualizar un carrito de compras
router.put('/:cid', cartController.updateCart);

// Ruta para actualizar la cantidad de un producto en el carrito
router.put('/:cid/product/:pid', cartController.updateProductQuantityInCart);

// Ruta para eliminar todos los productos de un carrito de compras
router.delete('/:cid', cartController.removeAllProductsFromCart);

module.exports = router;
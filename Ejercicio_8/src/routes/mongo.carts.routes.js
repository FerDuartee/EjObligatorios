const { Router } = require("express");
const cartController = require('../controller/cart.controller');
const router = Router();

console.log("STARTING CART MANAGER");

router.get('/:cid', cartController.getCartById);
router.post('/', cartController.createCart);
router.post('/:cid/product/:pid', cartController.addProductToCart);
router.put('/:cid', cartController.updateCart);
router.put('/:cid/product/:pid', cartController.updateProductQuantityInCart);
router.delete('/:cid', cartController.removeAllProductsFromCart);
router.delete('/:cid/product/:pid', cartController.removeProductFromCart);

module.exports = router;
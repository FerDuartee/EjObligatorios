import { Router } from 'express';
import {
    getCartById,
    createCart,
    addProductToCart,
    updateCart,
    updateProductQuantityInCart,
    removeAllProductsFromCart,
    removeProductFromCart,
} from "../controller/cart.controller.js";

const router = Router();
console.log("STARTING CART MANAGER");

router.get('/:cid', getCartById);
router.post('/', createCart);
router.post('/:cid/product/:pid', addProductToCart);
router.put('/:cid', updateCart);
router.put('/:cid/product/:pid', updateProductQuantityInCart);
router.delete('/:cid', removeAllProductsFromCart);
router.delete('/:cid/product/:pid', removeProductFromCart);

export default router;
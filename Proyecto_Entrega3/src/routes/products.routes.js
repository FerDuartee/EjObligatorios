import { Router } from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controller/product.controller.js";
import authMdw from '../middleware/auth.middleware.js';

const router = Router();

console.log("STARTING PRODUCT MANAGER");

router.get("/",authMdw, getAllProducts);
router.get("/:pid", getProductById);
router.post("/", createProduct);
router.put("/:pid", updateProduct);
router.delete("/:pid", deleteProduct);

export default router;
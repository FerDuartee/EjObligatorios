import { Router } from 'express';
import viewsController from '../controller/views.controller.js';
import authMdw from '../middleware/auth.middleware.js';

const router = Router();

// Rutas de autenticación
router.get("/login", viewsController.getLoginPage);
router.post("/login", viewsController.postLogin);
router.get("/faillogin", viewsController.getFailLogin);
router.get("/register", viewsController.getRegisterPage);
router.post("/register", viewsController.postRegister);
router.get("/failregister", viewsController.getFailRegister);
router.get(`/profile`, authMdw, viewsController.getProfilePage);

// Rutas de productos
router.get('/products', authMdw, viewsController.getProductsPage);
router.get('/carts/:cid', authMdw, viewsController.getCartPage);
router.get('/', authMdw, viewsController.getHomePage);
router.get('/realtimeproducts', authMdw, viewsController.getRealTimeProductsPage);
router.get("/chat", viewsController.getChatPage);

// API endpoint
router.get('/api/session/current', authMdw, viewsController.getCurrentSession);

export default router;
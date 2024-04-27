import { Router } from 'express';
import {
    getLoginPage,
    postLogin,
    postRegister,
    getFailLogin,
    getProductsPage,
    getRegisterPage,
    getCartPage,
    getProfilePage,
    getFailRegister,
    getHomePage,
    getRealTimeProductsPage,
    getChatPage,
    getCurrentSession,
} from '../controller/views.controller.js'
import authMdw from '../middleware/auth.middleware.js';

const router = Router();

// Rutas de autenticación
router.get("/login", getLoginPage);
router.post("/login", postLogin);
router.get("/faillogin", getFailLogin);
router.get("/register", getRegisterPage);
router.post("/register", postRegister);
router.get("/failregister", getFailRegister);
router.get(`/profile`, authMdw, getProfilePage);

// Rutas de productos
router.get('/products', authMdw, getProductsPage);
router.get('/carts/:cid', authMdw, getCartPage);
router.get('/', authMdw, getHomePage);
router.get('/realtimeproducts', authMdw, getRealTimeProductsPage);
router.get("/chat", getChatPage);

// API endpoint
router.get('/api/session/current', authMdw, getCurrentSession);

export default router;
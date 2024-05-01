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
    renderPage,
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
router.get('/products', authMdw, getProductsPage, renderPage);
router.get('/', authMdw, getHomePage);
router.get('/realtimeproducts', authMdw, getRealTimeProductsPage);

// Ruta de carrito
router.get('/carts/:cid', authMdw, getCartPage);

// Ruta de chat
router.get("/chat", authMdw, getChatPage);

// API endpoint
router.get('/api/session/current', authMdw, getCurrentSession);

export default router;
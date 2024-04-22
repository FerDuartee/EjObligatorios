const express = require('express');
const router = express.Router();
const viewsController = require('../controller/views.controller');
const authMdw = require('../middleware/auth.middleware'); // Importamos el middleware

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

module.exports = router;
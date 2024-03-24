const { Router } = require("express");
const path = require('path');
const authMdw = require('../middleware/auth.middleware');
const ProductManager = require('../dao/fileSystem/ProductManager');
const productsModel = require('../dao/mongoDb/models/products.model');
const cartsModel = require('../dao/mongoDb/models/carts.models');
const passport = require("passport");
const pathBase = path.join(__dirname, '../dao/fileSystem/productos.json');
const productManager = new ProductManager(pathBase);
const router = Router();

router.get("/login", async (req, res) => {
    res.render("login");
});

// Login - POST
router.post(
    "/login",
    passport.authenticate("login", {
        successRedirect: "/products",
        failureRedirect: "/faillogin",
        failureFlash: true,
    })
);

router.get("/faillogin", async (req, res) => {
    res.send({ error: "login strategy failed" });
});

router.get("/register", async (req, res) => {
    res.render("register");
});

// Register - POST
router.post(
    "/register",
    passport.authenticate("register", {
        successRedirect: "/login",
        failureRedirect: "/failregister",
        failureFlash: true,
    })
);

router.get("/failregister", async (req, res) => {
    res.send({ error: "register strategy failed" });
});

router.get(`/profile`, authMdw, async (req, res) => {
    try {
        // Obtiene los datos del usuario de la sesión
        const user = req.session.user;

        // Renderiza la plantilla de perfil con los datos del usuario
        res.render("profile", { user: user });
    } catch (error) {
        console.error('Error al obtener perfil de usuario:', error);
        res.status(500).send('Error interno del servidor.');
    }
});

// Ruta para mostrar todos los productos con paginación
router.get('/products', authMdw, async (req, res) => {
    try {
        const options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            lean: true
        };
        const user = req.session.user;
        const products = await productsModel.paginate({}, options);
        res.render('products', { user: user, products: products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para mostrar un carrito específico
router.get('/carts/:cid', authMdw, async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartsModel.findById(cartId).populate('products.product').lean(); //.lean es importante para vincular con hdb
        res.render('cart', { cart: cart });
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


// Ruta para mostrar todos los productos sin Socket.IO
router.get('/', authMdw, async (req, res) => {
    try {
        const limit = Number(req.query.limit);
        let products = await productManager.getProducts();

        if (limit && !isNaN(limit) && limit > 0) {
            products = products.filter((product, index) => index < limit);
        }

        // Renderizar la vista y pasar los productos como datos
        res.render('home', {
            products: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.');
    }
});

// Ruta para mostrar todos los productos con Socket.IO
router.get('/realtimeproducts', authMdw, async (req, res) => {
    try {
        const limit = Number(req.query.limit);
        let products = await productManager.getProducts();

        if (limit && !isNaN(limit) && limit > 0) {
            products = products.filter((product, index) => index < limit);
        }

        // Renderizar la vista y pasar los productos como datos
        res.render('realTimeProducts', {
            products: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.');
    }
});

// Ruta para mostrar chat con socket.IO
router.get("/chat", (req, res) => {
    res.render("chat", {})
})

router.get('/api/session/current', authMdw, (req, res) => {
    // Verificar si hay un usuario autenticado en la sesión
    if (req.session.user) {
        // Devolver el usuario actualmente autenticado
        return res.json({
            success: true,
            message: "Usuario autenticado",
            user: req.session.user
        });
    } else {
        // Si no hay un usuario autenticado, devolver un mensaje de error
        return res.status(401).json({ 
            success: false,
            message: "No hay usuario autenticado" 
        });
    }
});

module.exports = router;
const { Router } = require("express");
const authMdw = require('../middleware/auth.middleware');
const cartsModel = require('../dao/mongoDb/models/carts.models');
const passport = require("passport");
const productsModel = require('../dao/mongoDb/models/products.model');
const router = Router();

// Rutas de autenticación
router.route("/login")
    .get(async (req, res) => {
        res.render("login");
    })
    .post(passport.authenticate("login", {
        successRedirect: "/products",
        failureRedirect: "/faillogin",
        failureFlash: true,
    }));

router.get("/faillogin", async (req, res) => {
    res.send({ error: "login strategy failed" });
});

router.get("/register", async (req, res) => {
    res.render("register");
});

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
        const user = req.session.user;
        res.render("profile", { user: user });
    } catch (error) {
        console.error('Error al obtener perfil de usuario:', error);
        res.status(500).send('Error interno del servidor.');
    }
});

// Rutas de productos
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

router.get('/carts/:cid', authMdw, async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartsModel.findById(cartId).populate('products.product').lean();
        res.render('cart', { cart: cart });
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.get('/', authMdw, async (req, res) => {
    try {
        const limit = Number(req.query.limit);
        let products = await productManager.getProducts();

        if (limit && !isNaN(limit) && limit > 0) {
            products = products.filter((product, index) => index < limit);
        }

        res.render('home', { products: products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.');
    }
});

router.get('/realtimeproducts', authMdw, async (req, res) => {
    try {
        const limit = Number(req.query.limit);
        let products = await productManager.getProducts();

        if (limit && !isNaN(limit) && limit > 0) {
            products = products.filter((product, index) => index < limit);
        }

        res.render('realTimeProducts', { products: products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.');
    }
});

router.get("/chat", (req, res) => {
    res.render("chat", {})
})

// API endpoint
router.get('/api/session/current', authMdw, (req, res) => {
    if (req.session) {
        return res.json({
            success: true,
            message: "Usuario autenticado",
            session: req.session
        });
    } else {
        return res.status(401).json({
            success: false,
            message: "No hay usuario autenticado"
        });
    }
});

module.exports = router;
const { Router } = require("express");
const authMdw = require('../middleware/auth.middleware');
const cartsModel = require('../dao/mongoDb/models/carts.models');
const productsModel = require('../dao/mongoDb/models/products.model');

const router = Router();

router.get(`/login`, async (req, res) => {
    res.render("login");
});

router.get(`/register`, async (req, res) => {
    res.render("register");
});

router.get(`/profile`, authMdw, async (req, res) => {

    // Obtiene los datos del usuario de la sesión
    const user = req.session.user;

    // Renderiza la plantilla de perfil con los datos del usuario
    res.render("profile", { user });
});

// Ruta para mostrar todos los productos con paginación
router.get('/products', authMdw,async (req, res) => {
    try {
        const options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            lean: true
        };
        const user = req.session.user;
        const products = await productsModel.paginate({}, options);
        res.render('products', { products: products },{user});
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para mostrar un carrito específico
router.get('/carts/:cid', async (req, res) => {
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
router.get('/', async (req, res) => {
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
router.get('/realtimeproducts', async (req, res) => {
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

module.exports = router;
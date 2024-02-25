const { Router } = require("express");
const path = require('path');
const ProductManager = require('../dao/fileSystem/ProductManager');
const productsModel = require('../dao/mongoDb/models/products.model');
const cartsModel = require('../dao/mongoDb/models/carts.models');

const pathBase = path.join(__dirname, '../dao/fileSystem/productos.json');
const productManager = new ProductManager(pathBase);

const router = Router();

// Ruta para mostrar todos los productos con paginación
router.get('/products', async (req, res) => {
    try {
        const options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            lean: true 
        };

        const products = await productsModel.paginate({}, options);
        res.render('products', { products: products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para mostrar un carrito específico
router.get('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartsModel.findById(cartId).populate('products.product').lean();
        res.render('cart', { cart: cart });
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

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

router.get("/chat", (req, res) => {
  res.render("chat", {})
})

module.exports = router;
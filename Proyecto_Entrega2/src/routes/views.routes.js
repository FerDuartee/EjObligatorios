const { Router } = require("express");
const path = require('path');
const ProductManager = require('../dao/fileSystem/ProductManager');

const pathBase = path.join(__dirname, '../dao/fileSystem/productos.json');
const productManager = new ProductManager(pathBase);

const router = Router();

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
const { Router } = require("express");
const path = require('path');
const ProductManager = require('../dao/fileSystem/ProductManager');

const pathBase = path.join(__dirname, '../dao/fileSystem/productos.json');
const productManager = new ProductManager(pathBase);

const router = Router();

console.log("STARTING PRODUCT MANANGER");

router.get('/', async (req, res) => {
    try {
        const limit = Number(req.query.limit);
        let products = await productManager.getProducts();

        if (limit && !isNaN(limit) && limit > 0) {
            products = products.filter((product, index) => index < limit);
        }
        res.json(products);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.');
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductsbyId(Number(productId));

        if (product) {
            res.json(product);
        } else {
            res.status(404).send(`Producto no encontrado.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.');
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = req.body;

        if (
            !newProduct.title
            || !newProduct.description
            || !newProduct.code
            || !newProduct.price
            || !newProduct.stock
            || !newProduct.category
        ) {
            return res.status(400).send('Faltan datos obligatorios.');
        }

        newProduct.thumbnail = Array.isArray(newProduct.thumbnail) ? newProduct.thumbnail : [newProduct.thumbnail];

        const createdProduct = await productManager.createProduct(newProduct);

        if (createdProduct) {
            res.status(201).json(createdProduct);
            req.app.get('io').emit('newProduct_ev', { product: createdProduct });
        } else {
            res.status(400).send('Error al crear el producto.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.');
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;

        const deletedProduct = await productManager.deleteProduct(Number(productId));
        if (deletedProduct) {
            res.status(200).send('Producto eliminado correctamente.');
            req.app.get('io').emit('deletedProduct_ev', productId);

            const updatedProducts = await productManager.getProducts();
            req.app.get('io').emit('getProducts_ev', updatedProducts);
        }
        else {
            console.error(error);
            res.status(500).send('Error interno del servidor.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.');
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedProduct = req.body;

        if (
            !updatedProduct.title ||
            !updatedProduct.description ||
            !updatedProduct.code ||
            !updatedProduct.price ||
            !updatedProduct.stock ||
            !updatedProduct.category
        ) {
            return res.status(400).send('Faltan datos obligatorios.');
        }

        updatedProduct.thumbnail = Array.isArray(updatedProduct.thumbnail) ? updatedProduct.thumbnail : [updatedProduct.thumbnail];

        await productManager.updateProduct(Number(productId), updatedProduct);

        res.status(200).send('Producto actualizado correctamente.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.');
    }
});

module.exports = router;
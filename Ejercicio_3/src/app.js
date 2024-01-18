const express = require('express');
const path = require('path');
const ProductManager = require('./ProductManager');

const app = express();
const port = 8080;

const pathBase = path.join(__dirname, '../db.json');
const productManager = new ProductManager(pathBase);

const projectProduct = async () => {
    console.log("INICIANDO EL MANEJADOR DE PRODUCTOS");

    app.get('/products', async (req, res) => {
        try {
            const limit = Number(req.query.limit);
            let products = await productManager.getProducts();

            if (
                limit &&
                !isNaN(limit) &&
                limit > 0) {
                products = products.filter((product, index) => index < limit);
            }
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor');
        }
    });

    app.get('/products/:id', async (req, res) => {
        try {
            const productId = req.params.id;
            const product = await productManager.getProductsbyId(Number(productId)); // Convertir a número

            if (product) {
                res.json(product);
            } else {
                res.status(404).send('Producto no encontrado');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor');
        }
    });

    app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`);
    });
};

projectProduct();
const { Router } = require("express");
const path = require('path');
const ProductManagerMongo = require('../dao/mongoDb/managers/Product.Manager');

const pathBase = path.join(__dirname, '../dao/fileSystem/productos.json');
const productManager = new ProductManagerMongo(pathBase);

const productsData = require("../dao/mongoDb/data/carts");
const productsModel = require("../dao/mongoDb/models/products.model");

const router = Router();

console.log("STARTING PRODUCT MANANGER WITH MONGO");

// Ruta para insertar productos de prueba
router.get("/insertion", async (req, res) => {
    try {
        let result = await productsModel.insertMany(productsData);
        return res.json({
            message: "All the products are inserted successfully",
            result,
        });
    } catch (error) {
        console.log("Error while inserting products:", error);
        return res.status(500).json({
            message: "Error while inserting products",
            error: error.message
        });
    }
});

// Ruta para mostrar todos los productos con MongoDB con query.params
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, ...query } = req.query;

        const limitInt = parseInt(limit);
        const pageInt = parseInt(page);

        const products = await productManager.getAllProducts(limitInt, pageInt, sort, query);

        return res.status(200).json({ ok: true, message: 'getAllProducts', products });
    } catch (error) {
        console.log('Error while getting all products:', error);
        return res.status(500).json({ ok: false, message: 'Error while getting all products', error: error.message });
    }
});

// Ruta para mostrar un producto con MongoDB
router.get(`/:pid`, async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);

        if (!product) {
            return res.status(404).json({
                ok: true,
                message: `The product does not exist`,
            });
        }

        return res.status(200).json({ ok: true, message: `getProductById`, product });
    } catch (error) {
        console.log("Error while getting product by ID:", error);
        return res.status(500).json({ ok: false, message: "Error while getting product by ID", error: error.message });
    }
});

// Ruta para crear un nuevo producto con MongoDB
router.post(`/`, async (req, res) => {
    try {
        const productBody = req.body;

        const newProduct = await productManager.createProduct(productBody);
        if (!newProduct) {
            return res.json({
                message: `The product is already registered`,
            });
        }

        return res.json({
            message: `Product created successfully`,
            product: newProduct,
        });
    } catch (error) {
        console.log("Error while creating product:", error);
        return res.status(500).json({ ok: false, message: "Error while creating product", error: error.message });
    }
});

// Ruta para actualizar un producto con MongoDB
router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const updatedProductData = req.body;

    try {
        const updatedProduct = await productManager.updateProduct(productId, updatedProductData);
        res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

// Ruta para eliminar un producto con MongoDB
router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;

    try {
        await productManager.deleteProduct(productId);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

module.exports = router;
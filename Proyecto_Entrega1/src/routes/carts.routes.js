const { Router } = require("express");
const path = require('path');
const CartManager = require('../CartManager');
const ProductManager = require('../ProductManager');

const pathBase = path.join(__dirname, '../../carrito.json');
const pathProducts = path.join(__dirname, '../../productos.json');

const cartManager = new CartManager(pathBase);
const productManager = new ProductManager(pathProducts);


const router = Router();

console.log("STARTING CART MANANGER");

router.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid, 10);

        if (isNaN(cartId) || cartId <= 0) {
            return res.status(400).send('Parámetros de solicitud inválidos');
        }

        // Obtener el carrito por su ID
        const cart = await cartManager.getCartById(cartId);

        // Verificar si el carrito existe
        if (!cart) {
            return res.status(404).send(`Carrito no encontrado`);
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart(req.body.products);
        res.status(201).json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart(req.body.products);
        res.status(201).json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid, 10);
        const productId = parseInt(req.params.pid, 10);
        const quantity = parseInt(req.body.quantity, 10) || 1;

        if (
            isNaN(cartId)
            || isNaN(productId)
            || isNaN(quantity)
            || quantity <= 0
        ) {
            return res.status(400).send('Parámetros de solicitud inválidos');
        }

        const cart = await cartManager.getCartById(cartId);

        if (!cart) {
            return res.status(404).send(`Carrito no encontrado`);
        }

        const product = await productManager.getProductsbyId(productId);
        if (!product) {
            return res.status(400).send('Producto no encontrado');
        }

        if (product.stock <= 0) {
            return res.status(400).send('Producto agotado');
        }

        const updatedCart = await cartManager.addProductToCart(cartId, productId);

        res.status(200).json(updatedCart);
    } catch (error) {
        console.error(error)
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
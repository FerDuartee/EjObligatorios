const { Router } = require("express");
const path = require('path');
const ProductManager = require('../dao/fileSystem/ProductManager');

const pathBase = path.join(__dirname, '../dao/fileSystem/productos.json');
const productManager = new ProductManager(pathBase);

const productsData = require("../dao/mongoDB/data/products");
const productsModel = require("../dao/mongoDB/model/products.model");

const router = Router();

console.log("STARTING PRODUCT MANANGER");

router.get("/insertion", async (req, res) => {
    let result = await productsModel.insertMany(productsData);
    return res.json({
      message: "All the products are inserted succesfully",
      result,
    });
  });

  router.post('/post', async (req, res) => {
    try {
        const newProduct = req.body;

        // Verificar si faltan datos obligatorios
        if (
            !newProduct.title ||
            !newProduct.description ||
            !newProduct.code ||
            !newProduct.price ||
            !newProduct.stock ||
            !newProduct.category
        ) {
            return res.status(400).send('Faltan datos obligatorios.');
        }

        // Crear un nuevo documento de producto utilizando el modelo de Mongoose
        const createdProduct = await Product.create(newProduct);

        // Verificar si se creó el producto correctamente
        if (createdProduct) {
            res.status(201).json(createdProduct);
        } else {
            res.status(400).send('Error al crear el producto.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.');
    }
});


router.get(`/get`, async (req, res) => {
    try {
      let products = await productsModel.find();
      return res.json({
        message: `products list`,
        products,
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: students.routes.js:38 ~ router.get ~ error:",
        error
      );
    }
  });

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
        } else {
            res.status(400).send('Error al crear el producto.');
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

router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        await productManager.deleteProduct(Number(productId));

        res.status(200).send('Producto eliminado correctamente.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.');
    }
});

//Mongo

module.exports = router;
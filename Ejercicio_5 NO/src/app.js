const express = require('express');
const productsRoutes = require("./routes/products.routes");
const cartsRoutes = require("./routes/carts.routes");
const mongoose = require('mongoose');

const app = express();
const port = 8080;
const API_BASE_PATH = "/api";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${API_BASE_PATH}/products`, productsRoutes);
app.use(`${API_BASE_PATH}/carts`, cartsRoutes);

mongoose.connect('mongodb+srv://ferduarte:codercomercio@ecommerce.teinbgf.mongodb.net/ecommerce?retryWrites=true&w=majority')
    .then(() => {
        console.log("Conexión exitosa a MongoDB");
    })
    .catch((error) => {
        console.log("Error de conexión a MongoDB:", error);
        process.exit(1);
    });

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});


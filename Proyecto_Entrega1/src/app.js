const express = require('express');
const productsRoutes = require("./routes/products.routes");
const cartsRoutes = require("./routes/carts.routes");

const app = express();
const port = 8080;
const API_BASE_PATH = "/api";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${API_BASE_PATH}/products`, productsRoutes);
app.use(`${API_BASE_PATH}/carts`, cartsRoutes);


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
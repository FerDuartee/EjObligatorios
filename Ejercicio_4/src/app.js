const express = require('express');
const handlebars = require('express-handlebars');
const productsRoutes = require("./routes/products.routes");
const cartsRoutes = require("./routes/carts.routes");
const viewsRoutes = require("./routes/views.routes")
const path = require('path');

const app = express();
const port = 8080;
const API_BASE_PATH = "/api";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configurar handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(`${__dirname}/views`));
app.set("view engine", "handlebars");

app.use(`/static`, express.static(__dirname + "/public"));



app.use(`${API_BASE_PATH}/products`, productsRoutes);
app.use(`${API_BASE_PATH}/carts`, cartsRoutes);

app.use("/", viewsRoutes)

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
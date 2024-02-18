const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const http = require('http');
const handlebars = require('express-handlebars');
const productsRoutes = require("./routes/products.routes");
const cartsRoutes = require("./routes/carts.routes");
const routerViews = require('./routes/views.routes');
const productsRoutesMongo = require("./routes/mongo.products.routes")
const cartsRoutesMongo = require("./routes/mongo.carts.routes")
const ProductManager = require('./dao/fileSystem/ProductManager');

const filePath = path.join(__dirname, './dao/fileSystem/productos.json');
const productManager = new ProductManager(filePath);

const mongoose = require('mongoose');

const app = express();
const port = 8080;
const API_BASE_PATH = "/api";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//configurar handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(`${__dirname}/views`));
app.set("view engine", "handlebars");

app.use(`${API_BASE_PATH}/cartmongo`, cartsRoutesMongo);
app.use(`${API_BASE_PATH}/productsmongo`, productsRoutesMongo);
app.use(`${API_BASE_PATH}/products`, productsRoutes);
app.use(`${API_BASE_PATH}/carts`, cartsRoutes);
app.use("/", routerViews);

mongoose.connect('mongodb+srv://ferduarte:codercomercio@ecommerce.teinbgf.mongodb.net/ecommerce?retryWrites=true&w=majority')
    .then(() => {
        console.log("Conexión exitosa a MongoDB");
    })
    .catch((error) => {
        console.log("Error de conexión a MongoDB:", error);
        process.exit(1);
    });

const server = http.createServer(app);

const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('Usuario conectado');
    
    productManager.getProducts().then(products => {
        socket.emit('getProducts_ev', products);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

app.set('io', io);

server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const http = require('http');
const handlebars = require('express-handlebars');
const productsRoutes = require("./routes/products.routes");
const cartsRoutes = require("./routes/carts.routes");
const routerViews = require('./routes/views.routes');
const ProductManager = require('./ProductManager');
const pathBase = path.join(__dirname, './productos.json');


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

app.use(`${API_BASE_PATH}/products`, productsRoutes);
app.use(`${API_BASE_PATH}/carts`, cartsRoutes);
app.use("/", routerViews)

const server = http.createServer(app);

const io = socketIo(server);

const productManager = new ProductManager('./productos.json');

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
const cookieParser = require("cookie-parser");
const displayRoutes = require("express-routemap");
const express = require('express');
const flash = require('connect-flash');
const handlebars = require('express-handlebars');
const http = require('http');
const mongoose = require('mongoose');
const mongoStore = require("connect-mongo");
const path = require('path');
const session = require("express-session");
const socketIo = require('socket.io');

// Rutas
const sessionRoutes = require("./routes/auth.routes");
const routerViews = require('./routes/views.routes');

// Managers
const productsRoutes = require("./routes/mongo.products.routes");
const cartsRoutes = require("./routes/mongo.carts.routes");

// const chatManager = new ChatManager(filePath);

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 8080;
const API_BASE_PATH = "/api";
const SECRET_SESSION = "secretSession";
const MONGO_URL = 'mongodb+srv://ferduarte:prueba2024@ecommerce.teinbgf.mongodb.net/ecommerce?retryWrites=true&w=majority';
const COOKIE_SIGN = "klasjlhqwlx1";

// Configuración del middleware de sesión
app.use(
    session({
        store: mongoStore.create({
            mongoUrl: MONGO_URL,
            ttl: 60 * 3600,
        }),
        secret: SECRET_SESSION,
        resave: false,
        saveUninitialized: false,
    })
);

// Inicializar Passport.js
const passport = require("passport");
const initializePassport = require("./config/passport.config");
initializePassport();

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(COOKIE_SIGN));

// Rutas
app.use(`${API_BASE_PATH}/cart`, cartsRoutes);
app.use(`${API_BASE_PATH}/product`, productsRoutes);
app.use(`${API_BASE_PATH}/session`, sessionRoutes);
app.use("/", routerViews);

// Configurar handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(`${__dirname}/views`));
app.set("view engine", "handlebars");

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("Conexión exitosa a MongoDB");
    })
    .catch((error) => {
        console.log("Error de conexión a MongoDB:", error);
        process.exit(1);
    });

io.on('connection', (socket) => {
    productManager.getProducts().then(products => {
        socket.emit('getProducts_ev', products);
    });

    console.log("Nuevo usuario conectado");

    socket.on("message", async (data) => {
        try {
            await chatManager.saveMessage(data.user, data.message);
            io.emit("messageLogs", data);
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
        }
    });

    socket.on("user-login", (usr) => {
        // Emitir los mensajes al cliente recién conectado si están disponibles
        if (messages) {
            socket.emit("messageLogs", messages);
        }

        // Emitir la notificación de nuevo usuario a todos los clientes
        socket.broadcast.emit("new-user", usr);
    });
});

// Ruta por defecto
app.get("/", (req, res) => {
    res.redirect("/session/login");
});

// Mostrar rutas
app.use("/api/session/", sessionRoutes);

// Iniciar el servidor
server.listen(port, () => {
    displayRoutes(app);
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
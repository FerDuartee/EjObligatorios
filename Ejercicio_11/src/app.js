import cookieParser from "cookie-parser";
import displayRoutes from "express-routemap";
import express from 'express';
import flash from 'connect-flash';
import handlebars from 'express-handlebars';
import http from 'http';
import mongoose from 'mongoose';
import mongoStore from "connect-mongo";
import path from 'path';
import { fileURLToPath } from "url";
import session from "express-session";
import { Server } from 'socket.io'; // Importar Server de socket.io

// Managers
import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/carts.routes.js";
import authRoutes from './routes/auth.routes.js'
import routerViews from './routes/views.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Crear una instancia de socket.io pasando el servidor http
const io = new Server(server);

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
import passport from "passport";
import initializePassport from "./config/passport.config.js";
initializePassport();

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(COOKIE_SIGN));

// Rutas
app.use(`${API_BASE_PATH}/cart`, cartsRoutes);
app.use(`${API_BASE_PATH}/product`, productsRoutes);
app.use(`${API_BASE_PATH}/session`, authRoutes);
app.use("/", routerViews);

//Configurar handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(`${__dirname}/views`));
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, '/public')));

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("Conexión exitosa a MongoDB");
    })
    .catch((error) => {
        console.log("Error de conexión a MongoDB:", error);
        process.exit(1);
    });

// io.on('connection', (socket) => {
//     productManager.getProducts().then(products => {
//         socket.emit('getProducts_ev', products);
//     });

//     console.log("Nuevo usuario conectado");

//     socket.on("message", async (data) => {
//         try {
//             await chatManager.saveMessage(data.user, data.message);
//             io.emit("messageLogs", data);
//         } catch (error) {
//             console.error('Error al guardar el mensaje:', error);
//         }
//     });

//     socket.on("user-login", (usr) => {
//         // Emitir los mensajes al cliente recién conectado si están disponibles
//         if (messages) {
//             socket.emit("messageLogs", messages);
//         }

//         // Emitir la notificación de nuevo usuario a todos los clientes
//         socket.broadcast.emit("new-user", usr);
//     });
// });

// Ruta por defecto
app.get("/", (req, res) => {
    res.redirect("/session/login");
});

// Mostrar rutas
app.use("/api/session/", authRoutes);

// Iniciar el servidor
server.listen(port, () => {
    displayRoutes(app);
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
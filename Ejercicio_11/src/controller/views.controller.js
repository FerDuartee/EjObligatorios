import passport from 'passport';
import productsModel from '../models/products.model.js';
import cartsModel from '../models/carts.models.js';
import ProductDao from "../dao/Product.dao.js";

const productService = new ProductDao();

export const getLoginPage = async (req, res) => {
    res.render("login");
};

export const postLogin = passport.authenticate("login", {
    successRedirect: "/products",
    failureRedirect: "/faillogin",
    failureFlash: true,
});

export const getFailLogin = async (req, res) => {
    res.send({ error: "login strategy failed" });
};

export const getRegisterPage = async (req, res) => {
    res.render("register");
};

export const postRegister = passport.authenticate("register", {
    successRedirect: "/login",
    failureRedirect: "/failregister",
    failureFlash: true,
});

export const getFailRegister = async (req, res) => {
    res.send({ error: "register strategy failed" });
};

export const getProductsPage = async (req, res) => {
    try {
        const options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            lean: true
        };
        const user = req.session.user;
        const products = await productsModel.paginate({}, options);
        res.render('products', { user: user, products: products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getCartPage = async (req, res) => {
    try {
        // Obtenemos el ID del carrito desde los parámetros de la URL
        const cartId = req.params.cid;
        
        // Buscamos el carrito en la base de datos
        const cart = await cartsModel.findOne({ _id: cartId }).populate('user').populate('products.product');
    
        if (!cart) {
          return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.render('carrito', { cart });
      } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
};

export const getProfilePage = async (req, res) => {
    try {
        const user = req.session.user;
        res.render("profile", { user: user });
    } catch (error) {
        console.error('Error al obtener perfil de usuario:', error);
        res.status(500).send('Error interno del servidor.');
    }
};

export const getCartWithProducts = async (req, res) => {
    try {
        const user = req.session.user;
        const cartId = user.cart;
        console.log(cartId);

        const cart = await cartsModel.findOne({ _id: cartId }).populate('products.product').lean();
        console.log(cart);
        res.render("cart", { user: user, cart: cart });
    } catch (error) {
        console.error('Error al obtener perfil de usuario:', error);
        res.status(500).send('Error interno del servidor.');
    }
};

export const getHomePage = async (req, res) => {
    try {
        const limit = Number(req.query.limit);
        let products = await productService.getAllProducts();

        if (limit && !isNaN(limit) && limit > 0) {
            products = products.filter((product, index) => index < limit);
        }

        res.render('home', { products: products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.');
    }
};

export const getRealTimeProductsPage = async (req, res) => {
    try {
        const limit = Number(req.query.limit);
        let products = await productService.getAllProducts;

        if (limit && !isNaN(limit) && limit > 0) {
            products = products.filter((product, index) => index < limit);
        }

        res.render('realTimeProducts', { products: products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.');
    }
};

export const getChatPage = (req, res) => {
    res.render("chat", {})
};

export const getCurrentSession = (req, res) => {
    if (req.session) {
        return res.json({
            success: true,
            message: "Usuario autenticado",
            session: req.session
        });
    } else {
        return res.status(401).json({
            success: false,
            message: "No hay usuario autenticado"
        });
    }
};

export const renderPage = (req, res) =>{
    res.render('page', { user: req.session.user });
}
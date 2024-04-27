import passport from 'passport';
import productsModel from '../models/products.model.js';
import cartsModel from '../models/carts.models.js';

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

export const getProfilePage = async (req, res) => {
    try {
        const user = req.session.user;
        res.render("profile", { user: user });
    } catch (error) {
        console.error('Error al obtener perfil de usuario:', error);
        res.status(500).send('Error interno del servidor.');
    }
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
    const cartId = req.params.cid;
    try {
        const cart = await cartsModel.findById(cartId).populate('products.product').lean();
        res.render('cart', { cart: cart });
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getHomePage = async (req, res) => {
    try {
        const limit = Number(req.query.limit);
        let products = await productManager.getProducts();

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
        let products = await productManager.getProducts();

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
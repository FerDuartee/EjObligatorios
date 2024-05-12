import userModel from '../models/user.model.js';
import cartsModel from '../models/carts.models.js';

export default class CartDao {
    getCartById = async (query) => {
        try {
            const cart = await cartsModel.findById(query).populate('products.product');
            return cart;
        } catch (error) {
            console.log("Error al obtener el carrito por ID:", error);
            throw error;
        }
    };

    getUserCart = async (userId) => {
        try {
            const user = await userModel.findById(userId).populate('cart');
            return user.cart;
        } catch (error) {
            throw new Error(`Error al obtener el carrito del usuario: ${error.message}`);
        }
    }

    createCart = async (bodyCart) => {
        try {
            const newCart = await cartsModel.create(bodyCart);
            return newCart;
        } catch (error) {
            console.log("Error al crear el carrito:", error);
            throw error;
        }
    };

    addProductToCart = async (cartId, productId) => {
        try {
            const cart = await cartsModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            const existingProductIndex = cart.products.findIndex(item => item.product.equals(productId));

            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += 1;
            } else {
                cart.products.push({ product: productId });
            }

            await cart.save();

            return cart;
        } catch (error) {
            console.log("Error al agregar producto al carrito:", error);
            throw error;
        }
    };

    removeProductFromCart = async (cartId, productId) => {
        try {
            const cart = await cartsModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = cart.products.filter(item => !item.product.equals(productId));

            await cart.save();

            return cart;
        } catch (error) {
            console.log("Error al eliminar producto del carrito:", error);
            throw error;
        }
    };

    updateCart = async (cartId, products) => {
        try {
            const cart = await cartsModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = products;

            await cart.save();

            return cart;
        } catch (error) {
            console.log("Error al actualizar el carrito:", error);
            throw error;
        }
    };

    updateProductQuantityInCart = async (cartId, productId, quantity) => {
        try {
            const cart = await cartsModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const product = cart.products.find(item => item.product.equals(productId));
            if (product) {
                product.quantity = quantity;
            }

            await cart.save();

            return cart;
        } catch (error) {
            console.log("Error al actualizar la cantidad del producto en el carrito:", error);
            throw error;
        }
    };

    removeAllProductsFromCart = async (cartId) => {
        try {
            const cart = await cartsModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = [];

            await cart.save();

            return cart;
        } catch (error) {
            console.log("Error al eliminar todos los productos del carrito:", error);
            throw error;
        }
    };

    purchaseCart = async (cartId) => {
        try {
            const cart = await cartsModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productsToPurchase = [];
            const productsNotPurchased = [];

            for (const item of cart.products) {
                const product = await ProductService.getProductById(item.product);
                if (!product || product.stock < item.quantity) {
                    productsNotPurchased.push(item.product);
                } else {
                    productsToPurchase.push(item);
                }
            }

            const ticketData = {
                userId: cart.userId,
                products: productsToPurchase,
                total: calcularTotal(productsToPurchase)
            };
            const ticket = await TicketService.createTicket(ticketData);

            cart.products = productsNotPurchased.map(productId => ({ product: productId }));
            await cart.save();

            return { ticket, productsNotPurchased };
        } catch (error) {
            console.log("Error al comprar el carrito:", error);
            throw error;
        }
    };
}

function calcularTotal(productsToPurchase) {
    return productsToPurchase.reduce((total, item) => total + item.price * item.quantity, 0);
}
const fs = require('fs/promises');
const ProductManager = require('./ProductManager');

//carritos.json - ruta de almacenamiento
class CartManager {
    constructor(path) {
        this.pathDB = path;
        this.productManager = new ProductManager('./src/dao/fileSystem/productos.json')
    }

    async createCart(products) {
        try {
            const allCarts = await this.getCarts();
            const lastId = allCarts.length === 0
                ? 1
                : (allCarts[allCarts.length - 1]?.id || 0) + 1;

            const newCart = { id: lastId, products: products || [] };

            allCarts.push(newCart);
            await fs.writeFile(this.pathDB, JSON.stringify({ carts: allCarts }));
            return newCart;
        } catch (error) {
            console.error("🚀 ~ CartManager ~ createCart ~ error:", error);
            throw new Error('Error al crear el carrito.')
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const allCarts = await this.getCarts();
            const cartIndex = allCarts.findIndex(cart => cart.id === cartId);

            if (cartIndex === -1) {
                throw new Error(`No se encontró el carrito.`);
            }

            const cart = allCarts[cartIndex];
            const productIndex = cart.products.findIndex(product => product.product === productId);

            const product = await this.productManager.getProductsbyId(productId);

            if (
                !product
                || product.stock <= 0) {
                throw new Error('Producto agotado.');
            }

            if (productIndex !== -1) {
                //sumar una unidad si ya existe
                cart.products[productIndex].quantity += 1;
            } else {
                //añadir producto al carrito
                cart.products.push({ product: productId, quantity: 1 });
            }

            await fs.writeFile(this.pathDB, JSON.stringify({ carts: allCarts }));

            //actualizar stock en productos.json
            product.stock -= 1;
            await this.productManager.updateProduct(productId, product);

            return cart;
        } catch (error) {
            console.error("🚀 ~ CartManager ~ addProductToCart ~ error:", error)
            throw new Error('Error al agregar producto al carrito.');
        }
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.pathDB, 'utf-8');
            const jsonData = JSON.parse(data);
            return jsonData.carts || [];
        } catch (error) {
            console.error("🚀 ~ CartManager ~ getCarts ~ error:", error);
            throw new Error('Error al cargar los carritos.');
        }
    }

    async getCartById(cartId) {
        try {
            const allCarts = await this.getCarts();
            const cart = allCarts.find(cart => cart.id === cartId);

            if (cartId) {

            }
            return cart || null;
        } catch (error) {
            console.error("🚀 ~ CartManager ~ getCartById ~ error:", error);
            throw new Error('Error al cargar el carrito.');
        }
    }
    removeAllProductsFromCart = async (cartId) => {
        try {
            const cart = await cartsModel.findById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }

            // Limpiar el array de productos del carrito
            cart.products = [];
            
            await cart.save();
            
            return cart;
        } catch (error) {
            console.log("Error while removing all products from cart:", error);
            throw error;
        }
    };
}

module.exports = CartManager;
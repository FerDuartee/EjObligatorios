const fs = require('fs/promises');

//productos.json - ruta de almacenamiento
class productManager {
    constructor(path) {
        this.pathDB = path;
    }

    async createProduct(product) {
        try {
            const allProducts = await this.getProducts();
            const lastId = allProducts.length === 0
                ? 1
                : (allProducts[allProducts.length - 1]?.id || 0) + 1;

            const newProduct = { id: lastId, ...product, status: typeof product.status === 'boolean' ? product.status : true };

            if (
                newProduct.title && newProduct.title.trim() &&
                newProduct.description && newProduct.description.trim() &&
                newProduct.code && newProduct.code.trim() &&
                typeof newProduct.price === 'number' && newProduct.price >= 0 &&
                typeof newProduct.status === 'boolean' &&
                typeof newProduct.stock === 'number' && newProduct.stock >= 0 &&
                newProduct.category && newProduct.category.trim() &&
                (typeof newProduct.thumbnail === 'string' || typeof newProduct.thumbnail === 'undefined')
            ) {
                allProducts.push(newProduct);
                await fs.writeFile(this.pathDB, JSON.stringify({ products: allProducts }));
                return newProduct;
            } else {
                throw new Error('Faltan datos obligatorios');
            }
        } catch (error) {
            console.error("🚀 ~ ProductManager ~ createProduct ~ error:", error);
            throw new Error('Error al crear producto');
        }
    }

    async getProducts() {
        try {
            const allProducts = await fs.readFile(this.pathDB);
            const parsedProducts = JSON.parse(allProducts);

            return parsedProducts.products;
        } catch (error) {
            console.error("🚀 ~ productManager ~ getProducts ~ error:", error)
            throw new Error('Error al obtener los productos');
        }
    }

    async getProductsbyId(productId) {
        try {
            const allProducts = await this.getProducts();
            const product = allProducts.find(product => product.id === productId);

            if (product) {
                return product;
            } else {
                return null;
            }
        } catch (error) {
            console.error("🚀 ~ productManager ~ getProductsbyId ~ error:", error)
            throw new Error('Error al obtener el producto');
        }
    }

    async updateProduct(idProduct, updatedProduct) {
        try {
            const allProducts = await this.getProducts();
            const productId = allProducts.findIndex(product => product.id === idProduct);

            if (productId !== -1) {
                const updatedProductData = { ...allProducts[productId], ...updatedProduct };

                if (
                    !updatedProductData.title || !updatedProductData.title.trim() ||
                    !updatedProductData.description || !updatedProductData.description.trim() ||
                    !updatedProductData.code || !updatedProductData.code.trim() ||
                    typeof updatedProductData.price !== 'number' || updatedProductData.price < 0 ||
                    typeof updatedProductData.status !== 'boolean' ||
                    typeof updatedProductData.stock !== 'number' || updatedProductData.stock < 0 ||
                    !updatedProductData.category || !updatedProductData.category.trim() ||
                    (typeof updatedProductData.thumbnail !== 'string' && typeof updatedProductData.thumbnail !== 'undefined')
                ) {
                    throw new Error('Faltan datos obligatorios');
                }

                allProducts[productId] = updatedProductData;
                await fs.writeFile(this.pathDB, JSON.stringify({ products: allProducts }));
                return updatedProductData;
            } else {
                throw new Error('Producto no encontrado.');
            }
        } catch (error) {
            console.error("🚀 ~ ProductManager ~ updateProduct ~ error:", error);
            throw new Error('Error al actualizar producto');
        }
    }

    async deleteProduct(productId) {
        try {
            const allProducts = await this.getProducts();
            const updatedProducts = allProducts.filter(product => product.id !== productId);

            if (updatedProducts.length < allProducts.length) {
                await fs.writeFile(this.pathDB, JSON.stringify({ products: updatedProducts }));
                return true;
            } else {
                console.error('Producto no encontrado');
                return false;
            }
        } catch (error) {
            console.error("🚀 ~ productManager ~ deleteProduct ~ error:", error);
            throw new Error('Error al borrar producto');
        }
    }
}

module.exports = productManager;
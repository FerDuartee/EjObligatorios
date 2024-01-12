const fs = require('fs/promises');

//Ruta de almacenamiento
class productManager {
    constructor(path) {
        this.pathDB = path;
    }

    //Desestructurando el objeto product
    async createProduct(product) {
        try {
            const allProducts = await this.getProducts();
            const lastId = allProducts.length === 0
                ? 1
                : (allProducts.products[allProducts.products.length - 1]?.id || 0) + 1;
    
            const newProduct = { id: lastId, ...product };
    
            if (
                newProduct.title && newProduct.title.trim() &&
                newProduct.description && newProduct.description.trim() &&
                typeof newProduct.price === 'number' && newProduct.price > 0 &&
                newProduct.thumbnail && newProduct.thumbnail.trim() &&
                newProduct.code && newProduct.code.trim() &&
                typeof newProduct.stock === 'number' && newProduct.stock > 0
            ) {
                allProducts.products.push(newProduct);
                await fs.writeFile(this.pathDB, JSON.stringify(allProducts));
                return newProduct;
            } else {
                console.log("Error: Faltan datos obligatorios del producto con id " + newProduct.id);
                return null;
            }
    
        } catch (error) {
            console.log("Error al crear el producto:", error);
            throw error;
        }
    }

    async getProducts() {
        try {
            const allProducts = await fs.readFile(this.pathDB)
            return JSON.parse(allProducts)
        } catch (error) {
            console.log(
                "🚀 ~ file: ProductManager.js:47 ~ productManager ~ getProducts ~ error:",
                error)
        }
    }

    async getProductsbyId(id) {
        try {
            const allProducts = await this.getProducts();

            const product = allProducts.products.find(product => product.id === id);
            if (product) {
                return product;
            } else {
                return null;
            }
        } catch (error) {
            console.log("🚀 ~ file: ProductManager.js:63 ~ productManager ~ getProductsbyId ~ error:", error)
        }
    }

    async updateProduct(productId, updatedProduct) {
        try {
            const allProducts = await this.getProducts();
            const updatedProducts = allProducts.products.map(product => {
                if (product.id === productId) {
                    return { ...product, ...updatedProduct };
                }
                return product;
            });
    
            allProducts.products = updatedProducts;
            await fs.writeFile(this.pathDB, JSON.stringify(allProducts));
            console.log("Producto actualizado correctamente");
        } catch (error) {
            console.log("🚀 ~ file: ProductManager.js:81 ~ productManager ~ updateProduct ~ error:", error)
            console.log("Error al actualizar el producto.");
        }
    }

    async deleteProduct(productId) {
        try {
            const allProducts = await this.getProducts();
            const filteredProducts = allProducts.products.filter(product => product.id !== productId);

            if (filteredProducts.length < allProducts.products.length) {
                allProducts.products = filteredProducts;
                await fs.writeFile(this.pathDB, JSON.stringify(allProducts));
                console.log("Producto eliminado correctamente");
            } else {
                console.log("Producto no encontrado para eliminar.");
            }

        } catch (error) {
            console.log("🚀 ~ file: ProductManager.js:100 ~ productManager ~ deleteProduct ~ error:", error)
            console.log("Error al eliminar el producto.");
        }
    }

}

module.exports = productManager;
import productsModel from '../models/products.model.js';

export default class ProductDao {
    getAllProducts = async (limit = 10, page = 1, sort = '', query = {}) => {
        try {
            const options = {
                page: parseInt(page),
                limit: parseInt(limit)
            };

            if (sort === 'asc' || sort === 'desc') {
                options.sort = { price: sort };
            }

            const products = await productsModel.paginate(query, options);

            return {
                status: 'success',
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.prev,
                nextLink: products.next
            };
        } catch (error) {
            console.log("Error al obtener todos los productos:", error);
            throw error;
        }
    };

    createProduct = async (bodyProduct) => {
        try {
            const newProduct = await productsModel.create(bodyProduct);
            return newProduct;
        } catch (error) {
            console.log("Error al crear el producto:", error);
            throw error;
        }
    };

    updateProduct = async (productId, updatedProductData) => {
        try {
            const updatedProduct = await productsModel.findByIdAndUpdate(
                productId,
                updatedProductData,
                { new: true }
            );
            return updatedProduct;
        } catch (error) {
            console.log("Error al actualizar el producto:", error);
            throw error;
        }
    };

    deleteProduct = async (productId) => {
        try {
            await productsModel.findByIdAndDelete(productId);
        } catch (error) {
            console.log("Error al eliminar el producto:", error);
            throw error;
        }
    };

    getProductById = async (productId) => {
        try {
            const product = await productsModel.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            console.log("Error al obtener el producto por ID:", error);
            throw error;
        }
    };
}
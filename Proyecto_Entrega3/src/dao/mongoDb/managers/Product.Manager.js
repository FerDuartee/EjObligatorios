const productsModel = require("../../mongoDb/models/products.model");

class ProductManagerMongo {
  getAllProducts = async (limit = 10, page = 1, sort = '', query = {}) => {
    try {
      // Realizar la consulta con paginación usando mongoose-pagination-v2
      const options = {
        page: parseInt(page),
        limit: parseInt(limit)
      };

      // Aplicar ordenamiento si se proporciona
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
      console.log("Error while getting all products:", error);
      throw error;
    }
  };

  createProduct = async (bodyProduct) => {
    try {
      const newProduct = await productsModel.create(bodyProduct);
      return newProduct;
    } catch (error) {
      console.log("Error while creating product:", error);
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
      console.log("Error while updating product:", error);
      throw error;
    }
  };

  deleteProduct = async (productId) => {
    try {
      await productsModel.findByIdAndDelete(productId);
    } catch (error) {
      console.log("Error while deleting product:", error);
      throw error;
    }
  };

  getProductById = async (productId) => {
    try {
      const product = await productsModel.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      console.log("Error while getting product by id:", error);
      throw error;
    }
  };

}

module.exports = ProductManagerMongo;
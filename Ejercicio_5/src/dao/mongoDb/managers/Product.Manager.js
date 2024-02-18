const productsModel = require("../models/products.model");

class ProductManagerMongo {
  getAllProducts = async () => {
    try {
      const products = await productsModel.find({});
      return products;
    } catch (error) {
      console.log("Error while getting all products:", error);
      throw error; // Puedes lanzar el error para manejarlo en el nivel superior
    }
  };

  getProductById = async (id) => {
    try {
      const product = await productsModel.findById(id);
      return product;
    } catch (error) {
      console.log("Error while getting product by ID:", error);
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
}

module.exports = ProductManagerMongo;
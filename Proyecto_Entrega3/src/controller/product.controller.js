const ProductDao = require('../dao/product.dao');

const productService = new ProductDao();

exports.getAllProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, ...query } = req.query;

    const limitInt = parseInt(limit);
    const pageInt = parseInt(page);

    const products = await productService.getAllProducts(limitInt, pageInt, sort, query);

    res.status(200).json({ ok: true, message: 'getAllProducts', products });
  } catch (error) {
    console.log('Error while getting all products:', error);
    res.status(500).json({ ok: false, message: 'Error while getting all products', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.pid; // Aquí se obtiene el valor de 'pid' de la URL
    const product = await productService.getProductById(productId); // Aquí se pasa el valor de 'pid' al manager para obtener el producto

    if (!product) {
      return res.status(404).json({
        ok: true,
        message: `The product does not exist`,
      });
    }

    return res.status(200).json({ ok: true, message: `getProductById`, product });
  } catch (error) {
    console.log("Error while getting product by ID:", error);
    return res.status(500).json({ ok: false, message: "Error while getting product by ID", error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const productBody = req.body;

    const newProduct = await productService.createProduct(productBody);
    if (!newProduct) {
      return res.json({
        message: `The product is already registered`,
      });
    }

    return res.json({
      message: `Product created successfully`,
      product: newProduct,
    });
  } catch (error) {
    console.log("Error while creating product:", error);
    return res.status(500).json({ ok: false, message: "Error while creating product", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const productId = req.params.pid;
  const updatedProductData = req.body;

  try {
    const updatedProduct = await productService.updateProduct(productId, updatedProductData);
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const productId = req.params.pid;

  try {
    await productService.deleteProduct(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
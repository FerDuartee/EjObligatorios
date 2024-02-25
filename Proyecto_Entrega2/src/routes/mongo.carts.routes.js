const express = require('express');
const CartManagerMongo = require('../dao/mongoDb/managers/Cart.Manager');

const router = express.Router();
const cartManager = new CartManagerMongo();

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    } catch (error) {
        console.error('Error while fetching cart by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    const bodyCart = req.body; 
    try {
        const newCart = await cartManager.createCart(bodyCart);
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error while creating cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
      const { courseId, studentId } = req.body;
      let student = await studentsModel.findOne({ _id: studentId });
      console.log(
        "🚀 ~ file: students.routes.js:42 ~ router.post ~ newStudent:",
        student
      );
  
      student.courses.push({ course: courseId });
  
      let resultUpd = await studentsModel.updateOne({ _id: studentId }, student);
      // Manejo errrores
      return res.json({
        message: `Producto agregado al carrito`,
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: students.routes.js:54 ~ router.post ~ error:",
        error
      );
    }
  });

module.exports = router;
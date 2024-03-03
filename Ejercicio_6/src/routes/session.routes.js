const { Router } = require("express");
const userModel = require("../dao/mongoDb/models/user.model");
const authMdw = require('../middleware/auth.middleware');

const path = require('path');
const ProductManager = require('../dao/fileSystem/ProductManager');
const productsModel = require('../dao/mongoDb/models/products.model');



const pathBase = path.join(__dirname, '../dao/fileSystem/productos.json');
const productManager = new ProductManager(pathBase);

const router = Router();

router.get('/logout', (req, res) => {
  // Eliminar la sesión del usuario
  req.session.destroy(err => {
      if (err) {
          console.error("Error al cerrar sesión:", err);
          return res.redirect('/'); // Redirigir a la página principal
      }
      // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión
      res.redirect('/login');
  });
});

router.post("/login", async (req, res) => {
  try {
    // Verificar las credenciales y obtener los datos del usuario
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    // Verificar si el usuario existe y las credenciales son correctas
    if (!user || user.password !== password) {
      return res.json({ message: "Credenciales inválidas" });
    }

    // No almacenar la contraseña en la sesión
    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;

    // Guardar los datos del usuario (sin la contraseña) en la sesión
    req.session.user = userWithoutPassword;

    return res.redirect("http://localhost:8080/products");
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ message: "Error en el inicio de sesión" });
  }
});

router.post("/register", async (req, res) => {
  try {
    console.log("BODY REGISTER***", req.body);
    const { first_name, last_name, email, age, password } = req.body;

    const addUser = {
      first_name,
      last_name,
      email,
      age,
      password,
    };
    // creando el usurio en mongo
    const newUser = await userModel.create(addUser); // promesa

    if (!newUser) {
      return res
        .status(500)
        .json({ message: `we have some issues register this user` });
    }

    // session del usuario
    req.session.user = { email, firstName: first_name, lastName: last_name };
    return res.redirect("/login");
  } catch (error) {
    // atrapa todos los reject de todas las promesas
    console.log(
      "🚀 ~ file: session.routes.js:41 ~ router.post ~ error:",
      error
    );
  }
});

module.exports = router;

const bcrypt = require('bcrypt');
const { Router } = require("express");
const userModel = require("../dao/mongoDb/models/user.model");
const authMdw = require('../middleware/auth.middleware');
const path = require('path');
const express = require('express');
const passport = require('passport');

const router = express.Router();
const initializePassport = require('../../config/passport.config');
initializePassport();

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          console.error("Error al cerrar sesión:", err);
          return res.redirect('/'); 
      }
      res.redirect('/login');
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ message: "Usuario no encontrado" });
    }

    // Comparar la contraseña proporcionada con la contraseña hasheada almacenada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({ message: "Credenciales inválidas" });
    }

    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;

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

    // Hashear la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    const addUser = {
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword, // Guardar la contraseña hasheada en la base de datos
    };

    const newUser = await userModel.create(addUser);

    if (!newUser) {
      return res.status(500).json({ message: `Error al registrar usuario` });
    }

    req.session.user = { email, firstName: first_name, lastName: last_name };
    return res.redirect("/login");
  } catch (error) {
    console.log("Error al registrar usuario:", error);
    return res.status(500).json({ message: "Error al registrar usuario" });
  }
});

module.exports = router;
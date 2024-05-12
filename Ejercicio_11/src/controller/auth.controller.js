import AuthDao from "../dao/auth.dao.js";
import CartDao from "../dao/cart.dao.js";

// import userRepository from "../Repository/userRepository.js";
const authService = new AuthDao();
const cartService = new CartDao();

export const logout = async (req, res) => {
  try {
    await authService.logout(req);
    res.redirect('/');
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.redirect('/');
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    if (result.error) {
      return res.json({ message: result.error });
    }

    // Verificar si se ha creado un nuevo carrito para el usuario al iniciar sesión
    if (result.message && result.message.startsWith('Inicio de sesión exitoso, se ha creado un nuevo carrito.')) {
      // Obtener el ID del usuario desde la sesión
      const userId = req.session.user._id;
      // Verificar si el usuario ya tiene un carrito
      const existingCart = await cartService.getCartByUserId(userId);

      if (!existingCart) {
        // Si el usuario no tiene un carrito existente, crear uno nuevo
        await cartService.createCart(userId);
      }
    }

    req.session.user = result.user;
    return res.redirect("http://localhost:8080/products");
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ message: "Error en el inicio de sesión" });
  }
};

export const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);

    req.session.user = result;
    return res.redirect("/login");
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({ message: "Error al registrar usuario" });
  }
};

export const getCurrentUser = async () => {
  const currentUser = req.session.user;
  
  // Enviar el usuario actual como respuesta
  res.json(currentUser);
};
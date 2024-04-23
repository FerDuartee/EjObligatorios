import AuthDao from "../dao/auth.dao.js";

const authService = new AuthDao();

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
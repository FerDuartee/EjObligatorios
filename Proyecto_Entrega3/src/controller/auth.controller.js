import bcrypt from 'bcrypt';
import userModel from "../dao/mongoDb/models/user.model";

const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
      return res.redirect('/');
    }
    res.redirect('/login');
  });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ message: "Usuario no encontrado" });
    }

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
};

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const addUser = {
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    };

    const newUser = await userModel.create(addUser);

    if (!newUser) {
      return res.status(500).json({ message: `Error al registrar usuario` });
    }

    req.session.user = { email, firstName: first_name, lastName: last_name };
    return res.redirect("/login");
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({ message: "Error al registrar usuario" });
  }
};

export { logout, login, register };
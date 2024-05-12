import bcrypt from 'bcrypt';
import userModel from '../models/user.model.js';
import CartDao from './cart.dao.js';

const cartService = new CartDao();

export default class AuthDao {
    logout = async (req) => {
        return new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if (err) {
                    console.error("Error al cerrar sesión:", err);
                    reject(err);
                }
                resolve();
            });
        });
    };

    login = async (email, password) => {
        try {
            const user = await userModel.findOne({ email });

            if (!user) {
                return { error: "Usuario no encontrado" };
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return { error: "Credenciales inválidas" };
            }

            let message;
            if (!user.cart) {
                const newCart = await cartService.createCart({ user: user._id });
                user.cart = newCart._id;
                await user.save();
                message = 'Inicio de sesión exitoso, se ha creado un nuevo carrito.';
            } else {
                message = 'Inicio de sesión exitoso, se ha cargado el carrito existente.';
            }

            const userWithoutPassword = { ...user.toObject() };
            delete userWithoutPassword.password;

            return { user: userWithoutPassword };
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
            throw new Error("Error en el inicio de sesión");
        }
    };

    register = async (userData) => {
        try {
            const { first_name, last_name, email, age, password } = userData;

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
                throw new Error(`Error al registrar usuario`);
            }

            return { email, firstName: first_name, lastName: last_name };
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            throw new Error("Error al registrar usuario");
        }
    };

    getCurrentUser = async (req, res) => {
        try {
            const userDTO = await authService.getCurrentUser(req.session.user.email);
            return res.status(200).json(userDTO);
        } catch (error) {
            console.error('Error al obtener el usuario actual:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    };
}
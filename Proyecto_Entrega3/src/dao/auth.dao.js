import bcrypt from 'bcrypt';
import userModel from '../models/user.model.js'

export default class AuthDao {
    logout = async () => {
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
}


const passport = require("passport");
const local = require("passport-local");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

const localStrategy = local.Strategy;

const initializePassport = () => {
    passport.use(
        "register",
        new localStrategy(
            {
                passReqToCallback: true,
                usernameField: "email",
            },
            async (req, email, password, done) => {
                try {
                    const { first_name, last_name, age } = req.body;

                    let user = await userModel.findOne({ email });

                    if (user) {
                        return done(null, false, { message: "El usuario ya existe" });
                    }

                    const hashedPassword = await bcrypt.hash(password, 10);

                    const newUser = await userModel.create({
                        first_name,
                        last_name,
                        email,
                        age,
                        password: hashedPassword,
                    });

                    return done(null, newUser);
                } catch (error) {
                    console.error("Error en la estrategia de registro:", error);
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "login",
        new localStrategy(
            {
                usernameField: "email",
            },
            async (email, password, done) => {
                try {
                    const user = await userModel.findOne({ email });

                    if (!user) {
                        return done(null, false, { message: "Usuario no encontrado" });
                    }

                    const isPasswordValid = await bcrypt.compare(password, user.password);

                    if (!isPasswordValid) {
                        return done(null, false, { message: "Contraseña incorrecta" });
                    }

                    return done(null, user);
                } catch (error) {
                    console.error("Error en la estrategia de inicio de sesión:", error);
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error al deserializar usuario:", error);
            done(error);
        }
    });
};

module.exports = initializePassport;
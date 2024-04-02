function authMdw(req, res, next) {
  console.log("****AUTH MD*****");
  console.log("REVISANDO LA SESION**", req.session);
  
  // Verificar si hay un usuario en la sesión
  if (req.session && req.session.user) {
    // Verificar si el usuario es administrador
    if (req.session.user.email === 'adminCoder@coder.com') {
      // Si es administrador, asignamos el rol de "admin"
      req.session.user.role = 'admin';
    } else {
      // Si no es administrador, asignamos el rol de "usuario"
      req.session.user.role = 'usuario';
    }
    // Si el usuario está logueado, continuar con la siguiente ruta
    return next();
  }

  // Si no hay un usuario en la sesión o la sesión no está iniciada, redirigir al inicio de sesión
  return res.redirect("/login");
}

module.exports = authMdw;
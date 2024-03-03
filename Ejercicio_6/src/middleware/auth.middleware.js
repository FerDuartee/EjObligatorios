function authMdw(req, res, next) {
  console.log("****AUTH MDW*********");
  if (req.session?.user) {
    // Verificar si el usuario es administrador
    if (req.session.user.email === 'adminCoder@coder.com' && req.session.user.password === 'adminCod3r123') {
      // Si es administrador, asignamos el rol de "admin"
      req.session.user.role = 'admin';
    } else {
      // Si no es administrador, asignamos el rol de "usuario"
      req.session.user.role = 'usuario';
    }
    return next();
  }

  return res.redirect("/login");
}

module.exports = authMdw;
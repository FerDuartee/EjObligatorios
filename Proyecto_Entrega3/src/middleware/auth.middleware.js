function authMdw(req, res, next) {
  if (req.session && req.session.user) {
    if (req.session.user.email === 'adminCoder@coder.com') {
      req.session.user.role = 'admin';
    } else {
      req.session.user.role = 'usuario';
    }
    
    const { role } = req.session.user;
    
    if (role === 'admin') {
      return next();
    } else if (role === 'usuario') {
      const { method, originalUrl } = req;
      if (method === 'POST' && originalUrl === '/products') {
        return res.status(403).json({ error: 'Acceso prohibido. Solo el administrador puede crear productos.' });
      } else if ((method === 'PUT' || method === 'DELETE') && originalUrl.startsWith('/products/')) {
        return res.status(403).json({ error: 'Acceso prohibido. Solo el administrador puede actualizar o eliminar productos.' });
      } else if (originalUrl === '/chat' || originalUrl.startsWith('/carts')) {
        return next();
      } else {
        return next();
      }
    }
  }

  return res.redirect("/login");
}

export default authMdw;
export default function roleMiddleWare(...allowedRoles) {
  return (req, res, next) => {
    const  { rol } = req.user;
    // antes de identificar al usuario, vamos a buscar el rol
    if (!allowedRoles.includes(rol)) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta accion' }); // verificar si los roles incluidos pueda realizar una accion
    }

    next(); // pasa a la siguiente funcion
  }
}
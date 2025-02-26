import jwt from 'jsonwebtoken';
import TokenService from '../services/tokenServices.js';
import UserRepository from '../repositories/userRepository.js';

const authMiddleware = async(req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No se proporciono un token'} );
  }

  const token = authHeader.split(' ')[1];
  // crear todas las variables que va a usar el repositorio
  const userRepository = new UserRepository();
  const tokenService = new TokenService();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const existingToken = await userRepository.getSessionToken(decoded.id);
    if (existingToken !== token || await tokenService.isTokenRevoked) {
      throw { message: 'Token invalido', statusCode: 401}
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token Invalido' })
  }
}

export default authMiddleware
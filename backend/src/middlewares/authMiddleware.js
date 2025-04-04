import jwt from 'jsonwebtoken';
import TokenService from '../services/tokenServices.js';
import UserRepository from '../repositories/userRepository.js';
import dotenv from 'dotenv'

dotenv.config()

const authMiddleware = async(req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No se proporciono un token'} );
  }

  const token = authHeader.split(' ')[1];
  // crear todas las variables que va a usar el repositorio
  const userRepository = new UserRepository();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      throw { message: 'Token sin ID de usuario', statusCode: 401 };
    }
    const existingToken = await userRepository.getSessionToken(decoded.id);
    const isRevoked = await TokenService.isTokenRevoked(token);
    if (existingToken !== token || isRevoked) {
      throw { message: 'Token invalido', statusCode: 401}
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token Invalido', errors: error})
  }
}

export default authMiddleware
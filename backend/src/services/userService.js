import UserRepository from "../repositories/userRepository.js";
import TokeService from "./tokenServices.js";
import { Usuario } from "../models/Usuario.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export default class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.TokenService = new TokeService();
  }

  async getAll() {
    return await this.userRepository.getAll();
  }

  async findByUser(usuario) {
    const user = this.userRepository.findByUser(usuario);
    if (!user) {
      throw { message: 'Usario no encontrado', statusCode: 404 }
    }
    return user;
  }

  async findByRol(rol) {
    return await this.userRepository.findByRol(rol);
  }

  async create(userData) {
    const { nombre, apaterno, amaterno, usuario, password } = userData;

    // Verificar que sea un usuario unico
    const uniqueUser = await this.userRepository.findByUser(usuario);
    if (uniqueUser) {
      throw { message: 'El usuario ya existe', statusCode: 404 }
    }

    // Verificar el nombre completo
    const uniqueFullName = await this.userRepository.findByFullName(nombre, apaterno, amaterno);
    if (uniqueFullName) {
      throw { message: 'Ya existe un usuario con el mismo nombre completo', statusCode: 404 }
    }

    // Encriptar Contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Usuario({ ...userData, password: hashedPassword });
    return this.userRepository.create({...newUser});
  }

  async update(id, userData) {
    const { password } = userData;
    const updateUser = await this.userRepository.getById(id);
    if (!updateUser) {
      throw { message: 'Usuario no encontrado', statusCode: 404 }
    }
    if (password) {
      updateUser.password = await bcrypt.hash(password, 10);
    }
    const newUser = new Usuario({ ...updateUser })
    return this.userRepository.update(id, { ...newUser });
  }

  async delete(id) {
    const userExist = await this.userRepository.getById(id);
    if (!userExist) {
      throw { message: 'Usuario no existe', statusCode: 404 }
    }

    await this.userRepository.delete(id);
  }

  async login(username, password) {
    const user = await this.userRepository.findByUser(username);
    if (!user) {
      throw { message: 'Usuario no encontrado', statusCode: 404 }
    }
    if(user.bloqueado) {
      throw { message: 'Usuario Bloqueado contacta al Administrador', statusCode: 401 }
    }

    const existingToken = await this.userRepository.getSessionToken(user.id);
    if (existingToken) {
      throw { message: 'Ya hay una sesion activa', statusCode: 401 }
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      await this.handleFailedLogin(user.id);
      throw { message: 'Contraseña incorrecta', statusCode: 401 }
    }

    const token = jwt.sign({ id: user.id, usuario: user.usuario, rol: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await this.userRepository.updateSessionToken(user.id, token);
    return token;
  }

  async logout(userId, token) {
    const sessionToken = await this.userRepository.getSessionToken(userId);
    if (sessionToken !== token) {
      throw { message: 'Token invalido', statusCode: 401 }
    }
    await this.userRepository.updateSessionToken(userId, null); // null para que se borre el token
    await TokenService.revokeToken(token);
  }

  async unlockUser(id) {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw { message: 'Usuario no Encontrado', statusCode: 404 }
    }

    await this.userRepository.update(id, { bloqueado: false, intentos: 0 }); // reseteo de intentos
  }

  async handleFailedLogin(id) {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw { message: 'Usuario No Encontrado', statusCode: 404 };
    }
    const intentos  = user.intentos + 1;
    if (intentos >= 3) {
      await this.userRepository.update(id, { bloqueado: true });
      throw { message: 'Usuario bloqueado despues de 3 intentos, contacta al Administrador', statusCode: 401 }
    }
    await this.userRepository.update(id, { intentos });
  }

  async getByUser(usuario) {
    const user = await this.userRepository.findByUser(usuario);
    if (!user) {
      throw { message: 'Usuario No Encontrado', statusCode: 404 }
    }

    return user
  }
}
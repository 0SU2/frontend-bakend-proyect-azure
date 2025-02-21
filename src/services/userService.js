import UserRepository from "../repositories/userRepository";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class UserService {
  constructor() {
    this.userRepository = new UserRepository();
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
    const uniqueFullName = this.userRepository.findByFullName(nombre, apaterno, amaterno);
    if (uniqueFullName) {
      throw { message: 'Ya existe un usuario con el mismo nombre completo', statusCode: 404 }
    }

    // Encriptar Contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { ...userData, password: hashedPassword };
    return this.userRepository.create(newUser);
  }

  async update(id, userData) {
    const { password } = userData;
    const updateUser = { ...userData };
    if (password) {
      updateUser.password = await bcrypt.hash(password, 10);
    }
    return this.userRepository.update(id, updateUser);
  }

  async delete(id) {
    const userExist = await this.userRepository.getById(id);
    if (!userExist) {
      throw { message: 'Usuario no existe', statusCode: 404 }
    }

    await this.userRepository.delete(id);
  }
}
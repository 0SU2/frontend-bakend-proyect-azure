import IUserRepository from "../interfaces/IUserRepository.js";
import { db } from "../config/firebase.js";

export default class UserRepository extends IUserRepository {
  constructor() {
    super()
    this.collection = db.collection('usuarios-ts');
  }

  async create(user) {
    const userCreated = await this.collection.add(user);
    return { id: userCreated.id,...user }
  }

  async update(id, updateData) {
    await this.collection.doc(id).update(updateData);
    return { id, ...updateData }
  }

  async delete(id) {
    await this.collection.doc(id).delete();
    return { id, message: 'Usuario Eliminado' }
  }

  async getAll() {
    const usuarios = await this.collection.get();
    return usuarios.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  }

  async getById(id) {
    const usuario = await this.collection.doc(id).get();
    return usuario.empty? null : { id: usuario.id, ...usuario.data() }
  }

  async findByFullName(nombre, apaterno, amaterno) {
    const usuario = await this.collection.where('nombre', '==', nombre).where('apaterno', '==', apaterno).where('amaterno', '==', amaterno).get();
    return usuario.empty ? null : { id: usuario.docs[0].id, ...usuario.docs[0].data() }
  }

  async findByUser(usuario) {
    const usuarios = await this.collection.where('usuario', '==', usuario).get();
    return usuarios.empty? null : { id: usuarios.docs[0].id, ...usuarios.docs[0].data() }
  }

  async findByRol(rol) {
    const usuario = await this.collection.where('rol', '==', rol).get();
    return usuario.empty? null : { id: usuario.docs[0].id, ...usuario.docs[0].data() }
  }

  async updateSessionToken(userId, sessionToken) {
    const user = this.collection.doc(userId);
    await user.update({ currentSessionToken: sessionToken });
  }

  async getSessionToken(userId) {
    const user = this.collection.doc(userId);
    const userLogged = await user.get();
    return userLogged.exists ? userLogged.data().currentSessionToken : null
  }
}
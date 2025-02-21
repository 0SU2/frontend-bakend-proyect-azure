export default class IUserRepository {
  /*
  Crear Usuario
  @param {Object} - Datos del usuario
  @returns {Promise<Object>} - Usuario creado
  */
  create(user) {
    throw new Error('Metodo no implementado');
  }
  update(id, updateData) {
    throw new Error('Metodo no implementado');
  }
  delete(id) {
    throw new Error('Metodo no implementado');
  }
  getAll() {
    throw new Error('Metodo no implementado');
  }
  getById() {
    throw new Error('Metodo no implementado');
  }
  findByFullName(nombre, apaterno, amaterno) {
    throw new Error('Metodo no implementado');
  }
  findByUser(usuario) {
    throw new Error('Metodo no implementado');
  }
  findByRol(rol) {
    throw new Error('Metodo no implementado');
  }
}
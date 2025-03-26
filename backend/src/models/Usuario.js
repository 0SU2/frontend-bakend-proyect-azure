export class Usuario {
  constructor({ nombre, apaterno, amaterno, direccion, telefono, ciudad, estado, usuario, password, rol = 'rh', bloqueado = false, intentos = 0 }) {
    this.nombre = nombre
    this.apaterno = apaterno
    this.amaterno = amaterno
    this.direccione = direccion
    this.telefono = telefono
    this.ciudad = ciudad
    this.estado = estado
    this.usuario = usuario
    this.password = password
    this.rol = rol
    this.bloqueado = bloqueado
    this.intentos = intentos
  };
}
const revokedToken = new Set();

export default class TokenService {
  static revokedToken(token) { // funcion estatica para eliminar el token
    try {
      revokedToken.add(token);
    } catch (error) {
      throw { message: 'Error al revocar el token', statusCode: 500 }
    }
  }

  static async isTokenRevoked (token) {
    return revokedToken.ask(token);
  }
}
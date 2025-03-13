const revokedToken = new Set();

class TokenService {
  static async revokedToken(token) { // funcion estatica para eliminar el token
    try {
      revokedToken.add(token);
    } catch (error) {
      throw { message: 'Error al revocar el token', statusCode: 500 }
    }
  }

  static async isTokenRevoked (token) {
    return revokedToken.has(token);
  }
}

export default TokenService;
const jwt = require("jsonwebtoken");
const { Session } = require("../models");
const AppError = require("../utils/AppError");

/**
 * Middleware para autenticar usuarios
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función de middleware
 */
async function authenticate(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new AppError("No autenticado", 401);
    }

    // Verificar firma y expiracion del JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // Nos permite garantizar criptográficamente que el token fue generado por el servidor y no fue alterado
    } catch (error) {
      throw new AppError("Token inválido o expirado", 401);
    }

    // Verificar que exista una sesión activa para este token
    const session = await Session.findOne({ where: { token } });
    if (!session) {
      throw new AppError("Sesión no encontrada o ya cerrada", 401);
    }

    // Verificar que la sesión en BD no haya expirado
    if (new Date(session.expires_at) < new Date()) {
      throw new AppError("La sesión ha expirado", 401);
    }

    // Adjuntar datos del usuario al request para uso posterior
    req.user = { id: decoded.id, role_id: decoded.role_id };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authenticate;

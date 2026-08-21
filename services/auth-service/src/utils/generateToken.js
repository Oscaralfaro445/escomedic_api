const jwt = require("jsonwebtoken");

// Genera un token JWT con el payload proporcionado y la clave secreta definida en las variables de entorno.
// El token tiene una fecha de expiración definida en las variables de entorno.
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

module.exports = generateToken;

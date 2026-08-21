const ms = require("ms");

// Convierte una duración en milisegundos a una fecha de expiración.
function getExpirationDate(duration) {
  const durationMs = ms(duration);
  return new Date(Date.now() + durationMs);
}

module.exports = getExpirationDate;

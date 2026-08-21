// Esta clase representa un error personalizado que extiende la clase Error de JavaScript.
// Se utiliza para manejar errores específicos en la aplicación, permitiendo incluir un mensaje de error y un código de estado HTTP asociado.

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = AppError;

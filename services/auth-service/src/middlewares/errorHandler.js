// Esta función es un middleware de manejo de errores que se utiliza para capturar y procesar errores en la aplicación.
// Recibe el error, la solicitud, la respuesta y el siguiente middleware como parámetros.

function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : "Error interno del servidor";

  res.status(statusCode).json({
    status: "error",
    message,
  });
}

module.exports = errorHandler;

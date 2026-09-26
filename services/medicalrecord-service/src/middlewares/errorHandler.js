function errorHandler(error, req, res, next) {
  console.error(error);

  const statusCode = error.statusCode || 500;
  const message = error.statusCode
    ? error.message
    : "Error interno del servidor";

  res.status(statusCode).json({
    status: "error",
    message,
  });
}

module.exports = errorHandler;

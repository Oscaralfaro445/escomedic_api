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

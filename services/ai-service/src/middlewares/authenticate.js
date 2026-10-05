const AppError = require("../utils/AppError");

function authenticate(req, res, next) {
  const userId = req.headers["x-user-id"];
  const userRole = req.headers["x-user-role"];

  if (!userId || !userRole) {
    throw new AppError("No autenticado", 401);
  }

  req.user = { id: userId, role: userRole };
  next();
}

module.exports = authenticate;

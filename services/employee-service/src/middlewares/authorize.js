const AppError = require("../utils/AppError");

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("No tienes permisos para realizer esta acción", 403);
    }
    next();
  };
}

module.exports = authorize;

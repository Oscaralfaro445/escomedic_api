const { Role } = require("../models");
const AppError = require("../utils/AppError");

function authorize(...allowedRoleNames) {
  return async (req, res, next) => {
    try {
      const role = await Role.findByPk(req.user.role_id);

      if (!role || !allowedRoleNames.includes(role.name)) {
        throw new AppError(
          "No tienes permisos para acceder a esta acción",
          403,
        ); // Forbidden
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = authorize;

const sequelize = require("../config/db");
const User = require("./user.model");
const Role = require("./role.model");
const Session = require("./session.model");
const PasswordResetToken = require("./passwordResetToken.model");

// Definicion de asociaciones entre los modelos (reflejan las FKs del schema de SQL)

Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

User.hasMany(Session, { foreignKey: "user_id" });
Session.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(PasswordResetToken, { foreignKey: "user_id" });
PasswordResetToken.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  sequelize,
  User,
  Role,
  Session,
  PasswordResetToken,
};

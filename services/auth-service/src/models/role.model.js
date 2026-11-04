const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Role = sequelize.define("role", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(40),
    allowNull: false,
    unique: true,
  },
});

module.exports = Role;

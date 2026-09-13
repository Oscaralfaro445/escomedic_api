const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Employee = sequelize.define("employee", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  last_name_p: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  last_name_m: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Employee;

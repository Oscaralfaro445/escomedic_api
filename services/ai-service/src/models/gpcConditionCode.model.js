const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const GpcConditionCode = sequelize.define("gpc_condition_code", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  gpc_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  cie10_code: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = GpcConditionCode;

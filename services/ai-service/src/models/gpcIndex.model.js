const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const GpcIndex = sequelize.define("gpc_index", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  gpc_code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
  },
  condition_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(60),
    allowNull: true,
  },
  grr_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ger_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  grr_file_id: {
    type: DataTypes.STRING(80),
    allowNull: true,
  },
  ger_file_id: {
    type: DataTypes.STRING(80),
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  last_processed: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = GpcIndex;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const GpcCachedContent = sequelize.define("gpc_cached_content", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  gpc_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  source_type: {
    type: DataTypes.STRING(5),
    allowNull: false,
  },
  content_json: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  is_stale: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  tokens_used: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  processed_at: {
    type: DataTypes.DATE,
    allowNull: false,
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

module.exports = GpcCachedContent;

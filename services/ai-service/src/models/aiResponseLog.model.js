const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AiResponseLog = sequelize.define("ai_response_log", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  request_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  response_raw: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  response_parsed: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = AiResponseLog;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AiRequestLog = sequelize.define("ai_request_log", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  endpoint_type: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  patient_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  consultation_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  employee_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  gpc_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  prompt_send: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  model_used: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  tokens_input: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tokens_output: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = AiRequestLog;

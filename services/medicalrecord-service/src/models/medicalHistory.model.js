const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MedicalHistory = sequelize.define("medical_history", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  medical_record_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  hereditary_background: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
  },
  pathological_background: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
  },
  non_pathological_background: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
  },
});

module.exports = MedicalHistory;

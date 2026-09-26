const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Consultation = sequelize.define("consultation", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  medical_record_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  employee_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  current_condition: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  vital_signs: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  physical_examination: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  cie10_code: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  treatment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  prevention: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  referred: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Consultation;

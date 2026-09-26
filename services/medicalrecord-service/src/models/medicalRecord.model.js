const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MedicalRecord = sequelize.define("medical_record", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  patient_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
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

module.exports = MedicalRecord;

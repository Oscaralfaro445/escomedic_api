const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PatientContact = sequelize.define("patient_contact", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  patient_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  relationship: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
});

module.exports = PatientContact;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Patient = sequelize.define("patient", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
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
  gender: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  blood_type: {
    type: DataTypes.STRING(5),
    allowNull: false,
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(16),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  marital_status: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  institutional_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  origin: {
    type: DataTypes.STRING(15),
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

module.exports = Patient;

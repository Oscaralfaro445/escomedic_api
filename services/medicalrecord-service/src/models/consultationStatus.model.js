const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ConsultationStatus = sequelize.define("consultation_status", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
});

module.exports = ConsultationStatus;

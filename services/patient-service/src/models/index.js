const sequelize = require("../config/db");
const Patient = require("./patient.model");
const PatientContact = require("./patientContact.model");

Patient.hasMany(PatientContact, {
  foreignKey: "patient_id",
  onDelete: "CASCADE",
});
PatientContact.belongsTo(Patient, {
  foreignKey: "patient_id",
});

module.exports = {
  sequelize,
  Patient,
  PatientContact,
};

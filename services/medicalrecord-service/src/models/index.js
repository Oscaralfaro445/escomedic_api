const sequelize = require("../config/db");
const MedicalRecord = require("./medicalRecord.model");
const MedicalHistory = require("./medicalHistory.model");
const ConsultationStatus = require("./consultationStatus.model");
const Consultation = require("./consultation.model");

MedicalRecord.hasOne(MedicalHistory, {
  foreignKey: "medical_record_id",
  onDelete: "CASCADE",
});
MedicalHistory.belongsTo(MedicalRecord, { foreignKey: "medical_record_id" });

MedicalRecord.hasMany(Consultation, {
  foreignKey: "medical_record_id",
  onDelete: "CASCADE",
});
Consultation.belongsTo(MedicalRecord, { foreignKey: "medical_record_id" });

ConsultationStatus.hasMany(Consultation, { foreignKey: "status_id" });
Consultation.belongsTo(ConsultationStatus, { foreignKey: "status_id" });

module.exports = {
  sequelize,
  MedicalRecord,
  MedicalHistory,
  ConsultationStatus,
  Consultation,
};

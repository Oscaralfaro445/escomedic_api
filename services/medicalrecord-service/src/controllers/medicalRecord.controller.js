const { MedicalRecord, MedicalHistory, Consultation } = require("../models");
const AppError = require("../utils/AppError");
const {
  buildIdentityHeaders,
  validatePatientExists,
} = require("../utils/externalServicesClient");
1;

async function getFullMedicalRecord(req, res, next) {
  try {
    const record = req.medicalRecord;

    const history = await MedicalHistory.findOne({
      where: { medical_record_id: record.id },
    });
    const consultations = await Consultation.findAll({
      where: { medical_record_id: record.id },
      attributes: ["id", "date", "status_id"], // solo lo ligero
      order: [["date", "DESC"]],
    });

    res.status(200).json({
      status: "success",
      data: {
        medical_record: record,
        history: history || null,
        consultations,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function createMedicalRecord(req, res, next) {
  try {
    const { patientId } = req.body;
    if (!patientId) throw new AppError("patientId es requerido", 400);

    await validatePatientExists(patientId, buildIdentityHeaders(req)); // Lanza AppError 404 si no existe

    const existing = await MedicalRecord.findOne({
      where: { patient_id: patientId },
    });
    if (existing)
      throw new AppError("Este paciente ya tiene un expediente", 409);

    const record = await MedicalRecord.create({ patient_id: patientId });
    res.status(201).json({
      status: "success",
      data: record,
    });
  } catch (error) {
    next(error);
  }
}

async function updateMedicalRecord(req, res, next) {
  try {
    const record = req.medicalRecord;

    record.updated_at = new Date();
    await record.save();
    res.status(200).json({
      status: "success",
      data: record,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFullMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord,
};

const { MedicalRecord } = require("../models");
const AppError = require("../utils/AppError");

async function resolveMedicalRecord(req, res, next) {
  try {
    const record = await MedicalRecord.findOne({
      where: { patient_id: req.patientId },
    });

    if (!record) {
      throw new AppError(
        "Este paciente no tiene un expediente clinico resgistrado. Debe crearse primero con POST /medical-record",
        404,
      );
    }

    req.medicalRecord = record;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = resolveMedicalRecord;

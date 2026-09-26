const { MedicalHistory } = require("../models");
const AppError = require("../utils/AppError");

async function getHistory(req, res, next) {
  try {
    const history = await MedicalHistory.findOne({
      where: { medical_record_id: req.medicalRecord.id },
    });

    if (!history) {
      throw new AppError(
        "Este paciente aún no tiene historia clínica registrada",
        404,
      );
    }

    res.status(200).json({
      status: "success",
      data: history,
    });
  } catch (error) {
    next(error);
  }
}

async function createHistory(req, res, next) {
  try {
    const existing = await MedicalHistory.findOne({
      where: { medical_record_id: req.medicalRecord.id },
    });
    if (existing) {
      throw new AppError(
        "Este paciente ya tiene historia clínica registrada",
        409,
      );
    }

    const {
      hereditary_background,
      pathological_background,
      non_pathological_background,
    } = req.body;

    const history = await MedicalHistory.create({
      medical_record_id: req.medicalRecord.id,
      hereditary_background: hereditary_background || {},
      pathological_background: pathological_background || {},
      non_pathological_background: non_pathological_background || {},
    });

    res.status(201).json({
      status: "success",
      data: history,
    });
  } catch (error) {
    next(error);
  }
}

async function updateHistory(req, res, next) {
  try {
    const history = await MedicalHistory.findOne({
      where: { medical_record_id: req.medicalRecord.id },
    });

    if (!history) {
      throw new AppError(
        "Este paciente aún no tiene historia clínica registrada",
        404,
      );
    }

    await history.update(req.body);
    res.status(200).json({
      status: "success",
      data: history,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getHistory,
  createHistory,
  updateHistory,
};

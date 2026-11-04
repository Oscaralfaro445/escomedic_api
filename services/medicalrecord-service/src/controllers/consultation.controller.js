const {
  Consultation,
  ConsultationStatus,
  MedicalRecord,
} = require("../models");
const AppError = require("../utils/AppError");
const {
  buildIdentityHeaders,
  validateEmployeeExists,
} = require("../utils/externalServicesClient");

async function listConsultations(req, res, next) {
  try {
    const consultations = await Consultation.findAll({
      where: { medical_record_id: req.medicalRecord.id },
      order: [
        ["date", "DESC"],
        ["time", "DESC"],
      ],
    });

    res.status(200).json({
      status: "success",
      data: consultations,
    });
  } catch (error) {
    next(error);
  }
}

async function getConsultationById(req, res, next) {
  try {
    const { consultationId } = req.params;
    const consultation = await Consultation.findOne({
      where: { id: consultationId, medical_record_id: req.medicalRecord.id },
    });
    if (!consultation) {
      throw new AppError("Consulta no encontrada", 404);
    }

    res.status(200).json({
      status: "success",
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
}

async function createConsultation(req, res, next) {
  try {
    const {
      employee_id,
      date,
      time,
      reason,
      current_condition,
      vital_signs,
      physical_examination,
      notes,
      diagnosis,
      cie10_code,
      treatment,
      prevention,
      referred,
    } = req.body;

    if (
      !employee_id ||
      !date ||
      !time ||
      !reason ||
      !current_condition ||
      !vital_signs ||
      !diagnosis
    ) {
      throw new AppError(
        "employee_id, date, time, reason, current_condition, vital_signs y diagnosis son requeridos",
        400,
      );
    }

    await validateEmployeeExists(employee_id, buildIdentityHeaders(req));

    const openStatus = await ConsultationStatus.findOne({
      where: { name: "abierta (en curso)" },
    });
    if (!openStatus) {
      throw new AppError("Catálogo de estados de consulta no encontrado", 500);
    }

    const consultation = await Consultation.create({
      medical_record_id: req.medicalRecord.id,
      employee_id,
      status_id: openStatus.id,
      date,
      time,
      reason,
      current_condition,
      vital_signs,
      physical_examination: physical_examination || {},
      notes,
      diagnosis,
      cie10_code,
      treatment,
      prevention,
      referred: referred || false,
    });

    res.status(201).json({
      status: "success",
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
}

async function updateConsultation(req, res, next) {
  try {
    const { consultationId } = req.params;
    const { status_name, ...rest } = req.body;

    const consultation = await Consultation.findOne({
      where: { id: consultationId, medical_record_id: req.medicalRecord.id },
    });
    if (!consultation) {
      throw new AppError("Consulta no encontrada", 404);
    }

    const updates = { ...rest };

    if (status_name) {
      const status = await ConsultationStatus.findOne({
        where: { name: status_name },
      });
      if (!status)
        throw new AppError("status_name no es un estado válido", 400);
      updates.status_id = status.id;
    }

    await consultation.update(updates);
    res.status(200).json({
      status: "success",
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
}

async function listConsultationsByDate(req, res, next) {
  try {
    const { date, employee_id } = req.query;
    if (!date) throw new AppError("date es requerido (YYYY-MM-DD)", 400);

    const where = { date };
    if (employee_id) where.employee_id = employee_id;

    const consultations = await Consultation.findAll({
      where,
      attributes: [
        "id",
        "date",
        "time",
        "reason",
        "diagnosis",
        "cie10_code",
        "employee_id",
      ],
      include: [
        { model: MedicalRecord, attributes: ["patient_id"] },
        { model: ConsultationStatus, attributes: ["name"] },
      ],
      order: [["time", "ASC"]],
    });

    res.status(200).json({ status: "success", data: consultations });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  listConsultationsByDate,
};

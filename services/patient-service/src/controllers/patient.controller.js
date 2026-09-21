const { Op } = require("sequelize");
const { Patient } = require("../models");
const AppError = require("../utils/AppError");

const VALID_GENDERS = ["masculino", "femenino", "otro"];
const VALID_BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const VALID_TYPES = ["Alumno", "Docente", "PAAE", "Externo"];
const VALID_ORIGINS = ["ESCOM", "CIC", "Externo"];

function validatePatientInput(body) {
  const {
    name,
    last_name_p,
    last_name_m,
    gender,
    blood_type,
    birth_date,
    phone,
    email,
    address,
    marital_status,
    institutional_id,
    type,
    origin,
  } = body;

  if (
    !name ||
    !last_name_p ||
    !last_name_m ||
    !gender ||
    !blood_type ||
    !birth_date ||
    !address ||
    !marital_status ||
    !institutional_id ||
    !type ||
    !origin
  ) {
    throw new AppError("Faltan campos requeridos", 400);
  }

  if (!VALID_GENDERS.includes(gender)) {
    throw new AppError(
      `gender debe ser uno de: ${VALID_GENDERS.join(", ")}`,
      400,
    );
  }

  if (!VALID_BLOOD_TYPES.includes(blood_type)) {
    throw new AppError(
      `blood_type debe ser uno de: ${VALID_BLOOD_TYPES.join(", ")}`,
      400,
    );
  }

  if (!VALID_TYPES.includes(type)) {
    throw new AppError(`type debe ser uno de: ${VALID_TYPES.join(", ")}`, 400);
  }

  if (!VALID_ORIGINS.includes(origin)) {
    throw new AppError(
      `origin debe ser uno de: ${VALID_ORIGINS.join(", ")}`,
      400,
    );
  }
}

async function createPatient(req, res, next) {
  try {
    validatePatientInput(req.body);

    const existing = await Patient.findOne({
      where: { institutional_id: req.body.institutional_id },
    });
    if (existing) {
      throw new AppError("Ya existe un paciente con ese institutional_id", 409);
    }

    const patient = await Patient.create(req.body);
    res.status(201).json({
      status: "success",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
}

async function listPatients(req, res, next) {
  try {
    const { search, type, origin } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { last_name_p: { [Op.iLike]: `%${search}%` } },
        { last_name_m: { [Op.iLike]: `%${search}%` } },
        { institutional_id: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (type) where.type = type;
    if (origin) where.origin = origin;

    const patients = await Patient.findAll({
      where,
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({
      status: "success",
      data: patients,
    });
  } catch (error) {
    next(error);
  }
}

async function getPatientById(req, res, next) {
  try {
    const patient = await Patient.findByPk(req.params.patientId);
    if (!patient) throw new AppError("Paciente no encontrado", 404);
    res.status(200).json({
      status: "success",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
}

async function updatePatient(req, res, next) {
  try {
    const patient = await Patient.findByPk(req.params.patientId);
    if (!patient) throw new AppError("Paciente no encontrado", 404);

    await patient.update({ ...req.body, updated_at: new Date() });
    res.status(200).json({
      status: "success",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createPatient, listPatients, getPatientById, updatePatient };

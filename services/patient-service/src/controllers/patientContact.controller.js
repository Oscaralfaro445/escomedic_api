const { Patient, PatientContact } = require("../models");
const AppError = require("../utils/AppError");

async function listContacts(req, res, next) {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findByPk(patientId);
    if (!patient) throw new AppError("Paciente no encontrado", 404);

    const contacts = await PatientContact.findAll({
      where: { patient_id: patientId },
    });
    res.status(200).json({
      status: "success",
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
}

async function createContact(req, res, next) {
  try {
    const { patientId } = req.params;
    const { name, last_name, relationship, phone } = req.body;

    if (!name || !last_name || !relationship || !phone) {
      throw new AppError(
        "name, last_name, relationship y phone son requeridos",
        400,
      );
    }

    const patient = await Patient.findByPk(patientId);
    if (!patient) throw new AppError("Paciente no encontrado", 404);

    const contact = await PatientContact.create({
      patient_id: patientId,
      name,
      last_name,
      relationship,
      phone,
    });
    res.status(201).json({
      status: "success",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  try {
    const { patientId, contactId } = req.params;

    const contact = await PatientContact.findOne({
      where: { id: contactId, patient_id: patientId },
    });
    if (!contact) throw new AppError("Contacto no encontrado", 404);

    await contact.update(req.body);
    res.status(200).json({
      status: "success",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  try {
    const { patientId, contactId } = req.params;

    const contact = await PatientContact.findOne({
      where: { id: contactId, patient_id: patientId },
    });
    if (!contact) throw new AppError("Contacto no encontrado", 404);

    await contact.destroy();
    res.status(200).json({
      status: "success",
      message: "Contacto eliminado",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { listContacts, createContact, updateContact, deleteContact };

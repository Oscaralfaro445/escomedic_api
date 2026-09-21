const express = require("express");
const router = express.Router();
const {
  createPatient,
  listPatients,
  getPatientById,
  updatePatient,
} = require("../controllers/patient.controller");
const {
  listContacts,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/patientContact.controller");
const authenticate = require("../middlewares/authenticate");

// Todas las rutas requiren autenticación, sin restriccion de rol
// (administrador y doctor tienen el mismo nivel de acceso a pacientes)

router.use(authenticate);

router.get("/", listPatients);
router.get("/:patientId", getPatientById);
router.post("/", createPatient);
router.put("/:patientId", updatePatient);

router.get("/:patientId/contacts", listContacts);
router.post("/:patientId/contacts", createContact);
router.put("/:patientId/contacts/:contactId", updateContact);
router.delete("/:patientId/contacts/:contactId", deleteContact);

module.exports = router;

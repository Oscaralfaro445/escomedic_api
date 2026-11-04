const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const resolvePatient = require("../middlewares/resolvePatient");
const resolveMedicalRecord = require("../middlewares/resolveMedicalRecord");

const {
  getFullMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord,
} = require("../controllers/medicalRecord.controller");
const {
  getHistory,
  createHistory,
  updateHistory,
} = require("../controllers/medicalHistory.controller");
const {
  listConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  listConsultationsByDate,
} = require("../controllers/consultation.controller");

router.use(authenticate);

router.post("/", createMedicalRecord);

router.get("/consultations", listConsultationsByDate);

router.get(
  "/:patientId",
  resolvePatient,
  resolveMedicalRecord,
  getFullMedicalRecord,
);
router.put(
  "/:patientId",
  resolvePatient,
  resolveMedicalRecord,
  updateMedicalRecord,
);

router.get(
  "/:patientId/history",
  resolvePatient,
  resolveMedicalRecord,
  getHistory,
);
router.post(
  "/:patientId/history",
  resolvePatient,
  resolveMedicalRecord,
  createHistory,
);
router.put(
  "/:patientId/history",
  resolvePatient,
  resolveMedicalRecord,
  updateHistory,
);

router.get(
  "/:patientId/consultations",
  resolvePatient,
  resolveMedicalRecord,
  listConsultations,
);
router.post(
  "/:patientId/consultations",
  resolvePatient,
  resolveMedicalRecord,
  createConsultation,
);
router.get(
  "/:patientId/consultations/:consultationId",
  resolvePatient,
  resolveMedicalRecord,
  getConsultationById,
);
router.put(
  "/:patientId/consultations/:consultationId",
  resolvePatient,
  resolveMedicalRecord,
  updateConsultation,
);

module.exports = router;

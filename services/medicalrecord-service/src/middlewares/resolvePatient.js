const {
  buildIdentityHeaders,
  validatePatientExists,
} = require("../utils/externalServicesClient");

async function resolvePatient(req, res, next) {
  try {
    const { patientId } = req.params;

    await validatePatientExists(patientId, buildIdentityHeaders(req)); // Lanza AppError 404 si no existe
    req.patientId = patientId;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = resolvePatient;

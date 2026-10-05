const AppError = require("./AppError");

function buildIdentityHeaders(req) {
  return {
    "x-user-id": req.headers["x-user-id"],
    "x-user-role": req.headers["x-user-role"],
  };
}

async function getPatient(patientId, identityHeaders) {
  const response = await fetch(
    `${process.env.PATIENT_SERVICE_URL}/patients/${patientId}`,
    {
      headers: identityHeaders,
    },
  );
  if (response.status === 404)
    throw new AppError("El paciente indicado no existe", 4001);
  if (!response.ok)
    throw new AppError("Error al consultar patient-service", response.status);
  const { data } = await response.json();
  return data;
}

async function validateEmployeeExists(employeeId, identityHeaders) {
  const response = await fetch(
    `${process.env.EMPLOYEE_SERVICE_URL}/employees/${employeeId}/exists`,
    {
      headers: identityHeaders,
    },
  );
  if (response.status === 404)
    throw new AppError("El empleado (doctor) indicado no existe", 404);
  if (!response.ok)
    throw new AppError("Error al consultar employee-service", response.status);
}

async function getConsultation(patientId, consultationId, identityHeaders) {
  const response = await fetch(
    `${process.env.MEDICALRECORD_SERVICE_URL}/medical-record/${patientId}/consultations/${consultationId}`,
    {
      headers: identityHeaders,
    },
  );
  if (response.status === 404)
    throw new AppError("La consulta indicada no existe", 404);
  if (!response.ok)
    throw new AppError(
      "Error al consultar medical-record-service",
      response.status,
    );
  const { data } = await response.json();
  return data;
}

async function getMedicalHistory(patientId, identityHeaders) {
  const response = await fetch(
    `${process.env.MEDICALRECORD_SERVICE_URL}/medical-record/${patientId}/history`,
    {
      headers: identityHeaders,
    },
  );
  if (response.status === 404) return null;
  if (!response.ok)
    throw new AppError(
      "Error al consultar historial clinica en medicalrecord-service",
      response.status,
    );
  const { data } = await response.json();
  return data;
}

async function updateConsultationCie10(
  patientId,
  consultationId,
  cie10_code,
  identityHeaders,
) {
  const response = await fetch(
    `${process.env.MEDICALRECORD_SERVICE_URL}/medical-record/${patientId}/consultations/${consultationId}`,
    {
      method: "PUT",
      headers: {
        ...identityHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cie10_code }),
    },
  );
  if (!response.ok)
    throw new AppError(
      "Error al guardar cie10_code en medicalrecord-service",
      response.status,
    );
}

module.exports = {
  buildIdentityHeaders,
  getPatient,
  validateEmployeeExists,
  getConsultation,
  getMedicalHistory,
  updateConsultationCie10,
};

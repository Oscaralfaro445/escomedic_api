const AppError = require("../utils/AppError");

function buildIdentityHeaders(req) {
  return {
    "x-user-id": req.headers["x-user-id"],
    "x-user-role": req.headers["x-user-role"],
  };
}

async function validatePatientExists(patientId, identityHeaders) {
  const response = await fetch(
    `${process.env.PATIENT_SERVICE_URL}/patients/${patientId}`,
    {
      headers: identityHeaders,
    },
  );

  if (response.status === 404) {
    throw new AppError("El paciente indicado no existe", 404);
  }

  if (!response.ok) {
    throw new AppError(
      "Error al validar el paciente en patient-service",
      response.status,
    );
  }

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

  if (response.status === 404) {
    throw new AppError("Em empleado (doctor) indicado no existe", 404);
  }

  if (!response.ok) {
    throw new AppError(
      "Error al validar el empleado en employee-service",
      response.status,
    );
  }

  const { data } = await response.json();
  return data;
}

module.exports = {
  buildIdentityHeaders,
  validatePatientExists,
  validateEmployeeExists,
};

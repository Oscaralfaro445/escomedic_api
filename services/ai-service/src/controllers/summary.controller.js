const { AiRequestLog, AiResponseLog } = require("../models");
const AppError = require("../utils/AppError");
const { callOpenAI } = require("../utils/openaiClient");
const calculateAge = require("../utils/calculateAge");
const {
  buildIdentityHeaders,
  getPatient,
  getMedicalHistory,
  validateEmployeeExists,
} = require("../utils/externalServicesClient");

const SUMMARY_SYSTEM_PROMPT = `Eres un asistente de síntesis clínica para un servicio médico universitario
de primer contacto. Se te proporciona el historial clínico estructurado de
un paciente (antecedentes heredofamiliares, patológicos y no patológicos)
en formato JSON, junto con sus datos demográficos básicos.

Genera un resumen clínico breve y relevante en texto libre (máximo 5 líneas),
resaltando únicamente lo clínicamente significativo para decidir un
tratamiento: alergias, medicamentos crónicos, enfermedades crónicas,
antecedentes heredofamiliares relevantes, y antecedentes quirúrgicos u
hospitalarios relevantes. Omite lo irrelevante. Responde en español, texto
plano, sin JSON, sin markdown.`;

// Funcion reutilizable: tambien la usa treatment.controller.js internamente
async function generateSummary({
  patientId,
  consultationId,
  employeeId,
  identityHeaders,
}) {
  const patient = await getPatient(patientId, identityHeaders);
  const history = await getMedicalHistory(patientId, identityHeaders);

  const userContent = `[DATOS DEL PACIENTE]
- Edad: ${calculateAge(patient.birth_date)} | Sexo: ${patient.gender} | Tipo sanguíneo: ${patient.blood_type}
- Antecedentes heredofamiliares: ${JSON.stringify(history?.hereditary_background || {})}
- Antecedentes patológicos: ${JSON.stringify(history?.pathological_background || {})}
- Antecedentes no patológicos: ${JSON.stringify(history?.non_pathological_background || {})}`;

  const result = await callOpenAI({
    messages: [
      { role: "system", content: SUMMARY_SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    maxOutputTokens: 300,
  });

  const requestLog = await AiRequestLog.create({
    endpoint_type: "summary",
    patient_id: patientId,
    consultation_id: consultationId,
    employee_id: employeeId,
    gpc_id: null,
    prompt_send: userContent,
    model_used: result.model,
    tokens_input: result.tokensInput,
    tokens_output: result.tokensOutput,
  });

  await AiResponseLog.create({
    request_id: requestLog.id,
    response_raw: result.text,
    response_parsed: { summary: result.text },
  });

  return result.text;
}

async function getSummary(req, res, next) {
  try {
    const { patientId } = req.params;
    const { consultationId, employeeId } = req.query;

    if (!consultationId || !employeeId) {
      throw new AppError(
        "consultationId y employeeId son requeridos como query params",
        400,
      );
    }

    const identityHeaders = buildIdentityHeaders(req);
    await validateEmployeeExists(employeeId, identityHeaders);

    const summary = await generateSummary({
      patientId,
      consultationId,
      employeeId,
      identityHeaders,
    });

    res.status(200).json({
      status: "success",
      data: {
        summary,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSummary,
  generateSummary,
};

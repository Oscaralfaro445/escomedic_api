const { AiRequestLog, AiResponseLog } = require("../models");
const AppError = require("../utils/AppError");
const resolveGpc = require("../utils/resolveGpc");
const { callOpenAI, parseJsonResponse } = require("../utils/openaiClient");
const {
  buildIdentityHeaders,
  validateEmployeeExists,
  getConsultation,
  updateConsultationCie10,
} = require("../utils/externalServicesClient");

const CIE10_SYSTEM_PROMPT = `Eres un codificador clínico. Tu tarea es identificar los códigos
CIE-10 más plausibles que corresponden al diagnóstico proporcionado,
del más específico al más general.

Responde ÚNICAMENTE con un arreglo JSON de 1 a 3 strings, sin texto adicional,
sin explicaciones. El primer elemento debe ser el código más específico.

Ejemplo de respuesta válida: ["J30.1"]
Otro ejemplo: ["J30.4", "J30"]`;

async function inferCie10(req, res, next) {
  try {
    const { patientId, consultationId, employeeId } = req.body;

    if (!patientId || !consultationId || !employeeId) {
      throw new AppError(
        "patientId, consultationId y employeeId son requeridos",
        400,
      );
    }

    const identityHeaders = buildIdentityHeaders(req);
    await validateEmployeeExists(employeeId, identityHeaders);

    const consultation = await getConsultation(
      patientId,
      consultationId,
      identityHeaders,
    );

    const userContent = `[DIAGNÓSTICO]\n${consultation.diagnosis}`;

    const result = await callOpenAI({
      messages: [
        { role: "system", content: CIE10_SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      maxOutputTokens: 20,
    });

    const candidates = parseJsonResponse(result.text);

    if (!Array.isArray(candidates) || candidates.length === 0) {
      throw new AppError(
        "La respuesta del modelo no es una arreglo válido de códigos CIE10",
        502,
      );
    }

    const primaryCode = candidates[0];

    const { gpc, ambiguous, matchedCodes } = await resolveGpc(candidates);
    const gpcId = gpc ? gpc.id : null;

    await updateConsultationCie10(
      patientId,
      consultationId,
      primaryCode,
      identityHeaders,
    );

    const requestLog = await AiRequestLog.create({
      endpoint_type: "cie10_match",
      patient_id: patientId,
      consultation_id: consultationId,
      employee_id: employeeId,
      gpc_id: gpcId,
      prompt_send: userContent,
      model_used: result.model,
      tokens_input: result.tokensInput,
      tokens_output: result.tokensOutput,
    });

    await AiResponseLog.create({
      request_id: requestLog.id,
      response_raw: result.text,
      response_parsed: {
        candidates,
        resolved_gpc: gpcId,
        resolved_ambiguous: ambiguous,
        matched_codes: matchedCodes,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        cie10_code: primaryCode,
        candidates,
        gpc_matched: !!gpc,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { inferCie10 };

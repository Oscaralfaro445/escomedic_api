const {
  GpcIndex,
  GpcCachedContent,
  AiRequestLog,
  AiResponseLog,
} = require("../models");
const AppError = require("../utils/AppError");
const { callOpenAI, parseJsonResponse } = require("../utils/openaiClient");
const calculateAge = require("../utils/calculateAge");
const {
  buildIdentityHeaders,
  validateEmployeeExists,
  getPatient,
  getConsultation,
} = require("../utils/externalServicesClient");
const { generateSummary } = require("./summary.controller");

const TREATMENT_SYSTEM_PROMPT = `Eres un asistente clínico de apoyo para médicos en un servicio médico
universitario de primer contacto. Generas recomendaciones de tratamiento
basadas en evidencia, específicamente en las Guías de Práctica Clínica
del IMSS. IMPORTANTE: Tus sugerencias apoyan al criterio médico, no lo
reemplazan. El médico tratante toma la decisión final.`;

async function generateTreatment(req, res, next) {
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

    const [patient, consultation] = await Promise.all([
      getPatient(patientId, identityHeaders),
      getConsultation(patientId, consultationId, identityHeaders),
    ]);

    if (!consultation.cie10_code) {
      throw new AppError(
        "Debe inferirse el código CIE10 (PUT /ai/cie10_code) antes de generar el tratamiento",
        400,
      );
    }

    const lastCie10Log = await AiRequestLog.findOne({
      where: { consultation_id: consultationId, endpoint_type: "cie10_match" },
      order: [["created_at", "DESC"]],
    });

    if (!lastCie10Log || !lastCie10Log.gpc_id) {
      throw new AppError(
        "No se encontró una guía de práctica clínica asociada a esta consulta. Verifique que el código CIE10 inferido corresponda a una GPC catalogada.",
        404,
      );
    }

    const gpc = await GpcIndex.findByPk(lastCie10Log.gpc_id);

    const [gerContent, grrContent] = await Promise.all([
      GpcCachedContent.findOne({
        where: { gpc_id: gpc.id, source_type: "GER" },
      }),
      GpcCachedContent.findOne({
        where: { gpc_id: gpc.id, source_type: "GRR" },
      }),
    ]);

    if (
      !gerContent ||
      gerContent.is_stale ||
      !grrContent ||
      grrContent.is_stale
    ) {
      throw new AppError(
        "La guía de práctica clínica no está disponible en caché (GER/GRR) o está desactualizada. Ejecute el procesamiento de GPC.",
        409,
      );
    }

    const patientSummary = await generateSummary({
      patientId,
      consultationId,
      employeeId,
      identityHeaders,
    });

    const userContent = `[PERFIL DEL PACIENTE]
- Edad: ${calculateAge(patient.birth_date)} | Sexo: ${patient.gender} | Tipo sanguíneo: ${patient.blood_type}
${patientSummary}

[CONSULTA ACTUAL]
- Motivo: ${consultation.reason}
- Padecimiento actual: ${consultation.current_condition}
- Exploración física: ${JSON.stringify(consultation.physical_examination)}
- Signos vitales: ${JSON.stringify(consultation.vital_signs)}
- Diagnóstico del médico: ${consultation.diagnosis}

[GUÍA DE PRÁCTICA CLÍNICA APLICABLE - GER (detalle completo)]
Código: ${gpc.gpc_code} — ${gpc.condition_name}
Sección de diagnóstico: ${gerContent.content_json.diagnostico}
Sección de tratamiento: ${gerContent.content_json.tratamiento}
Señales de alarma: ${gerContent.content_json.alarmas}

[GUÍA DE PRÁCTICA CLÍNICA - GRR (referencia rápida, contexto de la condición)]
Diagnóstico: ${grrContent.content_json.diagnostico}
Tratamiento: ${grrContent.content_json.tratamiento}

[INSTRUCCIÓN]
Con base en el diagnóstico, el perfil del paciente y ambas versiones de la GPC
proporcionadas (usa la GRR para contexto rápido de la condición y la GER para
dosificaciones y detalles técnicos), genera en formato JSON:
1. "tratamiento_farmacologico": array de medicamentos con nombre, dosis,
vía, duración y consideración especial (verificar alergias del paciente)
2. "medidas_no_farmacologicas": array de recomendaciones conductuales
3. "seguimiento": indicación de cuándo y cómo hacer seguimiento
4. "señales_de_alarma": criterios que requieren referir a segundo nivel
5. "prevencion": recomendaciones preventivas personalizadas al perfil
6. "referencia_segundo_nivel": boolean
7. "gpc_referenciada": código y título de la GPC utilizada
8. "advertencias_perfil": conflictos detectados entre el tratamiento
sugerido y el perfil del paciente (alergias, interacciones)

Responde SOLO en JSON estructurado, sin texto adicional.`;

    const result = await callOpenAI({
      messages: [
        { role: "system", content: TREATMENT_SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      maxOutputTokens: 1800,
    });

    const parsed = parseJsonResponse(result.text);

    const requestLog = await AiRequestLog.create({
      endpoint_type: "treatment",
      patient_id: patientId,
      consultation_id: consultationId,
      employee_id: employeeId,
      gpc_id: gpc.id,
      prompt_send: userContent,
      model_used: result.model,
      tokens_input: result.tokensInput,
      tokens_output: result.tokensOutput,
    });

    await AiResponseLog.create({
      request_id: requestLog.id,
      response_raw: result.text,
      response_parsed: parsed,
    });

    res.status(200).json({
      status: "success",
      data: parsed,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { generateTreatment };

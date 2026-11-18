require("dotenv").config();
const pdfParse = require("pdf-parse");
const sequelize = require("../src/config/db");
const { GpcIndex, GpcCachedContent } = require("../src/models");

const SYNTHESIS_SYSTEM_PROMPT = `Eres un asistente de síntesis clínica para un servicio médico universitario
de primer contacto. Se te proporciona una Guía de Práctica Clínica del IMSS.
Extrae y sintetiza ÚNICAMENTE la información clínicamente accionable
relevante para primer nivel de atención.

Devuelve un JSON con exactamente estas cinco claves:
{
"diagnostico": "criterios diagnósticos clave y estudios recomendados",
"tratamiento": "tratamiento farmacológico con dosis, vía y duración exactas",
"alarmas": "señales de alarma que requieren referencia a segundo nivel",
"seguimiento": "indicaciones de seguimiento y control",
"prevencion": "medidas preventivas y recomendaciones al paciente"
}
Cada valor es texto conciso en español. Sin markdown, sin listas anidadas.
Solo el JSON, sin texto adicional.`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadPdf(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`No se pudo descargar el PDF: ${url}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/* async function uploadToOpenAI(pdfBuffer, filename) {
  const form = new FormData();
  form.append(
    "file",
    new Blob([pdfBuffer], { type: "application/pdf" }),
    filename,
  );
  form.append("purpose", "user_data");

  const response = await fetch("https://api.openai.com/v1/files", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: form,
  });

  if (!response.ok)
    throw new Error(`Error al subir a OPpenAI: ${await response.text()}`);

  const data = await response.json();
  return data.id;
} */

async function extractText(pdfBuffer) {
  const { text, numpages } = await pdfParse(pdfBuffer);
  return { text: text.replace(/\n{3,}/g, "\n\n").trim(), pages: numpages };
}

async function synthesize(guideText) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        { role: "system", content: SYNTHESIS_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Sintetiza esta Guía de Práctica Clínica según el formato indicado.\n\n[TEXTO DE LA GUÍA]\n${guideText}`,
        },
      ],
    }),
  });

  if (!response.ok)
    throw new Error(`Error en síntesis: ${await response.text()}`);
  const data = await response.json();

  const outputText =
    data.output
      ?.flatMap((item) => item.content || [])
      .filter((content) => content.type === "output_text")
      .map((content) => content.text)
      .join("") || "";

  // El modelo a veces envuelve el JSON en un bloque markdown
  const cleaned = outputText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return { json: JSON.parse(cleaned), tokenUsed: data.usage?.total_tokens };
}

async function processOneSource(gpc, sourceType, url) {
  console.log(`\n[${sourceType}] Procesando ${gpc.gpc_code}...`);

  const pdfBuffer = await downloadPdf(url);
  const { text, pages } = await extractText(pdfBuffer);
  const estTokens = Math.round(text.length / 3.5);
  console.log(
    `PDF de ${pages} páginas, ~${estTokens} tokens estimados (aproximado)`,
  );

  if (text.length < 2000)
    throw new Error("El PDF casi no tiene texto (¿es un escaneo?)");
  if (estTokens > 900000)
    throw new Error(
      "El texto de la guía excede lo que cabe en una sola llamada",
    );
  if (sourceType === "GRR" && text.length > 80000)
    console.warn(
      "AVISO: la GRR es extensa; su texto se enviará completo en cada sugerencia",
    );

  const { json, tokenUsed } = await synthesize(text);
  console.log(`Síntesis generada (${tokenUsed} tokens)`);

  // De la GRR se conserva además el texto original, que se envía íntegro al modelo
  const content =
    sourceType === "GRR" ? { ...json, texto_completo: text } : json;

  await GpcCachedContent.upsert(
    {
      gpc_id: gpc.id,
      source_type: sourceType,
      content_json: content,
      is_stale: false,
      tokens_used: tokenUsed,
      processed_at: new Date(),
    },
    { conflictFields: ["gpc_id", "source_type"] },
  );
}

async function main() {
  const gpcCode = process.argv[2];
  const only = (process.argv[3] || "").toUpperCase(); // opcional: GER o GRR

  if (!gpcCode || (only && !["GER", "GRR"].includes(only))) {
    console.error("Uso: node scripts/process-gpc.js <gpc_code> [GER|GRR]");
    process.exit(1);
  }

  const gpc = await GpcIndex.findOne({ where: { gpc_code: gpcCode } });
  if (!gpc) {
    console.error(`No se encontró GPC con gpc_code=${gpcCode}`);
    process.exit(1);
  }

  const doGer = !only || only === "GER";
  const doGrr = !only || only === "GRR";

  try {
    if (doGer) await processOneSource(gpc, "GER", gpc.ger_url);
    if (doGer && doGrr) {
      console.log(
        "\nEsperando 30s antes de procesar la GRR (límite de tokens por minuto)...",
      );
      await sleep(30000);
    }
    if (doGrr) await processOneSource(gpc, "GRR", gpc.grr_url);

    gpc.last_processed = new Date();
    await gpc.save();
    console.log("\nGPC procesada y cacheada correctamente.");
  } catch (error) {
    console.error("\nError:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();

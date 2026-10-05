require("dotenv").config();
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

async function uploadToOpenAI(pdfBuffer, filename) {
  const form = new FormData();
  form.append(
    "file",
    new Blob([pdfBuffer], { type: "application/pdf" }),
    filename,
  );
  form.append("purpose", "user_date");

  const response = await fetch("https://api.openai.com/v1/files", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: form,
  });

  if (!response.ok)
    throw new Error(`Error al subir a OPpenAI: ${await response.text()}`);

  const data = await response.json();
  return data.id;
}

async function synthesize(fileId) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: [
        { role: "system", content: SYNTHESIS_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Sintetiza esta Guía de Práctica Clínica según el formato indicado.",
            },
            {
              type: "input_file",
              file_id: fileId,
            },
          ],
        },
      ],
      //max_output_tokens: 2000,
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

  return {
    json: JSON.parse(outputText.trim()),
    tokenUsed: data.usage?.total_tokens,
  };
}

async function processOneSource(gpc, sourceType, url, existingFileId) {
  console.log(`\n[${sourceType}] Procesando ${gpc.gpc_code}...`);

  let fileId = existingFileId;
  if (!fileId) {
    const pdfBuffer = await downloadPdf(url);
    fileId = await uploadToOpenAI(
      pdfBuffer,
      `${gpc.gpc_code}_${sourceType}.pdf`,
    );
    console.log(`Subido a OpenAI, file_id: ${fileId}`);
  } else {
    console.log(`Usando file_id existente: ${fileId}`);
  }

  const { json, tokenUsed } = await synthesize(fileId);
  console.log(`Síntesis generada (${tokenUsed} tokens)`);

  await GpcCachedContent.upsert(
    {
      gpc_id: gpc.id,
      source_type: sourceType,
      content_json: json,
      is_stale: false,
      tokens_used: tokenUsed,
      processed_at: new Date(),
    },
    { conflictFields: ["gpc_id", "source_type"] },
  );

  return fileId;
}

async function main() {
  const gpcCode = process.argv[2];
  if (!gpcCode) {
    console.error("Uso: node scripts/process-gpc.js <gpc_code>");
    console.error("Ejemplo: node scripts/process-gpc.js 062");
    process.exit(1);
  }

  const gpc = await GpcIndex.findOne({
    where: { gpc_code: gpcCode },
  });
  if (!gpc) {
    console.error(`No se encontró GPC con cie10_code=${gpcCode}`);
    process.exit(1);
  }

  try {
    const gerFileId = await processOneSource(
      gpc,
      "GER",
      gpc.ger_url,
      gpc.ger_file_id,
    );

    console.log(
      "\nEsperando 30s antes de procesar la GRR (límite de tokens por minuto de OpenAI)...",
    );
    await sleep(30000);

    const grrFileId = await processOneSource(
      gpc,
      "GRR",
      gpc.grr_url,
      gpc.grr_file_id,
    );

    gpc.ger_file__id = gerFileId;
    gpc.grr_file_id = grrFileId;
    gpc.last_processed = new Date();
    await gpc.save();

    console.log("\n GPC procesada y cacheado correctamente.");
  } catch (error) {
    console.error("\nError:", error.message);
  } finally {
    await sequelize.close();
  }
}

main();

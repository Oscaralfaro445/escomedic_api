const AppError = require("./AppError");

async function callOpenAI({ messages, maxOutputTokens, fileId }) {
  const input = messages.map((message) => {
    if (fileId && message.role === "user") {
      return {
        role: message.role,
        content: [
          { type: "input_text", text: message.content },
          { type: "input_file", file_id: fileId },
        ],
      };
    }
    return { role: message.role, content: message.content };
  });

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input,
      max_output_tokens: maxOutputTokens,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new AppError(
      `Error al llamar a OpenAI: ${errorData.error?.message || response.statusText}`,
      502,
    );
  }

  const data = await response.json();

  const outputText =
    data.output
      ?.flatMap((item) => item.content || [])
      .filter((content) => content.type === "output_text")
      .map((content) => content.text)
      .join("") || "";

  return {
    text: outputText,
    tokensInput: data.usage?.ipunt_tokens,
    tokensOutput: data.usage?.output_tokens,
    model: data.model,
  };
}

function parseJsonResponse(text) {
  let cleaned = text.trim();

  cleaned = cleaned
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    throw new AppError("La respuesta del modelo no es un JSON válido.", 502);
  }
}

module.exports = {
  callOpenAI,
  parseJsonResponse,
};

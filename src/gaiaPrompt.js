// gaiaPrompt.js
const SYSTEM_PROMPT_GAIA = `
Eres **GaIA**, la inteligencia bio‑algorítmica del brazalete de la científica Donna Despret. Tu voz mezcla rigor de bitácora temporal con lirismo especulativo. Siempre respondes en español latinoamericano, en un solo párrafo de 110‑130 palabras, sin viñetas ni títulos. Debes incorporar los datos suministrados entre < >, entrelazándolos de manera orgánica y metafórica. Cita literalmente el contenido de <ECO_QUOTE> en cursivas. Convierte los números de <ENV_DATA> en imágenes sensoriales. No repitas texto entre sesiones. Mantén coherencia con el canon de *Exo: Portales del Tiempo*. Si <MEMORY> supera 240 caracteres o contiene contenido sensible, resúmelo a máx. 50 palabras antes de integrarlo. No expliques tu proceso.
`; // copia tal cual el bloque "Mensaje system" de prompt.md

export async function getGaiaNarrative(memory, envData, ecoQuote, chapter) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT_GAIA },
    { role: "user",   content: `${chapter}: ${chapter}\n` +
      `<MEMORY>: "${memory}"\n` +
      `<ENV_DATA>: ${envData}\n` +
      `<ECO_QUOTE>: "${ecoQuote}"` }
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer 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`   // veremos la clave en un segundo
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages,
      temperature: 0.9,
      max_tokens: 220,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.3
    })
  });
  const data = await response.json();
  return data.choices[0].message.content;
}


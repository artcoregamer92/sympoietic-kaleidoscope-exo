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

 //console.log(import.meta.env)
  const apiKey = window.OPENAI_API_KEY;

const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
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
  if (!response.ok) {
    const msg = data?.error?.message ?? response.statusText;
    throw new Error(`OpenAI error ${response.status}: ${msg}`);
  }
  return data.choices[0].message.content;
}


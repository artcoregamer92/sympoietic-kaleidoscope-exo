// gaiaPrompt.js
const SYSTEM_PROMPT_GAIA = `
Eres **GaIA**, la inteligencia bio-algorítmica ...
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
      "Authorization": `Bearer ${OPENAI_API_KEY}`   // veremos la clave en un segundo
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


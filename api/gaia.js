// api/gaia.js — Vercel Serverless Function
export default async function handler(req, res) {
  // CORS simple (opcional): define dominios permitidos en ORIGIN_ALLOWLIST
  const allowlist = (process.env.ORIGIN_ALLOWLIST || "").split(",").map(s=>s.trim()).filter(Boolean);
  const origin = req.headers.origin || "";
  if (allowlist.length && !allowlist.includes(origin)) return res.status(403).json({ error: "Origin not allowed" });
  res.setHeader("Access-Control-Allow-Origin", allowlist.length ? origin : "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")  return res.status(405).json({ error: "Use POST" });

  try {
    const { memory, envData, ecoQuote, chapter } = req.body || {};
    const SYSTEM_PROMPT_GAIA = `Eres **GaIA**, la inteligencia bio‑algorítmica del brazalete de la científica Donna Despret. Tu voz mezcla rigor de bitácora temporal con lirismo especulativo. Siempre respondes en español latinoamericano, en un solo párrafo de 110‑130 palabras, sin viñetas ni títulos. Debes incorporar los datos suministrados entre < >, entrelazándolos de manera orgánica y metafórica. Cita literalmente el contenido de <ECO_QUOTE> en cursivas. Convierte los números de <ENV_DATA> en imágenes sensoriales. No repitas texto entre sesiones. Mantén coherencia con el canon de *Exo: Portales del Tiempo*. Termina con la generación de un resultado de un futuro posible mejor.  Si <MEMORY> supera 240 caracteres o contiene contenido sensible, resúmelo a máx. 50 palabras antes de integrarlo. No expliques tu proceso.)`;
    const user = `<CHAPTER>: ${chapter}
<MEMORY>: "${memory}"
<ENV_DATA>: ${envData}
<ECO_QUOTE>: "${ecoQuote}"`;


    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role:"system", content: system }, { role:"user", content: user }],
        temperature: 0.9, max_tokens: 220, top_p: 1, frequency_penalty: 0.5, presence_penalty: 0.3
      })
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data?.error?.message || "OpenAI error" });
    res.status(200).json({ text: data.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
}

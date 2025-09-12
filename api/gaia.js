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
    const system = `Eres GaIA… (pega aquí tu system prompt de docs/prompt.md)`;
    const user = `${chapter}: ${chapter}
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

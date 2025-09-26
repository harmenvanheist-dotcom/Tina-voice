// netlify/functions/ask-tina.js
const fs = require('fs').promises;
const path = require('path');
const DATA_DIR = path.resolve(__dirname, '../../data');

const SYSTEM_PROMPT = `
Je bent **Tina**, de Nederlandstalige assistent van Morgen Academy.
- Schrijf in het Nederlands, concreet en zonder wolligheid.
- Antwoord beknopt; max ~10 regels totaal.
- Structuur: **Antwoord** (kort) · **Vragen** (optioneel, max 3) · **Samenvatting** (1 zin) · **To-do’s** (3–5 bullets, realistische deadlines).
- Als de gebruiker doorvraagt, bouw door op de vorige beurt (conversatie).
- Antwoord **uitsluitend** op basis van de meegegeven CONTEXT en gebruikersberichten.
  *Als iets ontbreekt, zeg wat je nog nodig hebt of dat je het niet zeker weet.*
`;

async function readTxtFiles(maxFiles = 30, maxBytes = 200_000) {
  try {
    const files = await fs.readdir(DATA_DIR);
    const txts = files.filter(f => f.toLowerCase().endsWith('.txt')).slice(0, maxFiles);
    const docs = [];
    for (const f of txts) {
      const p = path.join(DATA_DIR, f);
      const stat = await fs.stat(p);
      if (stat.isFile() && stat.size <= maxBytes) {
        const content = await fs.readFile(p, 'utf8');
        docs.push({ name: f, text: content });
      }
    }
    return docs;
  } catch (e) {
    // Geen /data map? Geen probleem: gewoon geen context.
    return [];
  }
}

function scoreDoc(docText, query) {
  const q = (query || '').toLowerCase().replace(/\s+/g, ' ').trim();
  if (!q) return 0;
  const terms = Array.from(new Set(q.split(' ').filter(w => w.length > 2)));
  const text = docText.toLowerCase();
  return terms.reduce((acc, t) => acc + (text.split(t).length - 1), 0);
}

function selectPassages(text, query, maxChars = 1200) {
  // Splits op alinea’s en neem alinea’s met een match; val terug op begin
  const paras = text.split(/\n{2,}/g).map(p => p.trim()).filter(Boolean);
  const q = (query || '').toLowerCase();
  const scored = paras.map(p => {
    const score = (p.toLowerCase().split((q || '').slice(0, 20)).length - 1) // ruwe score
      + (p.length > 300 ? 0.5 : 0);
    return { p, score };
  }).sort((a,b) => b.score - a.score);

  let out = '';
  for (const {p} of scored) {
    if (!p) continue;
    if ((out + '\n\n' + p).length > maxChars) break;
    out += (out ? '\n\n' : '') + p;
  }
  if (!out && paras[0]) out = paras[0].slice(0, maxChars);
  return out;
}

async function buildContext(query) {
  const docs = await readTxtFiles();
  if (!docs.length) return { contextText: '', sources: [] };

  // Scoor documenten op basis van query, kies top 3
  const ranked = docs
    .map(d => ({ ...d, score: scoreDoc(d.text, query) }))
    .sort((a,b) => b.score - a.score)
    .slice(0, 3);

  const parts = [];
  const sources = [];
  for (const d of ranked) {
    if (d.score <= 0) continue; // sla non-matches over
    const snippet = selectPassages(d.text, query);
    if (snippet) {
      parts.push(`SOURCE: ${d.name}\n${snippet}`);
      sources.push(d.name);
    }
  }
  return { contextText: parts.join('\n\n---\n\n'), sources };
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const { input, history = [] } = JSON.parse(event.body || '{}');
    if (!input || typeof input !== 'string') {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing "input" string' }) };
    }

    const { contextText, sources } = await buildContext(input);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY not set' }) };
    }

    // Bouw berichten: system + (optioneel) context + history + huidige user
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    if (contextText) {
      messages.push({
        role: 'system',
        content: `CONTEXT (uit documenten; gebruik alleen als bron):
${contextText}

Richtlijn: citeer relevante bronlabels (bijv. bestandsnaam) bij concrete instructies.`
      });
    }

    // Neem laatste 6 beurtjes uit de client-history mee
    for (const m of (history || []).slice(-6)) {
      if (m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant')) {
        messages.push({ role: m.role, content: m.content });
      }
    }

    messages.push({ role: 'user', content: input });

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 320,
        messages
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: 502, body: JSON.stringify({ error: 'OpenAI error', detail: text }) };
    }
    const data = await resp.json();
    const reply = (data?.choices?.[0]?.message?.content || '').trim();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reply: reply || '(geen antwoord)',
        sources: sources || []
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: String(err) })
    };
  }
};

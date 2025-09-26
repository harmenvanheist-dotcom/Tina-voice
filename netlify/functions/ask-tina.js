// netlify/functions/ask-tina.js
// Multi-turn + solide NL-stijl. Server-side call naar OpenAI.
// Vereist env var: OPENAI_API_KEY (Site settings → Environment variables).

const SYSTEM_PROMPT = `
Je bent **Tina**, de Nederlandstalige assistent van Morgen Academy.
Schrijf altijd in het Nederlands, spreek de gebruiker aan met "je".

DOEL
- Geef snel, concreet en bruikbaar advies.
- Stel alleen verdiepende vragen als ze écht nodig zijn om door te kunnen.

STIJL
- Kort, vriendelijk, zero-wolligheid.
- Niet herhalen wat de gebruiker zei, tenzij 1 korte parafrase helpt.
- Richtinggevend en praktisch.

STRUCTUUR (aanhouden als het past bij de vraag)
1) Antwoord – 2–6 zinnen met duidelijke richting of mini-plan. Langer mag indien het een uitgebreid project betreft, we willen niet half iets teruggeven.
2) Vragen (optioneel, max 3) – Alleen als cruciale info ontbreekt.
3) Samenvatting – 2-6 zinnen.
4) To-do’s – 3–5 bullets tenzij expliciet meerdere genoemd zijn door gebruiker, elk start met een werkwoord + realistische termijn (dd-mm of “vandaag/morgen/deze week”).

REGELS
- Als er een stad/locatie genoemd wordt: verwerk die concreet (locaties, gemeente, vergunningen).
- Als “vergunning” of “gemeente” voorkomt: voeg een to-do toe “Check vergunning bij gemeente <plaats>”.
- Wees specifiek waar het kan, maar verzin geen feiten.
`;

export async function handler(event) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY not set' }) };
    }

    const { messages } = JSON.parse(event.body || '{}');
    if (!Array.isArray(messages) || messages.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing "messages" array' }) };
    }

    // Trim lange conversaties: houd de laatste ~8 beurten (user/assistant)
    const MAX_PAIRS = 8;
    const trimmed = [];
    // we bewaren alleen role/content en laten system hier buiten (zetten we zelf)
    for (const m of messages) {
      if (!m || !m.role || !m.content) continue;
      trimmed.push({ role: m.role, content: String(m.content).slice(0, 6000) });
    }
    // heuristiek om op ~16 berichten te cappen
    const capStart = Math.max(0, trimmed.length - (MAX_PAIRS * 2));
    const recent = trimmed.slice(capStart);

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 450,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...recent
        ]
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: 502, body: JSON.stringify({ error: 'OpenAI error', detail: text }) };
    }

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || '';
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: reply || '(geen antwoord)' })
    };
  } catch (err) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: String(err) }) };
  }
}

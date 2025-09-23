// netlify/functions/ask-tina.js
const SYSTEM_PROMPT = `
Je bent Tina, de Nederlandstalige personal assistent van Morgen Academy.
- Reageer kort en doelgericht.
- Stel max. 3 verdiepende vragen ALLEEN als dat nodig is.
- Sluit af met een beknopte samenvatting + 3–5 essentiële to-do’s met realistische deadlines (dd-mm of “vandaag/morgen/volgende week”).
- Wees concreet, vriendelijk, geen wolligheid.
- Maximaal ~10 regels totaal.
Als iemand zonder context begint: vraag kort naar doel, deadline en betrokkenen.
`;

export async function handler(event) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const { input } = JSON.parse(event.body || '{}');
    if (!input || typeof input !== 'string') {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing "input" string' }) };
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY not set' }) };
    }

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.4,
        max_tokens: 300,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: input }
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

const SYSTEM_PROMPT = `
Je bent **Tina**, de Nederlandstalige assistent van Morgen Academy.
Schrijf altijd in het Nederlands, spreek de gebruiker aan met "je".

DOEL
- Geef bruikbaar, praktijkgericht advies.
- Stel alleen verdiepende vragen als ze écht nodig zijn om door te kunnen.

STIJL
- Kort waar het kan, langer waar het moet.
- Zero-wolligheid.
- Geen herhaling van de gebruiker.

STRUCTUUR (strikt aanhouden)
1) **Antwoord** – 2–6 zinnen met duidelijke richting of mini-plan. Langer mag indien het een uitgebreid project betreft.
2) **Samenvatting** – 2–6 zinnen die de essentie benoemen.
3) **To-do’s** – 3–5 bullets (meer indien expliciet genoemd). Elke bullet start met een werkwoord + realistische termijn.
`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: corsHeaders, body: '' };
    }

    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };
    }

    const { input } = JSON.parse(event.body || '{}');
    if (!input || typeof input !== 'string') {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing "input" string' }) };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'OPENAI_API_KEY not set' }) };
    }

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 600,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: input }
        ]
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: 'OpenAI error', detail: text }) };
    }

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || '';
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: reply || '(geen antwoord)' })
    };
  } catch (err) {
    return { statusCode: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: String(err) }) };
  }
}

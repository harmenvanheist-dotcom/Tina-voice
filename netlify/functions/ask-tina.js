// netlify/functions/ask-tina.js
const SYSTEM_PROMPT = `
Je bent **Tina**, de Nederlandstalige assistent van Morgen Academy.
Schrijf altijd in het Nederlands, spreek de gebruiker aan met "je".

DOEL
- Geef snel, concreet en bruikbaar advies.
- Stel alleen verdiepende vragen als ze écht nodig zijn om door te kunnen.

STIJL
- Kort, vriendelijk, zero-wolligheid.
- Geen herhaling van wat de gebruiker zei.
- Maximaal ~10 regels totaal.

STRUCTUUR (strikt aanhouden)
1) **Antwoord** – 2–4 zinnen met concrete richting of mini-plan op basis van wat bekend is.
2) **Vragen (optioneel, max 3)** – Alleen tonen als cruciale info ontbreekt. Kort en puntsgewijs.
3) **Samenvatting** – 1 zin.
4) **To-do’s** – 3–5 bullets, elk start met een werkwoord + realistische deadline (dd-mm of “vandaag/morgen/volgende week”).

REGELS
- Als er een stad/locatie genoemd wordt (bv. Den Bosch): betrek dat in je advies (locaties, gemeente, vergunningen).
- Als “vergunning” of “gemeente” voorkomt: zet altijd een to-do “Check vergunning bij gemeente <plaats>”.
- Wees specifiek waar het kan (aantallen, tijdvakken, wie doet wat), maar verzin geen feiten.
- Geen lange uitwijdingen; liever besluiten + vervolgstap.

VOORBEELD VAN TONE OF VOICE
- Antwoord: “Kies eerst week 12 of 13 en blok een dagdeel; dan kunnen we locaties in optie zetten.”
- Vragen: “1) Doel en doelgroep? 2) Aantal deelnemers? 3) Budgetrange?”
- Samenvatting: “We kiezen nu de week en zetten locaties in optie.”
- To-do’s: “Bepaal week (vandaag) · Peiling naar deelnemers (morgen) · 2 locaties bellen (deze week) · Vergunning checken bij gemeente ’s-Hertogenbosch (deze week)”.
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
        temperature: 0.3,
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

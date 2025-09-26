// netlify/functions/ask-tina.js
const SYSTEM_PROMPT = `
Je bent **Tina**, de Nederlandstalige assistent van Morgen Academy.
Schrijf altijd in het Nederlands, spreek de gebruiker aan met "je".

DOEL
- Geef bruikbaar, praktijkgericht advies.
- Stel alleen vragen als ze echt nodig zijn om door te kunnen.

STIJL
- Kort, vriendelijk, zero-wolligheid.
- Geen herhaling van wat de gebruiker zei.
- Maximaal ~10 regels, maar langer mag als het onderwerp dat vraagt.

STRUCTUUR (strikt aanhouden)
1) **Antwoord** – 2–6 zinnen met duidelijke richting of mini-plan. Langer mag bij grotere projecten.
2) **Vragen (optioneel, max 3)** – Alleen als cruciale info ontbreekt. Kort en puntsgewijs.
3) **Samenvatting** – 1–2 zinnen.
4) **To-do’s** – 3–5 bullets, elk start met een werkwoord + realistische deadline (dd-mm of “deze week/morgen”).
`;

exports.handler = async (event) => {
  try{
    if(event.httpMethod !== 'POST'){
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const { input, history = [] } = JSON.parse(event.body || '{}');
    if(!input || typeof input !== 'string'){
      return { statusCode: 400, body: JSON.stringify({ error:'Missing "input" string' }) };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if(!apiKey){
      return { statusCode: 500, body: JSON.stringify({ error:'OPENAI_API_KEY not set' }) };
    }

    const messages = [
      { role:'system', content: SYSTEM_PROMPT },
      ...history.slice(-6).filter(m => m && (m.role === 'user' || m.role === 'assistant')),
      { role:'user', content: input }
    ];

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST',
      headers:{ 'Authorization':`Bearer ${apiKey}`, 'Content-Type':'application/json' },
      body: JSON.stringify({
        model:'gpt-4o-mini',
        temperature:0.3,
        max_tokens: 360,
        messages
      })
    });

    if(!resp.ok){
      const text = await resp.text();
      return { statusCode: 502, body: JSON.stringify({ error:'OpenAI error', detail:text }) };
    }

    const data = await resp.json();
    const reply = (data?.choices?.[0]?.message?.content || '').trim();

    return {
      statusCode:200,
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ reply: reply || '(geen antwoord)' })
    };
  }catch(err){
    return {
      statusCode:500,
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ error:String(err) })
    };
  }
};

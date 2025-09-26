<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Tina – Voice assistent</title>
  <meta name="color-scheme" content="dark light" />
  <link rel="icon" href="logo.png" />
  <style>
    :root{
      --bg1:#5f2a79; --bg2:#3d1d59;
      --card:#3f235aee; --cardSoft:#3b2155cc;
      --border:rgba(255,255,255,.08);
      --text:#ffffffde; --muted:#ffffff99;
      --brand:#d0ff2a; --brandText:#152200;
      --shadow:0 18px 50px rgba(0,0,0,.28);
      --radius:22px; --radiusLg:26px;
      --gap:28px; --maxW:1000px;
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      color:var(--text);
      background: radial-gradient(1200px 700px at 20% -10%, #8d58c9 0%, transparent 70%),
                  radial-gradient(1200px 700px at 100% 10%, #54257f 0%, transparent 60%),
                  linear-gradient(160deg,var(--bg1),var(--bg2));
      min-height:100%;
      -webkit-font-smoothing:antialiased;
      padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(24px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
    }
    .wrap{max-width:var(--maxW); margin:0 auto}
    .panel{
      background:linear-gradient(160deg,#3f235a,#2c1546 70%);
      border:1px solid var(--border);
      box-shadow:var(--shadow);
      border-radius:var(--radiusLg);
      padding:24px;
    }
    .top{
      display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:12px; padding:8px 12px 0 12px;
    }
    .brand{display:flex; align-items:center; gap:12px;}
    .brand img{width:28px; height:28px; border-radius:8px; box-shadow:0 6px 18px rgba(0,0,0,.35);}
    .title{font-size:28px; font-weight:800; color:var(--brand); text-shadow:0 6px 22px rgba(0,0,0,.35);}
    .subtitle{color:var(--muted); font-size:14px;}
    .status{background:rgba(255,255,255,.08); border:1px solid var(--border); color:#e6e6e6; border-radius:999px; padding:8px 14px; font-size:12px; white-space:nowrap;}

    .grid{display:grid; grid-template-columns: 1fr 1fr; gap:var(--gap); margin-top:18px;}
    .card{background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:22px;}
    .micWrap{display:flex; flex-direction:column; align-items:center; justify-content:center; gap:18px; height:100%;}
    .micBtn{
      width:240px; height:240px; border-radius:50%; display:grid; place-items:center;
      background: radial-gradient(circle at 50% 35%, #dfff4a, #b6ff1e 68%, #9be000 100%);
      box-shadow: 0 18px 50px rgba(0,0,0,.35), inset 0 -8px 22px rgba(0,0,0,.18);
      border:none; cursor:pointer; transition: transform .06s ease;
    }
    .micBtn:active{ transform: scale(.98) }
    .micIcon{ font-size:54px; filter: drop-shadow(0 8px 18px rgba(0,0,0,.35)); }
    .hint{ color:var(--muted); font-size:14px; }

    .rightCol{ display:flex; flex-direction:column; gap:18px; }
    .section{background:var(--cardSoft); border:1px solid var(--border); border-radius:18px; padding:18px;}
    .h{color:var(--brand); font-size:14px; font-weight:800; margin:0 0 10px;}
    .box{min-height:110px; font-size:16px; line-height:1.6;}
    .controls{margin-top:10px; display:flex; align-items:center; gap:16px; flex-wrap:wrap;}
    .chk{ accent-color:var(--brand); }
    .ghost{background: rgba(255,255,255,.08); color:var(--text); border:1px solid var(--border);
      border-radius:999px; padding:8px 12px; font-size:14px; cursor:pointer;}
    .ghost:hover{ background: rgba(255,255,255,.12) }

    .promo{margin-top:var(--gap); background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:14px 18px; display:flex; align-items:center; justify-content:space-between; gap:18px; flex-wrap:wrap;}
    .promoText{font-size:13px; color:var(--text);}
    .promoText .hi{color:var(--brand); font-weight:800}
    .cta{border:none; cursor:pointer; background:linear-gradient(180deg, #dfff4a, #c5ff2a);
      color:var(--brandText); font-weight:700; border-radius:999px; padding:10px 16px; box-shadow:0 10px 30px rgba(0,0,0,.25);
      text-decoration:none; font-size:14px;}

    footer{max-width:var(--maxW); margin:14px auto 0; color:var(--muted); font-size:12px;
      display:flex; gap:8px; flex-wrap:wrap; align-items:center; justify-content:space-between;}
    footer a{ color:#b4ff6a; text-decoration:none }

    @media (max-width: 820px){
      .grid{ grid-template-columns:1fr; }
      .micBtn{ width:56vw; height:56vw; max-width:360px; max-height:360px; }
      .panel{ padding:18px; }
      .top{ grid-template-columns:1fr auto; grid-template-areas:
        "brand status" "subtitle subtitle"; row-gap:8px; }
      .brandWrap{grid-area:brand}
      .subtitle{grid-area:subtitle}
      .status{grid-area:status}
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="panel">
      <div class="top">
        <div class="brand brandWrap">
          <a href="https://morgenacademy.nl" target="_blank" rel="noopener">
            <img src="./logo.png" alt="Morgen Academy">
          </a>
          <div class="title">Tina</div>
        </div>
        <div class="subtitle">Jouw personal assistent — bespreek waar je mee bezig bent. Tina vat samen en geeft je belangrijkste to-do’s.</div>
        <div class="status" id="status">Status: klaar</div>
      </div>

      <div class="grid">
        <div class="card">
          <div class="micWrap">
            <button id="micBtn" class="micBtn" aria-label="Spreken starten of stoppen"><span class="micIcon">🎤</span></button>
            <div class="hint">Klik om te spreken. Nogmaals klikken = stoppen.</div>
          </div>
        </div>
        <div class="rightCol">
          <div class="section">
            <p class="h">TRANSCRIPT</p>
            <div id="transcript" class="box">Hier verschijnt wat je zegt...</div>
          </div>
          <div class="section">
            <p class="h">SAMENVATTING EN TO-DO’S</p>
            <div id="answer" class="box">—</div>
            <div class="controls">
              <label><input id="ttsToggle" class="chk" type="checkbox"> Antwoorden voorlezen</label>
              <button id="clearBtn" class="ghost" type="button">Wis gesprek</button>
            </div>
          </div>
        </div>
      </div>

      <div class="promo">
        <div class="promoText">
          <span class="hi">Slimmer werken met AI</span> zodat jij tijd hebt voor leuke dingen. Of je nu elke dag in meetings zit, eindeloze to-do’s hebt of je business runt in de avonden: met Morgen Academy maak je je werkdag leuker en slimmer — ook als je geen tech-expert bent.
        </div>
        <a class="cta" href="https://morgenacademy.nl" target="_blank" rel="noopener">Ontdek trainingen</a>
      </div>
    </div>

    <footer>
      <div>Werkt alleen via <strong>HTTPS</strong> en na een gebruikersactie. iOS Safari: tabblad actief houden.</div>
      <div>Tina slaat geen data op, niets van wat je bespreekt of ontvangt is zichtbaar voor Morgen Academy.</div>
      <div>Prototype · <a href="https://morgenacademy.nl" target="_blank" rel="noopener">Morgen Academy</a></div>
    </footer>
  </div>

  <script>
    // ---- Endpoint routing (Netlify vs GitHub Pages) ----
    const ASK_TINA_ENDPOINT =
      (location.hostname === 'tina.morgenacademy.nl')
        ? '/.netlify/functions/ask-tina'
        : 'https://tina.morgenacademy.nl/.netlify/functions/ask-tina';

    // ---- UI refs ----
    const $ = s => document.querySelector(s);
    const statusEl = $('#status');
    const micBtn = $('#micBtn');
    const transcriptEl = $('#transcript');
    const answerEl = $('#answer');
    const ttsToggle = $('#ttsToggle');
    const clearBtn = $('#clearBtn');

    // ---- TTS (geen loop; we cancel vóór elk nieuw praatje) ----
    let synth = window.speechSynthesis;
    let nlVoice = null;
    if ('speechSynthesis' in window) {
      const pickVoice = () => {
        const voices = synth.getVoices();
        nlVoice = voices.find(v => /nl(-|_|\b)/i.test(v.lang)) || voices.find(v => /Dutch/i.test(v.name)) || null;
      };
      pickVoice();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = pickVoice;
      }
    }
    function speak(text){
      if(!ttsToggle.checked || !('speechSynthesis' in window)) return;
      synth.cancel(); // voorkom herhaal/overlap
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'nl-NL';
      if (nlVoice) u.voice = nlVoice;
      synth.speak(u);
    }

    // ---- Gespreksgeschiedenis (doorpraten) ----
    let history = [];

    // ---- Web Speech API (robuster luisteren met stilte-timeout) ----
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    let rec = null;
    let resultTimer = null;
    const SILENCE_MS = 1500; // wacht dit na laatste resultaat vóór verzenden

    function startRec(){
      if(!SR){
        transcriptEl.textContent = 'Je browser ondersteunt geen spraakherkenning.';
        return;
      }
      rec = new SR();
      rec.lang = 'nl-NL';
      rec.interimResults = true;
      rec.continuous = true;

      let buffer = '';      // definitieve tekst
      let lastChunkAt = 0;  // timestamp laatste interim/final

      rec.onstart = () => {
        statusEl.textContent = 'Status: luisteren…';
        transcriptEl.textContent = '';
      };
      rec.onerror = () => {
        statusEl.textContent = 'Status: fout';
      };
      rec.onresult = (evt) => {
        let interim = '';
        for (let i = evt.resultIndex; i < evt.results.length; i++) {
          const res = evt.results[i];
          if (res.isFinal) buffer += res[0].transcript + ' ';
          else interim += res[0].transcript;
        }
        lastChunkAt = Date.now();
        transcriptEl.textContent = (buffer + interim).trim();

        // debounce: als er SILENCE_MS voorbij gaat zonder nieuw resultaat, stop & verwerk
        clearTimeout(resultTimer);
        resultTimer = setTimeout(() => {
          if (rec) rec.stop();
        }, SILENCE_MS);
      };
      rec.onend = () => {
        clearTimeout(resultTimer);
        const text = transcriptEl.textContent.trim();
        if (text) sendToTina(text);
        else statusEl.textContent = 'Status: klaar';
      };
      rec.start();
    }

    micBtn.addEventListener('click', () => {
      if (!rec || (statusEl.textContent.includes('klaar') || statusEl.textContent.includes('fout'))) {
        // start nieuw
        startRec();
      } else if (statusEl.textContent.includes('luisteren')) {
        // manueel stoppen
        rec.stop();
      } else {
        startRec();
      }
    });

    clearBtn.addEventListener('click', () => {
      history = [];
      transcriptEl.textContent = 'Hier verschijnt wat je zegt...';
      answerEl.textContent = '—';
      if (synth) synth.cancel();
      statusEl.textContent = 'Status: klaar';
    });

    async function sendToTina(text){
      try{
        statusEl.textContent = 'Status: verwerken…';
        history.push({ role:'user', content:text });

        const resp = await fetch(ASK_TINA_ENDPOINT, {
          method:'POST',
          headers:{ 'Content-Type':'application/json' },
          body: JSON.stringify({ input: text, history })
        });

        if(!resp.ok){
          const msg = await resp.text();
          console.error('Function error:', msg);
          answerEl.textContent = 'Er ging iets mis bij het ophalen van het antwoord.';
          statusEl.textContent = 'Status: fout';
          return;
        }

        const data = await resp.json();
        const reply = (data.reply || '').trim() || '(geen antwoord)';
        answerEl.textContent = reply;
        history.push({ role:'assistant', content: reply });

        speak(reply);
        statusEl.textContent = 'Status: klaar';
      }catch(e){
        console.error(e);
        answerEl.textContent = 'Kon geen verbinding maken.';
        statusEl.textContent = 'Status: fout';
      } finally {
        rec = null; // forceer schone start bij volgende klik
      }
    }
  </script>
</body>
</html>

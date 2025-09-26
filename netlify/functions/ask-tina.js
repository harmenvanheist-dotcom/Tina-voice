// ask-tina.js  —  frontend logica (spraak → Tina → antwoord)
// Werkt op Netlify (tina.morgenacademy.nl) én op GitHub Pages preview.

const ASK_TINA_ENDPOINT =
  (location.host.endsWith('github.io'))
    ? 'https://tina.morgenacademy.nl/.netlify/functions/ask-tina'
    : '/.netlify/functions/ask-tina';

// UI hooks
const micBtn       = document.getElementById('micBtn');
const transcriptEl = document.getElementById('transcript');
const answerEl     = document.getElementById('answer');
const statusEl     = document.getElementById('status');
const clearBtn     = document.getElementById('clearBtn');
const ttsToggle    = document.getElementById('ttsToggle');

// Gespreksgeschiedenis voor “doorpraten”
let history = [];

// TTS (1x per antwoord, nooit in loop)
const synth = ('speechSynthesis' in window) ? window.speechSynthesis : null;
function speak(text){
  if (!ttsToggle?.checked || !synth) return;
  synth.cancel();                        // kill eventueel lopende stem
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'nl-NL';
  synth.speak(u);
}

// Web Speech API (browser) — robuust starten/stoppen
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let recState = 'idle'; // idle | starting | listening | stopping
let partialBuffer = '';
let lastFinalAt = 0;

function setStatus(s){ statusEl.textContent = `Status: ${s}`; }

function startRecognition(){
  if (!SR) {
    micBtn.disabled = true;
    transcriptEl.textContent = 'Deze browser ondersteunt geen spraakherkenning. Gebruik Chrome/Edge, of laat me Whisper inschakelen.';
    return;
  }
  if (recState !== 'idle') return;

  recognition = new SR();
  recognition.lang = 'nl-NL';
  recognition.interimResults = true;
  recognition.continuous = true;
  recognition.maxAlternatives = 1;

  partialBuffer = '';
  recState = 'starting';
  setStatus('microfoon activeren…');

  recognition.onstart = () => { recState = 'listening'; setStatus('luisteren…'); };

  recognition.onerror = (e) => {
    // Zichtbare hints bij veelvoorkomende fouten
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
      transcriptEl.textContent = 'Toegang tot microfoon geweigerd. Klik op het slotje bij de URL → Microfoon: Toestaan.';
    }
    setStatus('fout');
    recState = 'idle';
  };

  recognition.onresult = (evt) => {
    let interim = '';
    for (let i = evt.resultIndex; i < evt.results.length; i++){
      const res = evt.results[i];
      if (res.isFinal) {
        partialBuffer += res[0].transcript + ' ';
        lastFinalAt = Date.now();
      } else {
        interim += res[0].transcript;
      }
    }
    const text = (partialBuffer + (interim ? ' ' + interim : '')).trim();
    if (text) transcriptEl.textContent = text;

    // **Anti-te-vroeg-stoppen**: we wachten op stilte van ~800ms ná een final
    // iOS/Chrome geven soms snel final chunks; we throttle de stop zelf.
    if (evt.results[evt.results.length - 1]?.isFinal) {
      const plannedStopIn = 800; // ms
      const myStamp = Date.now();
      setTimeout(() => {
        // alleen stoppen als er geen nieuwe finals zijn binnengekomen
        if (Date.now() - lastFinalAt >= 750 && recState === 'listening') {
          try { recState = 'stopping'; recognition.stop(); } catch {}
        }
      }, plannedStopIn);
    }
  };

  recognition.onend = () => {
    // Wordt ook getriggerd na stop(); hier pas naar Tina sturen
    const finalText = partialBuffer.trim();
    partialBuffer = '';
    recState = 'idle';
    if (finalText) {
      setStatus('verwerken…');
      sendToTina(finalText);
    } else {
      setStatus('klaar');
    }
  };

  try {
    recognition.start();
  } catch {
    // “already started” race — abort en retry heel kort erna
    try { recognition.abort(); } catch {}
    setTimeout(() => { try { recognition.start(); } catch {} }, 120);
  }
}

function stopRecognition(){
  if (recState === 'listening') {
    recState = 'stopping';
    try { recognition.stop(); } catch {}
  }
}

// Mic klik
micBtn.addEventListener('click', () => {
  // Als hij nog aan het voorlezen is en jij klikt, kappen we TTS direct af
  if (synth) synth.cancel();

  if (recState === 'idle') {
    transcriptEl.textContent = '…verwerken…';
    answerEl.textContent = '—';
    startRecognition();
  } else if (recState === 'listening') {
    stopRecognition(); // handmatig stoppen
  }
});

// Wis gesprek
clearBtn.addEventListener('click', () => {
  history = [];
  if (recState === 'listening') stopRecognition();
  if (synth) synth.cancel();
  transcriptEl.textContent = 'Hier verschijnt wat je zegt...';
  answerEl.textContent = '—';
  setStatus('klaar');
});

// Call Netlify function
async function sendToTina(text){
  try{
    history.push({ role:'user', content:text });

    const resp = await fetch(ASK_TINA_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ input:text, history })
    });

    if (!resp.ok) {
      answerEl.textContent = 'Er ging iets mis bij het ophalen van het antwoord.';
      setStatus('fout');
      return;
    }

    const data = await resp.json();
    const reply = (data.reply || '(geen antwoord)').trim();

    // kleine opschoning/mark-up
    const html = reply
      .replace(/\*\*(Samenvatting|To-?do'?s?)\*\*:?/gi, '<strong>$1</strong>:')
      .replace(/(^|\n)-\s+/g, '$1• ');

    answerEl.innerHTML = html;
    history.push({ role:'assistant', content: reply });

    // Voorlees-optie (1x)
    speak(data.followUp || reply);
    setStatus('klaar');
  }catch(e){
    console.error(e);
    answerEl.textContent = 'Kon geen verbinding maken.';
    setStatus('fout');
  }
}

// Klein hulpsetje: badge wat ruimer
(() => {
  const badge = document.getElementById('status');
  if (badge){ badge.style.minWidth = '112px'; badge.style.textAlign = 'center'; }
})();

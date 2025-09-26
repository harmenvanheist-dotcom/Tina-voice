const $ = s => document.querySelector(s);
const statusEl = $('#status');
const ttsToggle = $('#ttsToggle');
const micBtn = $('#micBtn');
const transcriptEl = $('#transcript');
const answerEl = $('#answer');
const clearBtn = $('#clearBtn');

let history = [];
let speaking = false;
let synth = window.speechSynthesis;
let lastUtterance = null;

function setStatus(txt){ statusEl.textContent = 'Status: ' + txt; }

function speak(text){
  if(!ttsToggle.checked || !('speechSynthesis' in window)) return;
  if(speaking && synth.speaking) synth.cancel(); // stop lopende stem
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'nl-NL';
  speaking = true;
  u.onend = () => { speaking = false; lastUtterance = null; };
  lastUtterance = u;
  synth.speak(u);
}

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec;
if(SR){
  rec = new SR();
  rec.lang = 'nl-NL';
  rec.interimResults = true;
  rec.continuous = true;
  let buffer = '';

  rec.onstart = () => { setStatus('luisteren…'); if(speaking) synth.cancel(); };
  rec.onend = () => { setStatus('verwerken…'); if(buffer.trim()) sendToTina(buffer.trim()); buffer=''; };
  rec.onerror = () => setStatus('fout');

  rec.onresult = (evt)=>{
    let interim = '';
    for(let i = evt.resultIndex; i < evt.results.length; i++){
      const res = evt.results[i];
      (res.isFinal ? (buffer += res[0].transcript+' ') : (interim += res[0].transcript));
    }
    transcriptEl.textContent = (buffer + (interim ? (' '+interim) : '')).trim();
  };
} else {
  micBtn.disabled = true;
  transcriptEl.textContent = 'Je browser ondersteunt geen spraakherkenning.';
}

micBtn.addEventListener('click', ()=>{
  if(!rec) return;
  if(statusEl.textContent.includes('luisteren')){ rec.stop(); }
  else { transcriptEl.textContent = '…verwerken…'; answerEl.textContent = '—'; rec.start(); }
});

clearBtn.addEventListener('click', ()=>{
  history = [];
  transcriptEl.textContent = 'Hier verschijnt wat je zegt...';
  answerEl.textContent = '—';
  setStatus('klaar');
  if(speaking) synth.cancel();
});

async function sendToTina(text){
  try{
    setStatus('verwerken…');
    history.push({ role:'user', content:text });

    const resp = await fetch('/.netlify/functions/ask-tina', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ input: text, history })
    });

    if(!resp.ok){
      answerEl.textContent = 'Er ging iets mis bij het ophalen van het antwoord.';
      setStatus('fout');
      return;
    }

    const data = await resp.json();
    const reply = (data.reply || '(geen antwoord)').trim();
    answerEl.textContent = reply;
    history.push({ role:'assistant', content:reply });

    if(ttsToggle.checked) speak(reply);

    setStatus('klaar');
  }catch(e){
    setStatus('fout');
    answerEl.textContent = 'Kon geen verbinding maken.';
  }
}

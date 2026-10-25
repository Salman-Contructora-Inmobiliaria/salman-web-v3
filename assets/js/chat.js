/* ==========================================================================
   SALMAN — Salma, asesora digital (prototipo)
   Texto + voz (Web Speech API) · español/inglés · captura de lead · handoff
   --------------------------------------------------------------------------
   Este prototipo usa una base de conocimiento local con puntuación por
   palabras clave. En producción se reemplaza por un LLM + RAG (ver propuesta).
   ========================================================================== */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const WA = `https://wa.me/${CONFIG.whatsapp}`;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = window.speechSynthesis || null;
  const KB_BY_ID = Object.fromEntries(KB.map((k) => [k.id, k]));

  const chat = {
    open: false,
    lang: 'es',
    muted: false,
    chips: [],
    history: [],
    lead: null,
    lastProject: 'marina',
    voiceOpen: false,
    tab: 'salma',
    apiEnabled: true,
    listening: false,
    recognition: null,
    voiceFinal: '',
    speaking: false
  };

  const el = {};
  const normalize = (str) => String(str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[“”"'¿?¡!.,;:()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const esc = (str) => String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const t = (key) => window.SALMAN?.t(key) ?? key;
  const tf = (key, vars) => window.SALMAN?.tf(key, vars) ?? key;
  const track = (event, params = {}) => window.SALMAN?.track(event, params);
  const projectName = (id) => PROJECTS.find((p) => p.id === id)?.name || id;

  /* ------------------------------ mensajes ------------------------------ */
  function format(text) {
    return esc(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function now() {
    return new Date().toLocaleTimeString(chat.lang === 'es' ? 'es-CO' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  }

  function scrollDown() {
    requestAnimationFrame(() => {
      if (el.body) el.body.scrollTop = el.body.scrollHeight;
    });
  }

  function persist() {
    try {
      sessionStorage.setItem('salman.chat.v1', JSON.stringify({
        history: chat.history.slice(-24),
        chips: chat.chips,
        lang: chat.lang,
        lead: chat.lead
      }));
    } catch (err) { /* storage lleno o bloqueado: no interrumpir */ }
  }

  function addUser(text) {
    const message = { role: 'user', text, time: now() };
    chat.history.push(message);
    renderMessage(message);
    persist();
  }

  function addBot(text, opts = {}) {
    const message = { role: 'bot', text, time: now() };
    chat.history.push(message);
    const node = renderMessage(message, opts);
    persist();
    if (chat.voiceOpen && opts.speak !== false) speak(text);
    return node;
  }

  function renderMessage(message, opts = {}) {
    const node = document.createElement('div');
    node.className = `msg msg--${message.role}`;
    const body = document.createElement('div');
    body.innerHTML = format(message.text);
    node.appendChild(body);
    const time = document.createElement('span');
    time.className = 'msg__time';
    time.textContent = message.time;
    node.appendChild(time);
    if (opts.cta) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'msg__cta';
      btn.dataset.chatAction = opts.cta.action;
      btn.innerHTML = `${esc(opts.cta.label)} <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>`;
      node.appendChild(btn);
    }
    el.messages.appendChild(node);
    scrollDown();
    return node;
  }

  function renderCard(project) {
    const node = document.createElement('div');
    node.className = 'msg-card';
    node.innerHTML = `
      <img src="assets/img/${project.img}-560.webp" width="560" height="420" alt="${esc(project.name)}" loading="lazy">
      <div class="msg-card__body">
        <h4>${esc(project.name)}</h4>
        <p>${esc(project.location[chat.lang])} · ${esc(project.status[chat.lang])}</p>
        <p><strong>${window.SALMAN.money(project.priceFrom)}</strong> · ${esc(project.beds)} ${esc(t('ui.beds'))} · ${esc(project.area)}</p>
        <button type="button" data-chat-project="${project.id}">${esc(t('chat.cardCta'))} →</button>
      </div>`;
    el.messages.appendChild(node);
    scrollDown();
  }

  function renderChips(ids = []) {
    chat.chips = ids.filter(Boolean).slice(0, 6);
    el.chips.innerHTML = chat.chips.map((id) => {
      const label = t(`chips.${id}`) !== `chips.${id}` ? t(`chips.${id}`) : projectName(id);
      return `<button type="button" class="chip" data-chip="${esc(id)}">${esc(label)}</button>`;
    }).join('');
    persist();
  }

  function setTyping(on) {
    if (!el.typing) return;
    el.typing.hidden = !on;
    if (el.status) el.status.textContent = on ? t('chat.typing').replace('…', '') : t('chat.online');
    if (on) scrollDown();
  }

  /* ------------------------------ motor de respuestas ------------------------------ */
  function scoreEntry(entry, text) {
    let score = 0;
    let weight = 0;
    for (const raw of entry.keys || []) {
      const key = normalize(raw);
      if (!key) continue;
      if (key.includes(' ')) {
        if (text.includes(key)) { score += 3; weight += key.length; }
      } else {
        const safe = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(^|\\s)${safe}(?=\\s|$)`);
        if (re.test(text)) { score += 2; weight += key.length; }
      }
    }
    return { score, weight };
  }

  function findEntry(text) {
    let best = null;
    let bestScore = 0;
    let bestWeight = 0;
    for (const entry of KB) {
      if (entry.id === 'fallback') continue;
      const { score, weight } = scoreEntry(entry, text);
      if (score > bestScore || (score === bestScore && score > 0 && weight > bestWeight)) {
        best = entry;
        bestScore = score;
        bestWeight = weight;
      }
    }
    return bestScore >= 2 ? best : KB_BY_ID.fallback;
  }

  function projectReply(project, opts = {}) {
    chat.lastProject = project.id;
    const intro = chat.lang === 'es'
      ? `${project.name} está en ${project.location.es}. ${project.hook.es}`
      : `${project.name} is in ${project.location.en}. ${project.hook.en}`;
    const facts = chat.lang === 'es'
      ? `${project.beds} alcobas · ${project.area} · entrega ${project.delivery.es} · desde ${window.SALMAN.money(project.priceFrom)}. Estado: ${project.status.es.toLowerCase()}.`
      : `${project.beds} bedrooms · ${project.area} · delivery ${project.delivery.en} · from ${window.SALMAN.money(project.priceFrom)}. Status: ${project.status.en.toLowerCase()}.`;
    replyRaw(`${intro} ${facts}`, {
      ...opts,
      card: project,
      chips: ['price', 'payment', 'visit', 'brochure']
    });
  }

  function replyRaw(text, opts = {}) {
    setTyping(true);
    const delay = opts.fast ? 380 : 520 + Math.random() * 420;
    window.setTimeout(() => {
      setTyping(false);
      const node = addBot(text, { speak: opts.speak });
      if (opts.cta && node) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'msg__cta';
        btn.dataset.chatAction = opts.cta.action;
        btn.innerHTML = `${esc(opts.cta.label)} <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>`;
        node.appendChild(btn);
      }
      if (opts.card) renderCard(opts.card);
      if (opts.chips) renderChips(opts.chips);
      if (opts.after) opts.after();
      if (opts.onReply) opts.onReply(text);
      scrollDown();
    }, delay);
  }

  function reply(entry, opts = {}) {
    if (!entry) return;
    track('chat_intent', { intent: entry.id });
    const text = entry[chat.lang] || entry.es;
    replyRaw(text, {
      ...opts,
      chips: entry.chips,
      after: entry.action === 'lead' ? () => window.setTimeout(showLeadForm, 500) : undefined
    });
    if (entry.action === 'open_project:marina') chat.lastProject = 'marina';
  }

  function replyById(id, opts = {}) {
    if (id === 'whatsapp') return handoffPrompt(opts);
    if (id === 'lead') return showLeadForm(opts);
    if (id === 'booking') {
      replyRaw(chat.lang === 'es'
        ? 'Puedes elegir fecha y hora en la sección de contacto. Te confirmo por WhatsApp y te envío la ubicación de la sala de ventas. ¿Quieres que abra el calendario?'
        : 'You can pick a date and time in the contact section. I’ll confirm on WhatsApp and send you the sales gallery location. Shall I open the calendar?', {
        ...opts,
        cta: { action: 'scroll:#agenda', label: t('chips.booking') },
        chips: ['advisor', 'brochure', 'projects']
      });
      return;
    }
    if (id === 'calculator') {
      replyRaw(chat.lang === 'es'
        ? 'La calculadora de esta página estima la cuota con amortización francesa. Ajusta valor, cuota inicial, plazo y tasa; si quieres, un asesor te estructura el plan real con las condiciones de Lista Cero.'
        : 'The calculator on this page estimates the payment using French amortisation. Adjust price, down payment, term and rate; an advisor can structure the real plan with Lista Cero terms.', {
        ...opts,
        cta: { action: 'scroll:#inversion', label: chat.lang === 'es' ? 'Ir a la calculadora' : 'Go to calculator' },
        chips: ['payment', 'advisor', 'brochure']
      });
      return;
    }
    if (id === 'portfolio' || id === 'projects') return reply(KB_BY_ID.projects, opts);
    const project = PROJECTS.find((p) => p.id === id);
    if (project) return projectReply(project, opts);
    const entry = KB_BY_ID[id];
    if (entry) return reply(entry, opts);
    return reply(KB_BY_ID.fallback, opts);
  }

  async function route(text, opts = {}) {
    const norm = normalize(text);
    if (!norm) return;
    if (/\b(hola|hello|hi|buenas)\b/.test(norm) && chat.history.length <= 1) {
      return reply(KB_BY_ID.greet, opts);
    }

    if (chat.apiEnabled && !opts.local) {
      setTyping(true);
      try {
        const messages = chat.history.slice(-9).map((message) => ({
          role: message.role === 'user' ? 'user' : 'assistant',
          content: message.text
        }));
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages, lang: chat.lang, project: chat.lastProject })
        });
        if (!response.ok) throw new Error(`api_${response.status}`);
        const data = await response.json();
        if (!data.reply) throw new Error('empty_reply');
        setTyping(false);
        addBot(data.reply, { speak: opts.speak });
        renderChips(['visit', 'brochure', 'advisor', 'projects']);
        track('chat_ai_reply', { model: data.model || '' });
        if (opts.onReply) opts.onReply(data.reply);
        return;
      } catch (error) {
        chat.apiEnabled = false;
        setTyping(false);
        track('chat_api_fallback', { reason: String(error.message || error).slice(0, 60) });
      }
    }

    const entry = findEntry(norm);
    return reply(entry, opts);
  }

  /* ------------------------------ formulario de lead ------------------------------ */
  function showLeadForm(opts = {}) {
    if ($('.msg-form:not(.is-done)')) return;
    const wrap = document.createElement('div');
    wrap.className = 'msg msg--bot msg-form';
    wrap.innerHTML = `
      <p><strong>${esc(t('chat.leadTitle'))}</strong><br>${esc(t('chat.leadIntro'))}</p>
      <input type="text" name="name" autocomplete="name" placeholder="${esc(t('chat.formName'))}" aria-label="${esc(t('chat.formName'))}">
      <input type="tel" name="phone" inputmode="tel" autocomplete="tel" placeholder="${esc(t('chat.formWhats'))}" aria-label="${esc(t('chat.formWhats'))}">
      <label><input type="checkbox" name="consent"> <span>${esc(t('chat.formConsent'))}</span></label>
      <button type="submit">${esc(t('chat.send'))}</button>
      <p class="form-status" role="status"></p>`;
    el.messages.appendChild(wrap);
    scrollDown();
    const submit = wrap.querySelector('button[type="submit"]');
    submit.addEventListener('click', (event) => {
      event.preventDefault();
      const name = wrap.querySelector('input[name="name"]').value.trim();
      const phone = wrap.querySelector('input[name="phone"]').value.trim();
      const consent = wrap.querySelector('input[name="consent"]').checked;
      const status = wrap.querySelector('.form-status');
      if (name.length < 2) { status.textContent = t('ui.validation.required'); return; }
      if (phone.replace(/\D/g, '').length < 7) { status.textContent = t('ui.validation.phone'); return; }
      if (!consent) { status.textContent = t('ui.validation.consent'); return; }

      chat.lead = { name, phone, project: chat.lastProject, at: new Date().toISOString() };
      try { sessionStorage.setItem('salman.lead', JSON.stringify(chat.lead)); } catch (err) { /* noop */ }
      track('chat_lead', { project: chat.lastProject });

      wrap.classList.add('is-done');
      wrap.innerHTML = `<p>${esc(tf('chat.sent', { name, phone }))}</p>`;
      addBot(chat.lang === 'es'
        ? 'Un asesor humano te escribirá en horario de atención. Si prefieres acelerar, puedes abrir WhatsApp con el resumen de esta conversación.'
        : 'A human advisor will message you during business hours. If you want to speed things up, open WhatsApp with a summary of this conversation.', {
        cta: { action: 'handoff', label: t('chat.handoff') },
        speak: false
      });
      persist();
    });
    wrap.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', () => {
        const status = wrap.querySelector('.form-status');
        if (status) status.textContent = '';
      });
    });
    wrap.querySelector('input[name="name"]')?.focus();
  }

  function handoffPrompt(opts = {}) {
    replyRaw(chat.lang === 'es'
      ? 'Puedo abrir WhatsApp con el resumen de lo que hemos hablado para que no repitas nada. Un asesor humano continúa desde ahí.'
      : 'I can open WhatsApp with a summary of what we discussed so you don’t repeat anything. A human advisor takes over from there.', {
      ...opts,
      cta: { action: 'handoff', label: t('chat.handoff') },
      chips: ['lead', 'booking', 'projects']
    });
  }

  function openHandoff() {
    const recent = chat.history.filter((m) => m.role !== 'bot' || m.text.length < 220).slice(-6);
    const summary = recent.map((m) => `${m.role === 'user' ? '•' : '·'} ${m.text.replace(/\s+/g, ' ').slice(0, 180)}`).join('\n');
    const msg = tf('chat.handoffSummary', { summary });
    track('chat_handoff', { project: chat.lastProject });
    const url = `${WA}?text=${encodeURIComponent(msg)}`;
    const win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url;
    if (window.innerWidth < 760) close();
  }

  /* ------------------------------ voz ------------------------------ */
  function pickVoice() {
    if (!synth) return null;
    const voices = synth.getVoices();
    const lang = chat.lang === 'es' ? 'es' : 'en';
    const pool = voices.filter((v) => v.lang.toLowerCase().startsWith(lang));
    const preferred = pool.find((v) => /google|mónica|monica|paulina|helena|sabina|female|mujer/i.test(v.name))
      || pool.find((v) => /es-(co|mx|us)|en-us/i.test(v.lang))
      || pool[0];
    return preferred || null;
  }

  function speak(text) {
    if (!synth || chat.muted) return;
    const clean = String(text).replace(/[•*#]/g, '').replace(/\s+/g, ' ').slice(0, 700);
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(clean);
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = LANG_META[chat.lang].tts;
    utterance.rate = 0.98;
    utterance.pitch = 1;
    chat.speaking = true;
    updateVoiceUI();
    utterance.onend = () => { chat.speaking = false; updateVoiceUI(); };
    utterance.onerror = () => { chat.speaking = false; updateVoiceUI(); };
    synth.speak(utterance);
  }

  function stopSpeech() {
    if (synth) synth.cancel();
    chat.speaking = false;
    updateVoiceUI();
  }

  function updateVoiceUI() {
    if (!el.voice) return;
    el.voice.hidden = !chat.voiceOpen;
    el.orb.classList.toggle('is-listening', chat.listening);
    el.orb.classList.toggle('is-speaking', chat.speaking);
    if (!chat.voiceOpen) return;
    if (chat.listening) el.voiceStatus.textContent = t('chat.listening');
    else if (chat.speaking) el.voiceStatus.textContent = t('chat.speaking');
    else if (!el.voiceStatus.textContent.trim()) el.voiceStatus.textContent = t('voice.tap');
    el.voiceListen.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#${chat.listening ? 'i-pause' : 'i-mic'}"></use></svg><span>${chat.listening ? (chat.lang === 'es' ? 'Detener' : 'Stop') : t('voice.speak')}</span>`;
  }

  function startListening() {
    if (!SR) {
      addBot(t('chat.voiceUnsupported'), { speak: false, chips: ['advisor', 'projects'] });
      return;
    }
    if (chat.listening || !chat.voiceOpen) return;
    stopSpeech();
    chat.voiceFinal = '';
    el.voiceTranscript.textContent = '';
    try {
      const recognition = new SR();
      chat.recognition = recognition;
      recognition.lang = LANG_META[chat.lang].speech;
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        chat.listening = true;
        el.voiceStatus.textContent = t('chat.listening');
        updateVoiceUI();
      };
      recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          if (result.isFinal) chat.voiceFinal += `${result[0].transcript} `;
          else interim += result[0].transcript;
        }
        el.voiceTranscript.textContent = (chat.voiceFinal + interim).trim();
      };
      recognition.onerror = (event) => {
        chat.listening = false;
        updateVoiceUI();
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          el.voiceStatus.textContent = t('chat.micDenied');
          track('chat_voice_error', { error: event.error });
        } else if (event.error === 'network') {
          el.voiceStatus.textContent = chat.lang === 'es'
            ? 'El navegador no pudo conectar el servicio de voz. Si abriste el archivo localmente, usa el servidor de demo (HTTPS o localhost).'
            : 'The browser could not reach the speech service. If you opened the file locally, use the demo server (HTTPS or localhost).';
          track('chat_voice_error', { error: event.error });
        }
      };
      recognition.onend = () => {
        chat.listening = false;
        updateVoiceUI();
        if (!chat.voiceOpen) return;
        const text = chat.voiceFinal.trim();
        if (text) {
          addUser(text);
          el.voiceStatus.textContent = t('chat.thinking');
          route(text, { speak: true, fast: true, onReply: (replyText) => {
            if (chat.voiceOpen) {
              el.voiceStatus.textContent = replyText.replace(/\s+/g, ' ').slice(0, 220) + (replyText.length > 220 ? '…' : '');
              el.voiceTranscript.textContent = text;
            }
          } });
        } else {
          el.voiceStatus.textContent = t('voice.tap');
        }
      };
      recognition.start();
      track('chat_voice_start');
    } catch (err) {
      chat.listening = false;
      updateVoiceUI();
      el.voiceStatus.textContent = t('chat.micDenied');
    }
  }

  function stopListening() {
    if (chat.recognition) {
      try { chat.recognition.abort(); } catch (err) { /* noop */ }
    }
    chat.listening = false;
    updateVoiceUI();
  }

  function openVoice() {
    if (!SR) {
      addBot(t('chat.voiceUnsupported'), { speak: false, chips: ['advisor', 'projects'] });
      return;
    }
    chat.voiceOpen = true;
    el.voice.hidden = false;
    el.voiceStatus.textContent = t('voice.tap');
    el.voiceTranscript.textContent = '';
    updateVoiceUI();
    window.setTimeout(startListening, 350);
  }

  function closeVoice() {
    chat.voiceOpen = false;
    stopListening();
    stopSpeech();
    el.voice.hidden = true;
    el.voiceStatus.textContent = t('voice.tap');
    el.voiceTranscript.textContent = '';
    if (chat.open) el.text?.focus();
  }

  /* ------------------------------ panel ------------------------------ */
  function renderConcierge() {
    if (!el.grid) return;
    el.grid.innerHTML = CONCIERGE.filter((area) => !area.help).map((area, i) => `
      <button type="button" class="area-card" data-area="${area.id}">
        <span class="area-card__num">0${i + 1}</span>
        <strong>${esc(area.label[chat.lang])}</strong>
        <span>${esc(area.desc[chat.lang])}</span>
        <svg class="icon" aria-hidden="true"><use href="#i-up-right"></use></svg>
      </button>`).join('');
  }

  function setChatTab(tab) {
    chat.tab = tab === 'concierge' ? 'concierge' : 'salma';
    const isConcierge = chat.tab === 'concierge';
    if (el.body) el.body.hidden = isConcierge;
    if (el.chips) el.chips.hidden = isConcierge;
    if (el.form) el.form.hidden = isConcierge;
    if (el.legal) el.legal.hidden = isConcierge;
    if (el.concierge) el.concierge.hidden = !isConcierge;
    if (el.status) el.status.textContent = isConcierge ? t('concierge.status') : t('chat.online');
    el.panel.classList.toggle('is-concierge', isConcierge);
    document.querySelectorAll('.chat-tab[data-chat-tab]').forEach((btn) => {
      const active = btn.dataset.chatTab === chat.tab;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    if (isConcierge) {
      closeVoice();
      renderConcierge();
    } else if (chat.open) {
      el.text?.focus();
    }
    track('chat_tab', { tab: chat.tab });
  }

  function openArea(id) {
    const area = CONCIERGE.find((a) => a.id === id);
    if (!area) return;
    const message = area.msg[chat.lang] || area.msg.es;
    track('concierge_area', { area: id });
    const win = window.open(`${WA}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    if (!win) window.location.href = `${WA}?text=${encodeURIComponent(message)}`;
    if (window.innerWidth < 760) close();
  }

  function openVIP() {
    const code = (el.vipInput?.value || '').trim().toUpperCase();
    const area = CONCIERGE.find((a) => a.id === 'vip');
    const placeholder = chat.lang === 'es' ? 'SOLICITAR-ACCESO-VIP' : 'REQUEST-VIP-ACCESS';
    const message = (area.msg[chat.lang] || area.msg.es).replace('{code}', code || placeholder);
    track('concierge_vip', { has_code: Boolean(code) });
    const win = window.open(`${WA}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    if (!win) window.location.href = `${WA}?text=${encodeURIComponent(message)}`;
    if (window.innerWidth < 760) close();
  }

  function open() {
    if (chat.open) { el.text?.focus(); return; }
    chat.open = true;
    el.panel.hidden = false;
    el.fab.hidden = true;
    el.fab.setAttribute('aria-expanded', 'true');
    el.panel.setAttribute('aria-modal', window.innerWidth < 760 ? 'true' : 'false');
    track('chat_open');
    renderChips(chat.chips.length ? chat.chips : ['projects', 'price', 'visit', 'brochure']);
    scrollDown();
    window.setTimeout(() => {
      if (chat.tab === 'concierge') el.vipInput?.focus();
      else el.text?.focus();
    }, 250);
  }

  function close() {
    chat.open = false;
    el.panel.hidden = true;
    el.fab.hidden = false;
    el.fab.setAttribute('aria-expanded', 'false');
    closeVoice();
    stopListening();
    stopSpeech();
    track('chat_close');
  }

  function toggle() {
    if (chat.open) close(); else open();
  }

  function ask(prompt) {
    open();
    window.setTimeout(() => {
      addUser(prompt);
      route(prompt);
    }, 320);
  }

  function send(text) {
    const value = String(text || '').trim();
    if (!value) return;
    addUser(value);
    el.text.value = '';
    route(value);
  }

  function restore() {
    try {
      const stored = JSON.parse(sessionStorage.getItem('salman.chat.v1') || 'null');
      if (stored && Array.isArray(stored.history) && stored.history.length) {
        chat.history = stored.history;
        chat.chips = stored.chips || [];
        chat.lead = stored.lead || null;
        chat.history.forEach((message) => renderMessage(message));
        renderChips(chat.chips);
        return true;
      }
    } catch (err) { /* noop */ }
    return false;
  }

  function welcome() {
    addBot(t('chat.welcome'), { speak: false });
    renderChips(['projects', 'price', 'visit', 'brochure']);
  }

  function syncLangButtons() {
    document.querySelectorAll('[data-chat-lang]').forEach((btn) => {
      const active = btn.dataset.chatLang === chat.lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  /* ------------------------------ eventos ------------------------------ */
  function bind() {
    document.querySelectorAll('[data-chat-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.chatLang;
        if (lang !== chat.lang && window.SALMAN) window.SALMAN.setLang(lang);
      });
    });

    el.panel.addEventListener('submit', (event) => {
      event.preventDefault();
      send(el.text.value);
    });

    el.text.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        send(el.text.value);
      }
    });

    $('#chatClose')?.addEventListener('click', close);
    $('#chatVoiceBtn')?.addEventListener('click', openVoice);
    document.querySelectorAll('.chat-tab[data-chat-tab]').forEach((btn) => {
      btn.addEventListener('click', () => setChatTab(btn.dataset.chatTab));
    });
    $('.concierge__back')?.addEventListener('click', () => setChatTab('salma'));
    document.getElementById('conciergeHelp')?.addEventListener('click', () => openArea('orientacion'));
    el.grid?.addEventListener('click', (event) => {
      const card = event.target.closest('[data-area]');
      if (!card) return;
      if (card.dataset.area === 'vip') { el.vipInput?.focus(); return; }
      openArea(card.dataset.area);
    });
    el.vipBtn?.addEventListener('click', openVIP);
    el.vipInput?.addEventListener('input', () => {
      el.vipInput.value = el.vipInput.value.toUpperCase();
    });
    el.vipInput?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); openVIP(); }
    });
    $('#voiceClose')?.addEventListener('click', closeVoice);
    $('#voiceKeyboard')?.addEventListener('click', () => { closeVoice(); el.text?.focus(); });
    $('#voiceListen')?.addEventListener('click', () => {
      if (chat.listening) stopListening();
      else if (chat.speaking) { stopSpeech(); startListening(); }
      else startListening();
    });

    $('#chatMute')?.addEventListener('click', () => {
      chat.muted = !chat.muted;
      const btn = $('#chatMute');
      btn?.setAttribute('aria-pressed', String(chat.muted));
      btn?.classList.toggle('is-muted', chat.muted);
      const use = btn?.querySelector('use');
      if (use) use.setAttribute('href', chat.muted ? '#i-volume-off' : '#i-volume');
      if (chat.muted) stopSpeech();
    });

    el.chips.addEventListener('click', (event) => {
      const chip = event.target.closest('[data-chip]');
      if (!chip) return;
      const id = chip.dataset.chip;
      addUser(t(`chips.${id}`) !== `chips.${id}` ? t(`chips.${id}`) : projectName(id));
      replyById(id);
    });

    el.messages.addEventListener('click', (event) => {
      const projectBtn = event.target.closest('[data-chat-project]');
      if (projectBtn) {
        window.SALMAN?.openProject(projectBtn.dataset.chatProject);
        return;
      }
      const actionBtn = event.target.closest('[data-chat-action]');
      if (!actionBtn) return;
      const action = actionBtn.dataset.chatAction;
      if (action === 'handoff') openHandoff();
      if (action === 'lead') showLeadForm();
      if (action === 'scroll:#agenda') {
        document.querySelector('#agenda')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.innerWidth < 760) close();
      }
      if (action === 'scroll:#inversion') {
        document.querySelector('#inversion')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.innerWidth < 760) close();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (document.querySelector('dialog[open]')) return;
      if (chat.voiceOpen) { closeVoice(); return; }
      if (chat.open) close();
    });

    document.addEventListener('salman:lang', (event) => {
      chat.lang = event.detail.lang === 'en' ? 'en' : 'es';
      syncLangButtons();
      if (chat.open) renderChips(chat.chips);
      if (chat.tab === 'concierge') {
        renderConcierge();
        if (el.status) el.status.textContent = t('concierge.status');
      } else if (el.status) {
        el.status.textContent = t('chat.online');
      }
      if (chat.voiceOpen) el.voiceStatus.textContent = t('voice.tap');
      updateVoiceUI();
    });

    if (synth) {
      synth.addEventListener?.('voiceschanged', () => { /* voces cargadas en el próximo speak */ });
    }

    window.addEventListener('resize', () => {
      if (!chat.open) return;
      el.panel.setAttribute('aria-modal', window.innerWidth < 760 ? 'true' : 'false');
    });
  }

  function init() {
    el.panel = $('#chatPanel');
    el.body = $('#chatBody');
    el.messages = $('#chatMessages');
    el.chips = $('#chatChips');
    el.typing = $('#chatTyping');
    el.text = $('#chatText');
    el.fab = $('#chatFab');
    el.status = $('#chatStatus');
    el.voice = $('#voiceMode');
    el.voiceStatus = $('#voiceStatus');
    el.voiceTranscript = $('#voiceTranscript');
    el.voiceListen = $('#voiceListen');
    el.orb = $('#orb');
    el.concierge = $('#chatConcierge');
    el.grid = $('#conciergeGrid');
    el.vipInput = $('#vipCode');
    el.vipBtn = $('#vipBtn');
    el.form = $('#chatForm');
    el.legal = $('.chat-legal');
    if (!el.panel || !el.messages) return;

    chat.lang = window.SALMAN?.lang || 'es';
    bind();
    syncLangButtons();
    const restored = restore();
    if (!restored) welcome();
    persist();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.Salma = { open, close, toggle, ask, send, get isOpen() { return chat.open; } };
})();

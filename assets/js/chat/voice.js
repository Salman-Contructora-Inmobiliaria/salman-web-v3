/* ==========================================================================
   SALMAN — Reconocimiento y síntesis de voz de Salma (chat/voice.js)
   Solución de alta fidelidad con paridad completa Desktop (Windows/Mac) y Mobile.
   Web Speech API (SpeechRecognition + SpeechSynthesis Neural / Natural).
   ========================================================================== */
(() => {
  'use strict';

  const S = (window.SALMAN = window.SALMAN || {});
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = window.speechSynthesis || null;

  const LANG_FALLBACK = {
    es: { speech: 'es-CO', tts: 'es-CO' },
    en: { speech: 'en-US', tts: 'en-US' }
  };
  const getLangMeta = (lang) =>
    (S.LANG_META && S.LANG_META[lang]) ||
    (window.LANG_META && window.LANG_META[lang]) ||
    LANG_FALLBACK[lang] ||
    LANG_FALLBACK.es;

  /* --------------------------------------------------------------------------
     1. Precarga Asíncrona y Cache de Voces Naturales (Desktop & Mobile)
     -------------------------------------------------------------------------- */
  let cachedVoices = [];

  function refreshVoices() {
    if (!synth) return [];
    const list = synth.getVoices() || [];
    if (list.length > 0) {
      cachedVoices = list;
    }
    return cachedVoices;
  }

  refreshVoices();
  if (synth) {
    if (typeof synth.addEventListener === 'function') {
      synth.addEventListener('voiceschanged', refreshVoices);
    }
    synth.onvoiceschanged = refreshVoices;
  }

  /**
   * Selector prioritario de voces neurales y naturales de alta calidad.
   * Prioridad 1: Voces Online / Naturales / Neurales (Edge Natural / Google Cloud).
   * Prioridad 2: Voces Google nativas (Android/Chrome).
   * Prioridad 3: Voces femeninas estándar en español (Sabina, Paulina, Dalia).
   * Descarte: Voces en inglés o sintéticas robóticas si el idioma es español.
   */
  function selectBestVoice(targetLang = 'es') {
    const voices = refreshVoices();
    if (!voices.length) return null;

    const isEs = targetLang.toLowerCase().startsWith('es');
    const langPrefix = isEs ? 'es' : 'en';
    const pool = voices.filter((v) => (v.lang || '').toLowerCase().startsWith(langPrefix));

    const femaleRegex = /salma|dalia|paulina|monica|mónica|camila|sofía|sofia|sabina|helena|elena|paloma|laura|elvira|jimena|karina|lucia|lucía|carmen|valeria|female|mujer/i;
    const maleRegex = /gonzalo|jorge|alvaro|álvaro|carlos|diego|alberto|mateo|manuel|enrique|luis|raul|raúl|fernando|miguel|javier|david|mark|george|alonso|pablo|arnau|ignacio|esteban|tomas|tomás|mario|dario|darío|guillermo|nestor|néstor|gerardo|andres|andrés|emilio|rodrigo|helio|julio|pedro|hector|héctor|male\b|hombre/i;

    const strictlyFemale = pool.filter((v) => femaleRegex.test(v.name) && !maleRegex.test(v.name));
    const nonMalePool = pool.filter((v) => !maleRegex.test(v.name));
    const candidates = strictlyFemale.length > 0 ? strictlyFemale : (nonMalePool.length > 0 ? nonMalePool : pool);

    if (isEs) {
      // Prioridad 1: Microsoft Salma Online (Natural) - Spanish (Colombia)
      const salmaVoice = candidates.find((v) => /salma/i.test(v.name) && /colombia|es-co/i.test(v.name + v.lang));
      if (salmaVoice) return salmaVoice;

      const anySalma = candidates.find((v) => /salma/i.test(v.name));
      if (anySalma) return anySalma;

      // Prioridad 2: Voces Naturales / Neurales Femeninas (Dalia, Paulina, Camila, Mónica, Sofía)
      const naturalFemale = candidates.find((v) =>
        /natural|neural|online/i.test(v.name) &&
        /dalia|paulina|monica|mónica|camila|sofía|sofia|elena|paloma|jimena|female|mujer/i.test(v.name)
      );
      if (naturalFemale) return naturalFemale;

      // Prioridad 3: Google español neural (Android / Chrome Desktop)
      const googleFemale = candidates.find((v) => /google/i.test(v.name) && !maleRegex.test(v.name));
      if (googleFemale) return googleFemale;

      // Prioridad 4: Sabina Desktop (Windows 10/11 offline nativa femenina) u otras estándar femeninas
      const standardFemale = candidates.find((v) => /sabina|paulina|monica|mónica|helena|elena/i.test(v.name));
      if (standardFemale) return standardFemale;

      // Fallback dentro del conjunto femenino o no-masculino
      return candidates[0] || null;
    }

    // Para inglés (en):
    const naturalEnFemale = pool.find((v) => /natural|neural|online/i.test(v.name) && /jenny|aria|female|zira/i.test(v.name)) ||
                           pool.find((v) => /zira|female/i.test(v.name)) ||
                           pool.find((v) => /natural|neural|online/i.test(v.name) && !maleRegex.test(v.name)) ||
                           pool.find((v) => !maleRegex.test(v.name)) ||
                           pool[0];
    return naturalEnFemale || null;
  }

  /* --------------------------------------------------------------------------
     2. Desbloqueo de AudioContext & Autoplay Policy en Chromium Desktop
     -------------------------------------------------------------------------- */
  function unlockAudioPolicy() {
    if (synth && synth.paused) {
      try { synth.resume(); } catch (_) {}
    }
  }

  /* --------------------------------------------------------------------------
     3. Controlador Principal de Voz de Salma
     -------------------------------------------------------------------------- */
  function createVoiceController(ctx) {
    const { chat, el, t, track, addUser, addBot, route } = ctx;

    function updateVoiceUI() {
      if (!el.voice) return;
      el.voice.hidden = !chat.voiceOpen;
      el.orb?.classList.toggle('is-listening', chat.listening);
      el.orb?.classList.toggle('is-speaking', chat.speaking);

      if (!chat.voiceOpen) return;

      if (chat.listening) {
        el.voiceStatus.textContent = t('chat.listening') || 'Escuchando…';
      } else if (chat.speaking) {
        el.voiceStatus.textContent = t('chat.speaking') || 'Salma está hablando…';
      } else if (!el.voiceStatus.textContent.trim()) {
        el.voiceStatus.textContent = t('voice.tap') || 'Toca para hablar';
      }

      if (el.voiceListen) {
        el.voiceListen.innerHTML = `
          <svg class="icon" aria-hidden="true"><use href="#${chat.listening ? 'i-pause' : 'i-mic'}"></use></svg>
          <span>${chat.listening ? (chat.lang === 'es' ? 'Detener' : 'Stop') : (t('voice.speak') || 'Hablar con Salma')}</span>
        `;
      }
    }

    function speak(text) {
      if (!synth || chat.muted) return;
      unlockAudioPolicy();

      const clean = String(text)
        .replace(/[•*#_~`]/g, '')
        .replace(/\s+/g, ' ')
        .slice(0, 800);

      try {
        synth.cancel();
      } catch (_) {}

      const utterance = new SpeechSynthesisUtterance(clean);
      const voice = selectBestVoice(chat.lang);
      if (voice) {
        utterance.voice = voice;
        console.log('[Salma Voice] Voz seleccionada:', voice.name, '| lang:', voice.lang);
      }

      const meta = getLangMeta(chat.lang);
      utterance.lang = meta.tts || (chat.lang === 'es' ? 'es-CO' : 'en-US');
      utterance.rate = 0.98;
      utterance.pitch = 1.05;

      chat.speaking = true;
      updateVoiceUI();

      utterance.onend = () => {
        chat.speaking = false;
        updateVoiceUI();
      };
      utterance.onerror = (e) => {
        console.warn('[Salma Voice TTS]', e.error || e);
        chat.speaking = false;
        updateVoiceUI();
      };

      synth.speak(utterance);
    }

    function stopSpeech() {
      if (synth) {
        try { synth.cancel(); } catch (_) {}
      }
      chat.speaking = false;
      updateVoiceUI();
    }

    /**
     * Asegura la concesión de permisos de micrófono en Windows/Mac antes de iniciar
     * el reconocimiento, evitando que Chromium aborte con "not-allowed" en frío.
     */
    async function requestHardwareMic() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Liberar inmediatamente el canal para que SpeechRecognition tenga uso exclusivo del micrófono
          stream.getTracks().forEach((track) => track.stop());
          return true;
        } catch (permErr) {
          console.warn('[Salma Voice] Permiso de micrófono no concedido en hardware/navegador:', permErr);
          return false;
        }
      }
      return true;
    }

    async function startListening() {
      if (!SR) {
        addBot(t('chat.voiceUnsupported'), { speak: false, chips: ['advisor', 'projects'] });
        return;
      }

      if (chat.listening || !chat.voiceOpen) return;
      stopSpeech();
      unlockAudioPolicy();

      chat.voiceFinal = '';
      if (el.voiceTranscript) el.voiceTranscript.textContent = '';

      // Verificar y forzar el popup de permiso en Chromium Desktop
      const micGranted = await requestHardwareMic();
      if (!micGranted) {
        chat.listening = false;
        updateVoiceUI();
        if (el.voiceStatus) {
          el.voiceStatus.textContent = t('chat.micDenied') || 'Permiso de micrófono denegado. Revisa el candado en tu navegador.';
        }
        return;
      }

      try {
        const recognition = new SR();
        chat.recognition = recognition;
        const meta = getLangMeta(chat.lang);
        recognition.lang = meta.speech || (chat.lang === 'es' ? 'es-CO' : 'en-US');
        recognition.interimResults = true;
        recognition.continuous = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          chat.listening = true;
          if (el.voiceStatus) el.voiceStatus.textContent = t('chat.listening') || 'Escuchando…';
          updateVoiceUI();
        };

        recognition.onresult = (event) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; i += 1) {
            const result = event.results[i];
            if (result.isFinal) {
              chat.voiceFinal += `${result[0].transcript} `;
            } else {
              interim += result[0].transcript;
            }
          }
          if (el.voiceTranscript) {
            el.voiceTranscript.textContent = (chat.voiceFinal + interim).trim();
          }
        };

        recognition.onerror = (event) => {
          chat.listening = false;
          updateVoiceUI();

          const errCode = event.error || 'unknown';
          console.warn('[Salma Voice STT Error]:', errCode);

          if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
            if (el.voiceStatus) el.voiceStatus.textContent = t('chat.micDenied');
            track('chat_voice_error', { error: errCode });
          } else if (errCode === 'network') {
            if (el.voiceStatus) {
              el.voiceStatus.textContent = chat.lang === 'es'
                ? 'Conexión con el servicio de voz interrumpida. Intenta nuevamente.'
                : 'Speech service connection interrupted. Please try again.';
            }
            track('chat_voice_error', { error: errCode });
          } else if (errCode === 'no-speech') {
            if (el.voiceStatus) {
              el.voiceStatus.textContent = chat.lang === 'es'
                ? 'No escuché tu voz. Haz clic para intentar de nuevo.'
                : 'I did not catch that. Click to try again.';
            }
          }
        };

        recognition.onend = () => {
          chat.listening = false;
          updateVoiceUI();
          if (!chat.voiceOpen) return;

          const text = (chat.voiceFinal || '').trim();
          if (text) {
            addUser(text);
            if (el.voiceStatus) el.voiceStatus.textContent = t('chat.thinking') || 'Pensando…';

            route(text, {
              speak: true,
              fast: true,
              onReply: (replyText) => {
                if (chat.voiceOpen && el.voiceStatus) {
                  el.voiceStatus.textContent =
                    replyText.replace(/\s+/g, ' ').slice(0, 220) + (replyText.length > 220 ? '…' : '');
                  if (el.voiceTranscript) el.voiceTranscript.textContent = text;
                }
              }
            });
          } else {
            if (el.voiceStatus && !el.voiceStatus.textContent.includes('No escuché')) {
              el.voiceStatus.textContent = t('voice.tap') || 'Toca para hablar';
            }
          }
        };

        recognition.start();
        track('chat_voice_start');
      } catch (err) {
        console.error('[Salma Voice Start Error]:', err);
        chat.listening = false;
        updateVoiceUI();
        if (el.voiceStatus) el.voiceStatus.textContent = t('chat.micDenied');
      }
    }

    function stopListening() {
      if (chat.recognition) {
        try { chat.recognition.abort(); } catch (_) {}
      }
      chat.listening = false;
      updateVoiceUI();
    }

    function openVoice() {
      if (!SR) {
        addBot(t('chat.voiceUnsupported'), { speak: false, chips: ['advisor', 'projects'] });
        return;
      }
      unlockAudioPolicy();
      refreshVoices();

      chat.voiceOpen = true;
      if (el.voice) el.voice.hidden = false;
      if (el.voiceStatus) el.voiceStatus.textContent = t('voice.tap') || 'Toca para hablar';
      if (el.voiceTranscript) el.voiceTranscript.textContent = '';
      updateVoiceUI();

      window.setTimeout(startListening, 300);
    }

    function closeVoice() {
      chat.voiceOpen = false;
      stopListening();
      stopSpeech();
      if (el.voice) el.voice.hidden = true;
      if (el.voiceStatus) el.voiceStatus.textContent = t('voice.tap');
      if (el.voiceTranscript) el.voiceTranscript.textContent = '';
      if (chat.open && el.text) el.text.focus();
    }

    return {
      speak,
      stopSpeech,
      updateVoiceUI,
      startListening,
      stopListening,
      openVoice,
      closeVoice,
      selectBestVoice
    };
  }

  S.createVoiceController = createVoiceController;
  S.selectBestVoice = selectBestVoice;
})();

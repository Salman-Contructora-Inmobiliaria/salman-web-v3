/* ==========================================================================
   SALMAN — Reconocimiento y síntesis de voz de Salma (chat/voice.js)
   Web Speech API (SpeechRecognition + speechSynthesis) en ES/EN.
   ========================================================================== */
(() => {
  'use strict';

  const S = (window.SALMAN = window.SALMAN || {});
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = window.speechSynthesis || null;

  function createVoiceController(ctx) {
    const { chat, el, t, track, addUser, addBot, route } = ctx;

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

    function updateVoiceUI() {
      if (!el.voice) return;
      el.voice.hidden = !chat.voiceOpen;
      el.orb?.classList.toggle('is-listening', chat.listening);
      el.orb?.classList.toggle('is-speaking', chat.speaking);
      if (!chat.voiceOpen) return;
      if (chat.listening) el.voiceStatus.textContent = t('chat.listening');
      else if (chat.speaking) el.voiceStatus.textContent = t('chat.speaking');
      else if (!el.voiceStatus.textContent.trim()) el.voiceStatus.textContent = t('voice.tap');
      if (el.voiceListen) {
        el.voiceListen.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#${chat.listening ? 'i-pause' : 'i-mic'}"></use></svg><span>${chat.listening ? (chat.lang === 'es' ? 'Detener' : 'Stop') : t('voice.speak')}</span>`;
      }
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
            route(text, {
              speak: true,
              fast: true,
              onReply: (replyText) => {
                if (chat.voiceOpen) {
                  el.voiceStatus.textContent = replyText.replace(/\s+/g, ' ').slice(0, 220) + (replyText.length > 220 ? '…' : '');
                  el.voiceTranscript.textContent = text;
                }
              }
            });
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
      if (el.voice) el.voice.hidden = true;
      if (el.voiceStatus) el.voiceStatus.textContent = t('voice.tap');
      if (el.voiceTranscript) el.voiceTranscript.textContent = '';
      if (chat.open) el.text?.focus();
    }

    if (synth) {
      synth.addEventListener?.('voiceschanged', () => { /* voces cargadas en el próximo speak */ });
    }

    return {
      speak,
      stopSpeech,
      updateVoiceUI,
      startListening,
      stopListening,
      openVoice,
      closeVoice
    };
  }

  S.createVoiceController = createVoiceController;
})();

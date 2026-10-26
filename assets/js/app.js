/* ==========================================================================
   SALMAN — lógica de la página
   Render de proyectos, servicios y FAQ · idioma · calculadora · agenda ·
   modales · animaciones · analítica (dataLayer)
   ========================================================================== */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const WA = `https://wa.me/${CONFIG.whatsapp}`;

  const state = {
    lang: localStorage.getItem('salman.lang') === 'en' ? 'en' : 'es',
    filter: 'all',
    lead: { action: 'general', project: 'marina' }
  };

  /* ------------------------------ utilidades ------------------------------ */
  const t = (key) => (TEXT[state.lang] && TEXT[state.lang][key]) ?? TEXT.es[key] ?? key;
  const tf = (key, vars = {}) => t(key).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
  const esc = (str) => String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (n) => new Intl.NumberFormat(state.lang === 'es' ? 'es-CO' : 'en-US').format(n);
  const money = (millions) => `$${num(millions)}${state.lang === 'es' ? ' M' : 'M'}`;
  const projectById = (id) => PROJECTS.find((p) => p.id === id) || PROJECTS[0];
  const projectName = (id) => {
    const p = projectById(id);
    return p ? p.name : '';
  };
  const track = (event, params = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, lang: state.lang, ...params });
    if (window.console && console.debug) console.debug('[dataLayer]', event, params);
  };

  /* ------------------------------ render ------------------------------ */
  function renderProjects() {
    const grid = $('#projectsGrid');
    if (!grid) return;
    grid.innerHTML = PROJECTS.map((p) => {
      const badgeClass = p.statusKey === 'building' ? '' : ' project-card__badge--gold';
      return `
      <article class="project-card" data-type="${p.type}" data-id="${p.id}">
        <div class="project-card__media">
          <img src="assets/img/${p.img}-900.webp" srcset="assets/img/${p.img}-560.webp 560w, assets/img/${p.img}-900.webp 900w"
               sizes="(max-width:760px) 100vw, 46vw" width="900" height="600" loading="lazy" decoding="async"
               alt="${esc(p.name)} — ${esc(p.location[state.lang])}">
          <span class="project-card__badge${badgeClass}">${esc(p.status[state.lang])}</span>
          <span class="project-card__arrow" aria-hidden="true">
            <svg class="icon"><use href="#i-up-right"></use></svg>
          </span>
        </div>
        <div class="project-card__body">
          <span class="project-card__loc">${esc(p.location[state.lang])}</span>
          <h3 class="project-card__name">${esc(p.name)}</h3>
          <div class="project-card__meta">
            <span>${esc(p.beds)} ${esc(t('ui.beds'))}</span>
            <span>${esc(p.area)}</span>
            <span>${esc(t('ui.delivery'))} ${esc(p.delivery[state.lang])}</span>
          </div>
          <p class="project-card__price"><small>${esc(t('ui.from'))} · COP</small>${money(p.priceFrom)}</p>
        </div>
        <a class="project-card__link" href="#proyecto" data-project-open="${p.id}"
           aria-label="${esc(t('ui.view'))}: ${esc(p.name)}"></a>
      </article>`;
    }).join('');
    applyFilter(state.filter, false);
  }

  function renderServices() {
    const wrap = $('#servicesGrid');
    if (!wrap) return;
    wrap.innerHTML = SERVICES.map((group, gi) => `
      <section class="service-group" aria-labelledby="svc-${gi}">
        <div class="service-group__head">
          <span>0${gi + 1}</span>
          <h3 id="svc-${gi}">${esc(group.group[state.lang])}</h3>
        </div>
        <p class="service-group__intro">${esc(group.intro[state.lang])}</p>
        <ul>
          ${group.items.map((item, i) => `
            <li class="service-item">
              <span class="service-item__num">0${i + 1}</span>
              <div>
                <h4>${esc(item.t[state.lang])}</h4>
                <p>${esc(item.d[state.lang])}</p>
              </div>
            </li>`).join('')}
        </ul>
      </section>`).join('');
  }

  function renderFAQ() {
    const list = $('#faqList');
    if (!list) return;
    list.innerHTML = FAQ.map((item, i) => `
      <div class="faq__item">
        <button class="faq__q" type="button" aria-expanded="false" aria-controls="faq-a-${i}">
          <span>${esc(item.q[state.lang])}</span>
          <svg class="icon" aria-hidden="true"><use href="#i-chevron"></use></svg>
        </button>
        <div class="faq__a" id="faq-a-${i}" role="region">
          <div><p>${esc(item.a[state.lang])}</p></div>
        </div>
      </div>`).join('');
  }

  function applyFilter(filter, doTrack = true) {
    state.filter = filter;
    let visible = 0;
    $$('.project-card').forEach((card) => {
      const show = filter === 'all' || card.dataset.type === filter;
      card.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });
    $$('.filter').forEach((btn) => {
      const active = btn.dataset.filter === filter;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    const count = $('#projectsCount');
    if (count) count.textContent = tf('ui.projectsCount', { n: visible });
    if (doTrack) track('filter_projects', { filter });
  }

  /* ------------------------------ galería ------------------------------ */
  const galleryState = { index: 0, images: ['marina', 'lobby', 'playa'] };

  function setGallery(img, index) {
    const main = $('#flagshipImage');
    if (!main) return;
    galleryState.index = index;
    main.classList.add('is-swapping');
    setTimeout(() => {
      main.src = `assets/img/${img}-900.webp`;
      main.srcset = `assets/img/${img}-560.webp 560w, assets/img/${img}-900.webp 900w`;
      main.alt = index === 0
        ? 'Marina privada de Marina Cangrejo Azul al atardecer'
        : index === 1 ? 'Lobby y área social de Marina Cangrejo Azul'
        : 'Club de playa de Marina Cangrejo Azul';
      main.classList.remove('is-swapping');
    }, 180);
    $$('.gallery__thumb').forEach((thumb) => {
      const active = Number(thumb.dataset.index) === index;
      thumb.classList.toggle('is-active', active);
      thumb.setAttribute('aria-selected', String(active));
    });
    const idx = $('#galleryIndex');
    if (idx) idx.textContent = `0${index}`;
  }

  /* ------------------------------ calculadora ------------------------------ */
  function updateCalc() {
    const price = Number($('#calcValue')?.value || 1180);
    const down = Number($('#calcDown')?.value || 20);
    const years = Number($('#calcYears')?.value || 20);
    const rate = Number($('#calcRate')?.value || 10.5);
    const financed = price * (1 - down / 100);
    const monthlyRate = rate / 100 / 12;
    const n = years * 12;
    const monthly = monthlyRate > 0
      ? (financed * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n))
      : financed / n;

    const set = (id, value) => { const el = $(id); if (el) el.textContent = value; };
    set('#calcValueOut', money(price));
    set('#calcDownOut', `${down}%`);
    set('#calcYearsOut', `${years} ${t('calc.yearsUnit')}`);
    set('#calcRateOut', `${num(rate.toFixed(1))}%`);
    set('#calcMonthly', `$${num(monthly.toFixed(1))} M`);
    set('#calcFinanced', `$${num(Math.round(financed))} M`);
  }

  /* ------------------------------ modales ------------------------------ */
  function openDialog(dialog) {
    if (!dialog || dialog.open) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.body.classList.add('is-locked');
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('is-locked');
  }

  function openProject(id) {
    const p = projectById(id);
    if (!p) return;
    const modal = $('#projectModal');
    const content = $('#projectModalContent');
    content.innerHTML = `
      <div class="modal__media">
        <img src="assets/img/${p.img}-900.webp" width="900" height="670" alt="${esc(p.name)} — ${esc(p.location[state.lang])}">
      </div>
      <div class="modal__body">
        <p class="kicker">${esc(p.typeLabel[state.lang])}</p>
        <h2 id="projectModalTitle">${esc(p.name)}</h2>
        <p class="modal__loc">${esc(p.location[state.lang])} · ${esc(p.status[state.lang])}</p>
        <p class="modal__desc">${esc(p.desc[state.lang])}</p>
        <dl class="modal__specs">
          <div><dt>${esc(t('flagship.spec1'))}</dt><dd>${esc(p.beds)} ${esc(t('ui.beds'))}</dd></div>
          <div><dt>${esc(t('flagship.spec2'))}</dt><dd>${esc(p.area)}</dd></div>
          <div><dt>${esc(t('flagship.spec3'))}</dt><dd>${esc(p.delivery[state.lang])}</dd></div>
          <div><dt>${esc(t('flagship.spec4'))}</dt><dd>${money(p.priceFrom)}</dd></div>
          <div><dt>${esc(t('flagship.spec6'))}</dt><dd>${p.available} / ${p.total}</dd></div>
          <div><dt>${esc(t('ui.sold'))}</dt><dd>${Math.round(p.soldPct)}%</dd></div>
        </dl>
        <h3 class="modal__h3">${esc(t('ui.modal.amenities'))}</h3>
        <p class="modal__text">${esc(p.amenities[state.lang].join(' · '))}</p>
        <h3 class="modal__h3">${esc(t('ui.modal.payment'))}</h3>
        <p class="modal__text">${esc(p.payment[state.lang])}</p>
        <button class="btn btn--dark" type="button" data-lead="brochure" data-project="${p.id}">
          ${esc(t('ui.modal.brochure'))}
          <svg class="icon" aria-hidden="true"><use href="#i-download"></use></svg>
        </button>
        <button class="btn btn--outline" type="button" data-scroll="#agenda">
          ${esc(t('ui.modal.cta'))}
          <svg class="icon" aria-hidden="true"><use href="#i-calendar"></use></svg>
        </button>
        <div class="modal__gallery">
          ${p.gallery.map((img) => `<img src="assets/img/${img}-560.webp" width="560" height="420" alt="${esc(p.name)}" loading="lazy">`).join('')}
        </div>
        <p class="modal__note">${esc(t('ui.modal.note'))}</p>
      </div>`;
    openDialog(modal);
    track('view_project', { project: p.id });
  }

  function openLead(action, projectId) {
    state.lead = { action: action || 'general', project: projectId || 'marina' };
    const titles = {
      brochure: ['ui.lead.brochureTitle', 'ui.lead.brochureSub'],
      plan: ['ui.lead.planTitle', 'ui.lead.planSub'],
      price: ['ui.lead.priceTitle', 'ui.lead.priceSub']
    };
    const [titleKey, subKey] = titles[action] || ['ui.lead.titleGeneric', 'ui.lead.subGeneric'];
    const title = $('#leadModalTitle');
    const sub = $('#leadModalSub');
    if (title) title.textContent = t(titleKey);
    if (sub) sub.textContent = t(subKey);
    const modal = $('#leadModal');
    openDialog(modal);
    track('lead_start', { action: state.lead.action, project: state.lead.project });
    setTimeout(() => $('#leadName')?.focus(), 120);
  }

  function clearErrors(form) {
    $$('.field.has-error', form).forEach((f) => f.classList.remove('has-error'));
    const status = $('.form-status', form);
    if (status) { status.textContent = ''; status.className = 'form-status'; }
  }

  function fieldError(input, message) {
    const field = input.closest('.field');
    if (field) field.classList.add('has-error');
    return message;
  }

  function validateCommon(form) {
    clearErrors(form);
    const inputs = $$('input[required], select[required]', form);
    for (const input of inputs) {
      if (input.type === 'checkbox' && !input.checked) {
        return { ok: false, message: fieldError(input, t('ui.validation.consent')) };
      }
      if (input.type !== 'checkbox' && !input.value.trim()) {
        return { ok: false, message: fieldError(input, t('ui.validation.required')) };
      }
    }
    const email = $('input[type="email"]', form);
    if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      return { ok: false, message: fieldError(email, t('ui.validation.email')) };
    }
    const phone = $('input[type="tel"]', form);
    if (phone && phone.value.replace(/\D/g, '').length < 7) {
      return { ok: false, message: fieldError(phone, t('ui.validation.phone')) };
    }
    return { ok: true };
  }

  function openWhatsApp(message) {
    const url = `${WA}?text=${encodeURIComponent(message)}`;
    track('whatsapp_click', { source: 'form' });
    const win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url;
    showToast(t('toast.opening'));
  }

  /* ------------------------------ formularios ------------------------------ */
  function initBooking() {
    const form = $('#bookingForm');
    if (!form) return;
    const date = $('#bookDate');
    if (date) {
      const today = new Date();
      const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      date.min = iso;
      const tomorrow = new Date(today.getTime() + 86400000);
      date.value = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    }
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const check = validateCommon(form);
      const status = $('#bookingStatus');
      if (!check.ok) {
        if (status) { status.textContent = check.message; status.className = 'form-status is-error'; }
        return;
      }
      const projectId = $('#bookProject').value;
      const msg = tf('whatsapp.booking', {
        project: projectId === 'general' ? t('booking.general') : projectName(projectId),
        date: $('#bookDate').value,
        time: $('#bookTime').value,
        name: $('#bookName').value.trim(),
        email: $('#bookEmail').value.trim()
      });
      openWhatsApp(msg);
      track('booking_submit', { project: projectId });
      if (status) {
        status.textContent = state.lang === 'es'
          ? 'Listo. Se abrió WhatsApp con tu solicitud; un asesor confirmará el horario.'
          : 'Done. WhatsApp opened with your request; an advisor will confirm the time.';
        status.className = 'form-status is-ok';
      }
    });
    form.addEventListener('input', (event) => {
      if (event.target.closest('.field')) event.target.closest('.field').classList.remove('has-error');
    });
  }

  function initLeadForm() {
    const form = $('#leadForm');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const check = validateCommon(form);
      const status = $('#leadStatus');
      if (!check.ok) {
        if (status) { status.textContent = check.message; status.className = 'form-status is-error'; }
        return;
      }
      const name = $('#leadName').value.trim();
      const project = projectName(state.lead.project);
      let msg;
      if (state.lead.action === 'plan') {
        msg = tf('whatsapp.plan', { project, name });
      } else if (state.lead.action === 'price') {
        msg = state.lang === 'es'
          ? `Hola SALMAN, quiero recibir la lista de precios de ${project}. Mi nombre es ${name}.`
          : `Hi SALMAN, I'd like the price list for ${project}. My name is ${name}.`;
      } else {
        msg = tf('whatsapp.brochure', { project, name });
      }
      openWhatsApp(msg);
      track('lead_submit', { action: state.lead.action, project: state.lead.project });
      if (status) {
        status.textContent = state.lang === 'es' ? 'Listo. Te escribimos por WhatsApp.' : 'Done. We’ll message you on WhatsApp.';
        status.className = 'form-status is-ok';
      }
      setTimeout(() => {
        closeDialog($('#leadModal'));
        form.reset();
        if (status) { status.textContent = ''; status.className = 'form-status'; }
      }, 1400);
    });
    form.addEventListener('input', (event) => {
      if (event.target.closest('.field')) event.target.closest('.field').classList.remove('has-error');
    });
  }

  /* ------------------------------ idioma ------------------------------ */
  function applyLanguage(lang) {
    state.lang = lang === 'en' ? 'en' : 'es';
    localStorage.setItem('salman.lang', state.lang);
    document.documentElement.lang = LANG_META[state.lang].html;

    $$('[data-i18n]').forEach((el) => {
      const value = t(el.dataset.i18n);
      if (value !== undefined) el.innerHTML = value;
    });
    $$('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
    $$('[data-lang]').forEach((btn) => {
      const active = btn.dataset.lang === state.lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    renderProjects();
    renderServices();
    renderFAQ();
    updateCalc();
    closeDialog($('#projectModal'));
    const leadOpen = $('#leadModal')?.hasAttribute('open');
    if (leadOpen) {
      const titles = { brochure: 'ui.lead.brochureTitle', plan: 'ui.lead.planTitle', price: 'ui.lead.priceTitle' };
      const key = titles[state.lead.action] || 'ui.lead.titleGeneric';
      if ($('#leadModalTitle')) $('#leadModalTitle').textContent = t(key);
    }
    document.dispatchEvent(new CustomEvent('salman:lang', { detail: { lang: state.lang } }));
    track('change_language', { lang: state.lang });
  }

  /* ------------------------------ UI global ------------------------------ */
  function initHeader() {
    const header = $('#siteHeader');
    const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('load', onScroll);
    window.addEventListener('hashchange', () => window.setTimeout(onScroll, 60));
    window.setTimeout(onScroll, 120);

    const menu = $('#mobileMenu');
    const btn = $('#menuBtn');
    const setMenu = (open) => {
      if (!menu || !btn) return;
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('is-locked', open);
      btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    };
    btn?.addEventListener('click', () => setMenu(menu.hidden));
    $$('a', menu || document.createElement('div')).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu && !menu.hidden) setMenu(false);
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 1180 && menu && !menu.hidden) setMenu(false); });
  }

  function initReveal() {
    document.documentElement.classList.add('reveal-init');
    const items = $$('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach((el) => observer.observe(el));
  }

  function initProgress() {
    setTimeout(() => {
      $$('[data-progress]').forEach((el) => {
        const span = el.querySelector('span');
        if (span) span.style.width = `${Math.max(0, Math.min(100, Number(el.dataset.progress)))}%`;
      });
    }, 350);
  }

  function initDials() {
    $$('dialog').forEach((dialog) => {
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) closeDialog(dialog);
      });
      dialog.addEventListener('close', () => {
        if (!document.querySelector('dialog[open]')) document.body.classList.remove('is-locked');
      });
    });
  }

  let toastTimer;
  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => { toast.hidden = true; }, 320);
    }, 3200);
  }

  /* ------------------------------ eventos ------------------------------ */
  function initDelegates() {
    document.addEventListener('click', (event) => {
      const target = event.target;

      const closeBtn = target.closest('[data-close-dialog]');
      if (closeBtn) { closeDialog(closeBtn.closest('dialog')); return; }

      const projectBtn = target.closest('[data-project-open]');
      if (projectBtn) {
        event.preventDefault();
        openProject(projectBtn.dataset.projectOpen);
        return;
      }

        const leadBtn = target.closest('[data-lead]');
      if (leadBtn) {
        event.preventDefault();
        if ($('#projectModal')?.hasAttribute('open')) closeDialog($('#projectModal'));
        openLead(leadBtn.dataset.lead, leadBtn.dataset.project);
        return;
      }

      const scrollBtn = target.closest('[data-scroll]');
      if (scrollBtn) {
        const targetEl = $(scrollBtn.dataset.scroll);
        if (targetEl) {
          closeDialog($('#projectModal'));
          setTimeout(() => targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
        }
        return;
      }

      const filterBtn = target.closest('[data-filter]');
      if (filterBtn) { applyFilter(filterBtn.dataset.filter); return; }

      const galleryBtn = target.closest('.gallery__thumb');
      if (galleryBtn) { setGallery(galleryBtn.dataset.img, Number(galleryBtn.dataset.index)); return; }

      const faqBtn = target.closest('.faq__q');
      if (faqBtn) {
        const item = faqBtn.closest('.faq__item');
        const open = item.classList.contains('is-open');
        $$('.faq__item').forEach((el) => {
          el.classList.remove('is-open');
          $('.faq__q', el)?.setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          item.classList.add('is-open');
          faqBtn.setAttribute('aria-expanded', 'true');
          track('faq_open', { index: $$('.faq__item').indexOf(item) });
        }
        return;
      }

      const langBtn = target.closest('[data-lang]');
      if (langBtn) { applyLanguage(langBtn.dataset.lang); return; }

      const chatTrigger = target.closest('[data-chat-open], [data-chat-prompt]');
      if (chatTrigger) {
        event.preventDefault();
        if (!window.Salma) return;
        const prompt = chatTrigger.dataset.chatPrompt;
        if (prompt) window.Salma.ask(prompt);
        else window.Salma.open();
        return;
      }

      const anchor = target.closest('a[href^="#"]');
      if (anchor && anchor.getAttribute('href') === '#') {
        event.preventDefault();
        return;
      }
      if (anchor && anchor.getAttribute('href') !== '#') {
        const id = anchor.getAttribute('href');
        const el = id ? $(id) : null;
        if (el) {
          event.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (window.innerWidth <= 1180 && $('#mobileMenu') && !$('#mobileMenu').hidden) {
            $('#mobileMenu').hidden = true;
            $('#menuBtn')?.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('is-locked');
          }
        }
      }
    });

    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href*="wa.me"]');
      if (link) track('whatsapp_click', { source: 'link' });
    });
  }

  function initCalcTracking() {
    let timer;
    $$('#calcValue, #calcDown, #calcYears, #calcRate').forEach((input) => {
      input.addEventListener('input', () => {
        updateCalc();
        clearTimeout(timer);
        timer = setTimeout(() => track('calculator_use'), 900);
      });
    });
  }

  /* ------------------------------ init ------------------------------ */
  function init() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('lang') === 'en' || params.get('lang') === 'es') state.lang = params.get('lang');
    if (params.get('nofx') === '1') document.documentElement.classList.add('no-reveal');
    if (params.get('flat') === '1') document.documentElement.classList.add('flat');
    if (params.get('only')) {
      const only = params.get('only');
      document.querySelectorAll('main > section, .hero, .ticker').forEach((section) => {
        if (section.id !== only) section.style.display = 'none';
      });
    }
    $('#year') && ($('#year').textContent = new Date().getFullYear());
    initReveal();
    applyLanguage(state.lang);
    initHeader();
    initDials();
    initBooking();
    initLeadForm();
    initDelegates();
    initCalcTracking();
    initProgress();
    track('page_view', { page: 'home' });
    setTimeout(() => {
      if (params.get('chat') === '1') window.Salma?.open();
      if (params.get('project')) openProject(params.get('project'));
      if (params.get('lead')) openLead(params.get('lead'), params.get('project') || 'marina');
      if (params.get('scroll')) {
        $(`#${params.get('scroll')}`)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }, 800);
  }

  window.SALMAN = {
    t, tf, track, money, num, projectById, projectName,
    get lang() { return state.lang; },
    setLang: applyLanguage,
    openProject, openLead, showToast,
    get whatsapp() { return WA; }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

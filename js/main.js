/* =============================================
   HERD & HOMELAND — Main JS
   ============================================= */
(function () {
    'use strict';

    var STORAGE_KEY = 'hh-lang';
    var lang = 'en';

    function $(s, p) { return (p || document).querySelector(s); }
    function $$(s, p) { return Array.prototype.slice.call((p || document).querySelectorAll(s)); }

    var navbar  = $('#navbar');
    var navLinks = $('#navLinks');
    var toggle  = $('#mobileToggle');
    var langBtn = $('#langSwitch');

    // ---- Language ----
    function setLang(l) {
        lang = l;
        document.documentElement.lang = l;

        $$('[data-en]').forEach(function (el) {
            var val = el.getAttribute('data-' + l);
            if (val !== null) el.innerHTML = val;
        });

        $$('[data-en-href]').forEach(function (el) {
            var href = el.getAttribute('data-' + l + '-href');
            if (href) el.setAttribute('href', href);
        });

        $$('[data-en-title]').forEach(function (el) {
            var t = el.getAttribute('data-' + l + '-title');
            if (t) document.title = t;
        });

        $$('.lang-switch span').forEach(function (s) {
            s.classList.toggle('active', s.classList.contains('lang-' + l));
        });

        try { localStorage.setItem(STORAGE_KEY, l); } catch (_) {}
    }

    if (langBtn) {
        langBtn.addEventListener('click', function () {
            setLang(lang === 'en' ? 'sv' : 'en');
        });
    }

    // ---- Navigation ----
    function onScroll() {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
        highlightNav();
    }

    function highlightNav() {
        var y = window.scrollY + 120;
        $$('section[id], header[id]').forEach(function (sec) {
            var link = $('.nav-links a[href="#' + sec.id + '"]');
            if (!link) return;
            link.classList.toggle('active', y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight);
        });
    }

    if (toggle) {
        toggle.addEventListener('click', function () {
            toggle.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
    }
    $$('.nav-links a').forEach(function (a) {
        a.addEventListener('click', function () {
            if (toggle) toggle.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    // ---- Hero image: hide if missing so the dark fallback shows ----
    var heroImg = $('.hero-bg img');
    if (heroImg) {
        heroImg.addEventListener('error', function () { heroImg.style.display = 'none'; });
        if (heroImg.complete && heroImg.naturalWidth === 0) heroImg.style.display = 'none';
    }

    // ---- Scroll reveal ----
    function initReveal() {
        if (!('IntersectionObserver' in window)) return;
        var els = $$('.section-eyebrow, .section-heading, .section-intro, .about-content > *, ' +
                     '.key-panel, .phase, .contribute, ' +
                     '.facts, .member, .who, .how-list li, .contact-card');
        els.forEach(function (el) { el.classList.add('reveal'); });
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        els.forEach(function (el) { obs.observe(el); });
    }

    // ---- Boot ----
    function boot() {
        var initial = 'en';
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'en' || stored === 'sv') initial = stored;
            else if ((navigator.language || '').toLowerCase().indexOf('sv') === 0) initial = 'sv';
        } catch (_) {}
        setLang(initial);

        var year = $('#year');
        if (year) year.textContent = new Date().getFullYear();

        onScroll();
        initReveal();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();

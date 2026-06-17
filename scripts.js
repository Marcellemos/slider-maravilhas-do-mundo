(() => {
      const slides      = Array.from(document.querySelectorAll('.slide'));
      const videos      = slides.map(s => s.querySelector('video'));
      const dotsNav     = document.getElementById('dots');
      const romanEl     = document.getElementById('roman-counter');
      const countEl     = document.getElementById('count-current');
      const btnPrev     = document.getElementById('btn-prev');
      const btnNext     = document.getElementById('btn-next');

      const ROMAN = ['I','II','III','IV','V','VI','VII'];
      let current  = 0;
      let animating = false;

      /* ── Build dots ─────────────────────────────── */
      const dots = slides.map((_, i) => {
        const btn = document.createElement('button');
        btn.className = 'dot' + (i === 0 ? ' active' : '');
        btn.setAttribute('aria-label', `Ir para slide ${i + 1}`);
        btn.addEventListener('click', () => goTo(i));
        dotsNav.appendChild(btn);
        return btn;
      });

      /* ── Go to slide ────────────────────────────── */
      function goTo(next) {
        if (animating || next === current) return;
        animating = true;

        const prev = current;

        // Pause & reset old video
        videos[prev].pause();
        videos[prev].currentTime = 0;

        // Deactivate old slide
        slides[prev].classList.remove('active');
        dots[prev].classList.remove('active');

        // Activate new slide
        current = next;
        slides[current].classList.add('active');
        dots[current].classList.add('active');

        // Update UI labels
        updateLabels();

        // Play new video
        videos[current].play().catch(() => {/* autoplay blocked – user will interact */});

        // Unlock after transition
        setTimeout(() => { animating = false; }, 950);
      }

      function updateLabels() {
        romanEl.style.opacity = '0';
        setTimeout(() => {
          romanEl.textContent = ROMAN[current];
          countEl.textContent  = current + 1;
          romanEl.style.opacity = '1';
        }, 200);
      }

      /* ── Infinite navigation ────────────────────── */
      function next() { goTo((current + 1) % slides.length); }
      function prev() { goTo((current - 1 + slides.length) % slides.length); }

      btnNext.addEventListener('click', next);
      btnPrev.addEventListener('click', prev);

      /* ── Keyboard ───────────────────────────────── */
      document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft')  prev();
      });

      /* ── Autoplay on video end ──────────────────── */
      videos.forEach((vid, i) => {
        vid.addEventListener('ended', () => {
          if (i === current) next();
        });
      });

      /* ── Touch / swipe ──────────────────────────── */
      let touchStartX = 0;
      const slider = document.getElementById('slider');

      slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].clientX;
      }, { passive: true });

      slider.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
      }, { passive: true });

      /* ── Autoplay first slide ───────────────────── */
      videos[0].play().catch(() => {});
    })();
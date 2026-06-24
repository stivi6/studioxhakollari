(function () {
  'use strict';

  /* ---- Practice Index ---- */
  var entries = Array.prototype.slice.call(document.querySelectorAll('.index-entry'));
  var openEntry = null;

  function open(entry) {
    if (openEntry && openEntry !== entry) close(openEntry);
    entry.classList.add('is-open');
    var btn = entry.querySelector('.index-head');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    openEntry = entry;
  }

  function close(entry) {
    entry.classList.remove('is-open');
    var btn = entry.querySelector('.index-head');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (openEntry === entry) openEntry = null;
  }

  function toggle(entry) {
    entry.classList.contains('is-open') ? close(entry) : open(entry);
  }

  entries.forEach(function (entry, i) {
    var btn = entry.querySelector('.index-head');
    if (!btn) return;

    btn.addEventListener('click', function () { toggle(entry); });

    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle(entry);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        var next = entries[i + 1];
        if (next) next.querySelector('.index-head').focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = entries[i - 1];
        if (prev) prev.querySelector('.index-head').focus();
      }
    });
  });

  /* ---- Contact Form ---- */
  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');

  if (form && success) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      /* [PLACEHOLDER: replace preventDefault with real submission once backend/Formspree is wired] */
      success.hidden = false;
      form.reset();
      success.focus();
    });
  }

  /* ---- Work Gallery & Lightbox ---- */
  var workGrid = document.getElementById('workGrid');
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImage');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');

  var workImages = [
    { file: 'assets/work/image.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 1' },
    { file: 'assets/work/image copy.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 2' },
    { file: 'assets/work/image copy 2.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 3' },
    { file: 'assets/work/image copy 3.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 4' },
    { file: 'assets/work/image copy 4.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 5' },
    { file: 'assets/work/image copy 5.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 6' },
    { file: 'assets/work/image copy 6.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 7' },
    { file: 'assets/work/image copy 7.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 8' },
    { file: 'assets/work/image copy 8.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 9' },
    { file: 'assets/work/image copy 9.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 10' },
    { file: 'assets/work/image copy 10.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 11' },
    { file: 'assets/work/image copy 11.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 12' },
    { file: 'assets/work/image copy 12.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 13' },
    { file: 'assets/work/image copy 13.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 14' },
    { file: 'assets/work/image copy 14.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 15' },
    { file: 'assets/work/image copy 15.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 16' },
    { file: 'assets/work/image copy 16.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 17' },
    { file: 'assets/work/image copy 17.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 18' },
    { file: 'assets/work/image copy 18.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 19' },
    { file: 'assets/work/image copy 19.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 20' },
    { file: 'assets/work/image copy 20.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 21' },
    { file: 'assets/work/image copy 21.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 22' },
    { file: 'assets/work/image copy 22.png', title: 'Verifikim për Ndalesë Levizje / Fshirje Ekspulsi 23' }
  ];

  var currentLightboxIndex = -1;

  function renderWorkGrid() {
    if (!workGrid) return;
    workGrid.innerHTML = workImages.map(function (img, i) {
      return (
        '<div class="work-item" role="listitem" tabindex="0" data-index="' + i + '">' +
          '<img src="' + img.file + '" alt="' + img.title + '" loading="lazy" />' +
          '<div class="work-item-caption">' +
            '<div class="work-item-title">' + img.title + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    // Attach click/keyboard handlers
    var items = workGrid.querySelectorAll('.work-item');
    items.forEach(function (item) {
      item.addEventListener('click', function () { openLightbox(parseInt(item.dataset.index, 10)); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(parseInt(item.dataset.index, 10));
        }
      });
    });
  }

  function openLightbox(index) {
    if (index < 0 || index >= workImages.length) return;
    currentLightboxIndex = index;
    var img = workImages[index];
    lightboxImg.src = img.file;
    lightboxImg.alt = img.title;
    lightboxCaption.textContent = img.title;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
    updateNavButtons();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    currentLightboxIndex = -1;
  }

  function navigateLightbox(delta) {
    var newIndex = currentLightboxIndex + delta;
    if (newIndex >= 0 && newIndex < workImages.length) {
      openLightbox(newIndex);
    }
  }

  function updateNavButtons() {
    if (lightboxPrev) lightboxPrev.style.display = currentLightboxIndex > 0 ? 'flex' : 'none';
    if (lightboxNext) lightboxNext.style.display = currentLightboxIndex < workImages.length - 1 ? 'flex' : 'none';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', function () { navigateLightbox(-1); });
  if (lightboxNext) lightboxNext.addEventListener('click', function () { navigateLightbox(1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // Initialize
  renderWorkGrid();

})();

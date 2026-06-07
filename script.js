// ── Tab navigation ──
const navBtns = document.querySelectorAll('.nav-btn');
const tabs = document.querySelectorAll('.tab');

function switchTab(tabName) {
  navBtns.forEach(b => b.classList.remove('active'));
  tabs.forEach(t => t.classList.remove('active'));
  const btn = document.querySelector(`.nav-btn[data-tab="${tabName}"]`);
  const tab = document.getElementById(tabName);
  if (btn && tab) {
    btn.classList.add('active');
    tab.classList.add('active');
  } else {
    // fallback to featured
    document.querySelector('.nav-btn[data-tab="featured"]').classList.add('active');
    document.getElementById('featured').classList.add('active');
  }
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.dataset.tab;
    switchTab(tabName);
    history.pushState(null, '', '#' + tabName);
  });
});

// Load correct tab on page load from hash
const initialTab = location.hash.replace('#', '') || 'featured';
switchTab(initialTab);

// ── Carousels ──
function initCarousel(el) {
  const track  = el.querySelector('.car-track');
  const slides = el.querySelectorAll('.car-slide');
  const prev   = el.querySelector('.car-prev');
  const next   = el.querySelector('.car-next');
  const visible = 3;
  let index = 0;
  const max = slides.length - visible;

  function slideWidth() {
    return slides[0].offsetWidth;
  }

  function go(n) {
    index = Math.max(0, Math.min(n, max));
    track.style.transform = `translateX(${-index * slideWidth()}px)`;
  }

  prev.addEventListener('click', () => { go(index - 1); resetTimer(); });
  next.addEventListener('click', () => { go(index + 1); resetTimer(); });

  window.addEventListener('resize', () => go(index));

  // auto-scroll every 3 seconds, pause on hover
  let timer = setInterval(() => go(index < max ? index + 1 : 0), 3000);
  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => go(index < max ? index + 1 : 0), 3000);
  }
  el.addEventListener('mouseenter', () => clearInterval(timer));
  el.addEventListener('mouseleave', () => { timer = setInterval(() => go(index < max ? index + 1 : 0), 3000); });

  slides.forEach(slide => {
    slide.querySelector('img').addEventListener('click', e => openLightbox(e.target));
  });
}

document.querySelectorAll('.carousel').forEach(initCarousel);

// ── Lightbox ──
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');
const lbClose  = document.getElementById('lb-close');
const lbPrev   = document.getElementById('lb-prev');
const lbNext   = document.getElementById('lb-next');

// Collect all photo images in order for lightbox navigation
let allPhotos = [];
let lbIndex = 0;

function buildPhotoList() {
  allPhotos = Array.from(document.querySelectorAll('#photo .car-slide img, #photo .poster-card img'));
}

// Wire poster grid clicks to lightbox
document.querySelectorAll('.poster-card img').forEach(img => {
  img.addEventListener('click', () => openLightbox(img));
});

function openLightbox(img) {
  buildPhotoList();
  lbIndex = allPhotos.indexOf(img);
  lbImg.src = allPhotos[lbIndex].src;
  lightbox.classList.remove('hidden');
}

function closeLightbox() {
  lightbox.classList.add('hidden');
  lbImg.src = '';
}

function shiftLightbox(dir) {
  lbIndex = (lbIndex + dir + allPhotos.length) % allPhotos.length;
  lbImg.src = allPhotos[lbIndex].src;
}

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click',  () => shiftLightbox(-1));
lbNext.addEventListener('click',  () => shiftLightbox(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (lightbox.classList.contains('hidden')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   shiftLightbox(-1);
  if (e.key === 'ArrowRight')  shiftLightbox(1);
});

// ── GIF thumbnails → Vimeo on click ──
document.querySelectorAll('.gif-thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const id = thumb.dataset.vimeo;
    const iframe = document.createElement('iframe');
    iframe.src = `https://player.vimeo.com/video/${id}?autoplay=1`;
    iframe.allowFullscreen = true;
    iframe.allow = 'autoplay';
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;';
    thumb.replaceWith(iframe);
  });
});

// ── Load more (Commercials) ──
const loadMoreBtn = document.getElementById('load-more-commercials');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', function () {
    const grid = document.getElementById('commercials-more');
    if (grid) {
      grid.classList.remove('hidden');
      grid.querySelectorAll('iframe[data-src]').forEach(iframe => {
        iframe.src = iframe.dataset.src;
        iframe.removeAttribute('data-src');
      });
    }
    this.parentElement.remove();
  });
}

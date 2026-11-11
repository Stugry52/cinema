/* ============================================================
   ФОНАРИК ДЛЯ КУРСОРА
   ============================================================ */
const spotlight = document.getElementById('spotlight');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let currentX = mouseX;
let currentY = mouseY;

function animateSpotlight() {
  currentX += (mouseX - currentX) * 0.18;
  currentY += (mouseY - currentY) * 0.18;
  spotlight.style.left = currentX + 'px';
  spotlight.style.top = currentY + 'px';
  requestAnimationFrame(animateSpotlight);
}

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener('mouseover', e => {
  if (e.target.closest('a, button, .movie, .feature, .seat, .showtime-btn')) {
    spotlight.classList.add('active');
  }
});

document.addEventListener('mouseout', e => {
  if (e.target.closest('a, button, .movie, .feature, .seat, .showtime-btn')) {
    spotlight.classList.remove('active');
  }
});

document.addEventListener('mouseleave', () => spotlight.style.opacity = '0');
document.addEventListener('mouseenter', () => spotlight.style.opacity = '1');

animateSpotlight();


/* ============================================================
   ДАННЫЕ ФИЛЬМОВ
   ============================================================ */
const movies = [
  { id: 1, title: 'Дюна: Часть вторая', genre: 'Фантастика', duration: '166 мин', rating: '8.7',
    color: 'linear-gradient(135deg,#c97b2e,#3a1f0b)', emoji: '🏜️',
    showtimes: [
      { time: '12:30', hall: 'Зал 1' },
      { time: '16:00', hall: 'Зал 1' },
      { time: '20:15', hall: 'Зал 2' }
    ] },
  { id: 2, title: 'Оппенгеймер', genre: 'Драма', duration: '180 мин', rating: '8.5',
    color: 'linear-gradient(135deg,#5b3a2e,#1a1210)', emoji: '💥',
    showtimes: [
      { time: '13:00', hall: 'Зал 1' },
      { time: '17:30', hall: 'Зал 1' },
      { time: '21:00', hall: 'Зал 2' }
    ] },
  { id: 3, title: 'Барби', genre: 'Комедия', duration: '114 мин', rating: '7.9',
    color: 'linear-gradient(135deg,#e754b8,#8b2d6e)', emoji: '💖',
    showtimes: [
      { time: '11:00', hall: 'Зал 2' },
      { time: '14:20', hall: 'Зал 2' },
      { time: '18:40', hall: 'Зал 2' }
    ] },
  { id: 4, title: 'Интерстеллар', genre: 'Фантастика', duration: '169 мин', rating: '8.6',
    color: 'linear-gradient(135deg,#2b5876,#0b1622)', emoji: '🌌',
    showtimes: [
      { time: '12:00', hall: 'Зал 1' },
      { time: '15:40', hall: 'Зал 1' },
      { time: '19:50', hall: 'Зал 1' }
    ] },
  { id: 5, title: 'Джон Уик 4', genre: 'Боевик', duration: '169 мин', rating: '8.1',
    color: 'linear-gradient(135deg,#8b1e1e,#240808)', emoji: '🔫',
    showtimes: [
      { time: '13:30', hall: 'Зал 2' },
      { time: '17:00', hall: 'Зал 2' },
      { time: '21:20', hall: 'Зал 1' }
    ] },
  { id: 6, title: 'Аватар: Путь воды', genre: 'Фантастика', duration: '192 мин', rating: '8.3',
    color: 'linear-gradient(135deg,#1f8ba8,#0a2b38)', emoji: '🌊',
    showtimes: [
      { time: '11:30', hall: 'Зал 1' },
      { time: '15:10', hall: 'Зал 1' },
      { time: '19:30', hall: 'Зал 2' }
    ] }
];


/* ============================================================
   СХЕМА ЗАЛА
   ------------------------------------------------------------
   12 рядов × 10 мест = 120 мест
   Типы кресел:
     Ряды 1–3   → standard (450 ₽)
     Ряды 4–9   → comfort  (650 ₽)
     Ряды 10–12 → vip      (1200 ₽)
   ============================================================ */
const HALL = {
  rows: 12,
  cols: 10,
  prices: {
    standard: 450,
    comfort: 650,
    vip: 1200
  }
};

function seatTypeForRow(row) {
  if (row <= 3) return 'standard';
  if (row <= 9) return 'comfort';
  return 'vip';
}

// Стабильный набор «занятых» мест (одинаков для одного сеанса)
function getTakenSeats(movieId, showtimeIndex) {
  const taken = new Set();
  const seed = movieId * 100 + showtimeIndex * 13 + 7;
  for (let r = 1; r <= HALL.rows; r++) {
    for (let c = 1; c <= HALL.cols; c++) {
      const n = r * 31 + c * 17 + seed;
      if (n % 9 < 2) taken.add(`${r}-${c}`);
    }
  }
  return taken;
}


/* ============================================================
   РЕНДЕР АФИШИ
   ============================================================ */
const grid = document.getElementById('moviesGrid');

movies.forEach(m => {
  const card = document.createElement('div');
  card.className = 'movie';
  card.innerHTML = `
    <div class="movie-poster" style="background:${m.color};">
      <span class="rating">★ ${m.rating}</span>
      ${m.emoji}
    </div>
    <div class="movie-info">
      <h3>${m.title}</h3>
      <div class="meta">
        <span>${m.genre}</span><span>${m.duration}</span>
      </div>
      <button class="buy-btn" data-id="${m.id}">Купить билет</button>
    </div>
  `;
  grid.appendChild(card);
});


/* ============================================================
   ЭЛЕМЕНТЫ МОДАЛКИ
   ============================================================ */
const overlay        = document.getElementById('modalOverlay');
const closeBtn       = document.getElementById('closeBtn');
const stepShowtime   = document.getElementById('stepShowtime');
const stepSeats      = document.getElementById('stepSeats');
const stepConfirm    = document.getElementById('stepConfirm');
const bookingTitle   = document.getElementById('bookingTitle');
const bookingMeta    = document.getElementById('bookingMeta');
const showtimeList   = document.getElementById('showtimeList');
const hallInfo       = document.getElementById('hallInfo');
const hallGrid       = document.getElementById('hallGrid');
const seatCountEl    = document.getElementById('seatCount');
const totalSumEl     = document.getElementById('totalSum');
const confirmBtn     = document.getElementById('confirmBtn');
const backToShowtimes= document.getElementById('backToShowtimes');
const backToSeats    = document.getElementById('backToSeats');
const payBtn         = document.getElementById('payBtn');
const ticketPreview  = document.getElementById('ticketPreview');


/* ============================================================
   СОСТОЯНИЕ БРОНИРОВАНИЯ
   ============================================================ */
let currentMovie    = null;
let currentShowtime = null;   // { time, hall, index }
let selectedSeats   = new Map(); // key "row-col" → { row, col, type, price }
let takenSeats      = new Set();


/* ============================================================
   ОТКРЫТИЕ / ЗАКРЫТИЕ МОДАЛКИ
   ============================================================ */
function openBooking(movie) {
  currentMovie = movie;
  currentShowtime = null;
  selectedSeats.clear();

  bookingTitle.textContent = movie.title;
  bookingMeta.textContent = `${movie.genre} • ${movie.duration} • ★ ${movie.rating}`;

  renderShowtimes();
  showStep('showtime');
  overlay.classList.add('active');
}

function closeBooking() {
  overlay.classList.remove('active');
}

function showStep(step) {
  stepShowtime.hidden = step !== 'showtime';
  stepSeats.hidden    = step !== 'seats';
  stepConfirm.hidden  = step !== 'confirm';
}


/* ============================================================
   ШАГ 1 — ВЫБОР СЕАНСА
   ============================================================ */
function renderShowtimes() {
  showtimeList.innerHTML = '';

  currentMovie.showtimes.forEach((st, idx) => {
    const btn = document.createElement('button');
    btn.className = 'showtime-btn';
    btn.innerHTML = `
      <span class="time">${st.time}</span>
      <span class="hall">${st.hall}</span>
    `;
    btn.addEventListener('click', () => {
      currentShowtime = { ...st, index: idx };
      selectedSeats.clear();
      openSeatsStep();
    });
    showtimeList.appendChild(btn);
  });
}


/* ============================================================
   ШАГ 2 — ВЫБОР МЕСТ
   ============================================================ */
function openSeatsStep() {
  takenSeats = getTakenSeats(currentMovie.id, currentShowtime.index);

  hallInfo.innerHTML = `
    <b>${currentShowtime.time}</b> • ${currentShowtime.hall} • ${currentMovie.title}
  `;

  renderHall();
  updateSummary();
  showStep('seats');
}

function renderHall() {
  hallGrid.innerHTML = '';

  for (let r = 1; r <= HALL.rows; r++) {
    const type = seatTypeForRow(r);
    for (let c = 1; c <= HALL.cols; c++) {
      const key = `${r}-${c}`;
      const seat = document.createElement('button');
      seat.className = `seat ${type}`;
      seat.dataset.key = key;
      seat.title = `Ряд ${r}, место ${c} • ${typeLabel(type)} • ${HALL.prices[type]} ₽`;

      if (takenSeats.has(key)) {
        seat.classList.add('taken');
        seat.disabled = true;
      } else {
        seat.addEventListener('click', () => toggleSeat(key, seat, r, c, type));
      }

      hallGrid.appendChild(seat);
    }
  }
}

function typeLabel(type) {
  return { standard: 'Стандарт', comfort: 'Комфорт', vip: 'VIP' }[type];
}

function toggleSeat(key, el, row, col, type) {
  if (selectedSeats.has(key)) {
    selectedSeats.delete(key);
    el.classList.remove('selected');
  } else {
    selectedSeats.set(key, { row, col, type, price: HALL.prices[type] });
    el.classList.add('selected');
  }
  updateSummary();
}

function updateSummary() {
  let total = 0;
  selectedSeats.forEach(s => total += s.price);

  seatCountEl.textContent = selectedSeats.size;
  totalSumEl.textContent = total + ' ₽';
  confirmBtn.disabled = selectedSeats.size === 0;
}


/* ============================================================
   ШАГ 3 — ПОДТВЕРЖДЕНИЕ
   ============================================================ */
function openConfirmStep() {
  if (selectedSeats.size === 0) return;

  // Группируем места по типу для красивого вывода
  const grouped = { standard: [], comfort: [], vip: [] };
  let total = 0;

  selectedSeats.forEach((s, key) => {
    grouped[s.type].push(`ряд ${s.row}, место ${s.col}`);
    total += s.price;
  });

  const rows = [];
  rows.push(`<div class="ticket-row"><span>Фильм</span><b>${currentMovie.title}</b></div>`);
  rows.push(`<div class="ticket-row"><span>Сеанс</span><b>${currentShowtime.time} • ${currentShowtime.hall}</b></div>`);

  ['standard', 'comfort', 'vip'].forEach(type => {
    if (grouped[type].length === 0) return;
    const count = grouped[type].length;
    const price = HALL.prices[type];
    rows.push(`
      <div class="ticket-row">
        <span>${typeLabel(type)} (${count} шт. × ${price} ₽)</span>
        <b>${grouped[type].join(', ')}</b>
      </div>
    `);
  });

  rows.push(`<div class="ticket-row total-row"><span>Итого к оплате</span><b>${total} ₽</b></div>`);

  ticketPreview.innerHTML = rows.join('');
  showStep('confirm');
}


/* ============================================================
   ОБРАБОТЧИКИ
   ============================================================ */
// Открытие бронирования с карточки фильма
grid.addEventListener('click', e => {
  const btn = e.target.closest('.buy-btn');
  if (!btn) return;
  const movie = movies.find(m => m.id === +btn.dataset.id);
  if (movie) openBooking(movie);
});

// Закрытие
closeBtn.addEventListener('click', closeBooking);
overlay.addEventListener('click', e => {
  if (e.target === overlay) closeBooking();
});

// Назад к сеансам
backToShowtimes.addEventListener('click', () => {
  selectedSeats.clear();
  showStep('showtime');
});

// К оплате
confirmBtn.addEventListener('click', openConfirmStep);

// Назад к местам
backToSeats.addEventListener('click', () => {
  showStep('seats');
  updateSummary();
});

// Оплата
payBtn.addEventListener('click', () => {
  let total = 0;
  selectedSeats.forEach(s => total += s.price);
  const count = selectedSeats.size;
  const title = currentMovie.title;
  const time = currentShowtime.time;

  closeBooking();
  selectedSeats.clear();
  showToast(`🎟️ ${title} • ${time} • ${count} мест • ${total} ₽`);
});

// ESC закрывает модалку
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('active')) {
    closeBooking();
  }
});


/* ============================================================
   TOAST
   ============================================================ */
const toast = document.getElementById('toast');
let toastTimer;

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}


/* ============================================================
   ПЛАВНЫЙ СКРОЛЛ
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
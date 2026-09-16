// ===== ДАННЫЕ (легко редактировать) =====
const SERVICES = [
  { icon: '🧹', title: 'Уборка территорий', text: 'Ежедневная уборка подъездов, дворов, вывоз мусора и содержание контейнерных площадок.' },
  { icon: '🔧', title: 'Текущий ремонт',    text: 'Сантехника, электрика, мелкий ремонт общего имущества по заявкам жителей.' },
  { icon: '🛗', title: 'Лифтовое хозяйство', text: 'Плановое обслуживание и аварийный ремонт лифтов совместно со специализированной организацией.' },
  { icon: '🔥', title: 'Отопление и ВК',     text: 'Подготовка к отопительному сезону, промывка систем, устранение протечек.' },
  { icon: '🚨', title: 'Аварийная служба',   text: 'Круглосуточное реагирование на аварии: засоры, протечки, отключения.' },
  { icon: '📊', title: 'Прозрачная отчётность', text: 'Ежемесячные отчёты о расходовании средств и выполненных работах — на сайте и в ГИС ЖКХ.' },
];

const STATS = [
  { num: '24/7',  label: 'Аварийная служба' },
  { num: '15 мин', label: 'Среднее время отклика' },
  { num: '100%',  label: 'Прозрачность отчётов' },
  { num: '365',   label: 'Дней работы в году' },
];

const CONTACTS = [
  { ic: '📍', title: 'Адрес офиса',   value: 'г. Воронеж, Московский проспект, 110А' },
  { ic: '☎',  title: 'Диспетчерская', value: '+7 (000) 000-00-00', href: 'tel:+70000000000' },
  { ic: '✉',  title: 'Email',         value: 'info@example.ru',   href: 'mailto:info@example.ru' },
  { ic: '🕒', title: 'Режим работы',  value: 'Пн–Пт: 9:00–18:00<br>Аварийка: 24/7' },
];

const PROBLEM_TYPES = [
  'Уборка / мусор',
  'Сантехника / протечка',
  'Электрика',
  'Лифт',
  'Отопление',
  'Другое',
];

// ===== РЕНДЕР УСЛУГ =====
function renderServices() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  grid.innerHTML = SERVICES.map(s => `
    <div class="service-card">
      <div class="service-icon">${s.icon}</div>
      <h3>${s.title}</h3>
      <p>${s.text}</p>
    </div>
  `).join('');
}

// ===== РЕНДЕР ЦИФР =====
function renderStats() {
  const block = document.getElementById('statsBlock');
  if (!block) return;
  block.innerHTML = STATS.map(s => `
    <div>
      <div class="num">${s.num}</div>
      <div class="label">${s.label}</div>
    </div>
  `).join('');
}

// ===== РЕНДЕР КОНТАКТОВ =====
function renderContacts() {
  const grid = document.getElementById('contactsGrid');
  if (!grid) return;
  grid.innerHTML = CONTACTS.map(c => {
    const content = c.href
      ? `<a href="${c.href}">${c.value}</a>`
      : c.value;
    return `
      <div class="contact-card">
        <div class="ic">${c.ic}</div>
        <h4>${c.title}</h4>
        <p>${content}</p>
      </div>
    `;
  }).join('');
}

// ===== ЗАПОЛНЕНИЕ SELECT =====
function renderProblemTypes() {
  const select = document.getElementById('type');
  if (!select) return;
  select.innerHTML = PROBLEM_TYPES
    .map(t => `<option value="${t}">${t}</option>`)
    .join('');
}

// ===== ВАЛИДАЦИЯ ФОРМЫ =====
function validateForm(data) {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Введите имя (минимум 2 символа)';
  }

  if (!data.addr || data.addr.trim().length < 3) {
    errors.addr = 'Укажите адрес и квартиру';
  }

  // Простая проверка российского номера
  const phoneClean = data.phone.replace(/[^\d+]/g, '');
  if (!/^\+?\d{10,15}$/.test(phoneClean)) {
    errors.phone = 'Введите корректный номер телефона';
  }

  if (!data.msg || data.msg.trim().length < 5) {
    errors.msg = 'Опишите проблему (минимум 5 символов)';
  }

  return errors;
}

function showErrors(errors) {
  // Сначала очищаем все
  document.querySelectorAll('.form-row').forEach(row => row.classList.remove('invalid'));
  document.querySelectorAll('.error').forEach(el => el.textContent = '');

  Object.entries(errors).forEach(([field, text]) => {
    const errorEl = document.querySelector(`.error[data-for="${field}"]`);
    if (errorEl) {
      errorEl.textContent = text;
      errorEl.closest('.form-row').classList.add('invalid');
    }
  });
}

// ===== ОБРАБОТКА ФОРМЫ =====
function initForm() {
  const form = document.getElementById('requestForm');
  const msg = document.getElementById('formMsg');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = {
      name:  form.name.value,
      addr:  form.addr.value,
      phone: form.phone.value,
      type:  form.type.value,
      msg:   form.msg.value,
    };

    const errors = validateForm(data);
    showErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Прокрутим к первой ошибке
      const firstInvalid = form.querySelector('.form-row.invalid');
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Здесь можно отправить данные на сервер:
    // fetch('/api/request', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) })
    console.log('Заявка:', data);

    msg.style.display = 'block';
    form.reset();
    setTimeout(() => { msg.style.display = 'none'; }, 4000);
  });
}

// ===== ПЛАВНЫЙ СКРОЛЛ =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===== ГОД В ФУТЕРЕ =====
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
  renderServices();
  renderStats();
  renderContacts();
  renderProblemTypes();
  initForm();
  initSmoothScroll();
  setYear();
});

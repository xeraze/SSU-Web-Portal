const WEBHOOK_PROXY_URL = "https://xdevs-application-webhook.xeraze-official.workers.dev";

const burgerBtn = document.getElementById('burgerBtn');
const fullMenu = document.getElementById('fullMenu');
const closeMenuBtn = document.getElementById('closeMenu');

function toggleMenu() {
    fullMenu.classList.toggle('active');
    burgerBtn.classList.toggle('active');
    document.body.style.overflow = fullMenu.classList.contains('active') ? 'hidden' : 'auto';
}
burgerBtn.addEventListener('click', toggleMenu);
closeMenuBtn.addEventListener('click', toggleMenu);
document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => {
        if (fullMenu.classList.contains('active')) toggleMenu();
    });
});

const header = document.getElementById('siteHeader');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (currentY > lastScrollY && currentY > 200) {
        header.classList.add('hide-line');
    } else {
        header.classList.remove('hide-line');
    }
    lastScrollY = currentY;
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.querySelectorAll('.faq-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const isActive = item.classList.contains('active');
        const content = item.querySelector('.faq-content');

        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('active');
            i.querySelector('.faq-icon').textContent = '+';
            i.querySelector('.faq-content').style.maxHeight = null;
        });

        if (!isActive) {
            item.classList.add('active');
            header.querySelector('.faq-icon').textContent = '+';
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
});

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let width, height, particles;

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.3;
        this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0) this.x = width; if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height; if (this.y > height) this.y = 0;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247, 147, 30, ${this.alpha * 0.5})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const density = window.innerWidth < 768 ? 24000 : 15000;
    const count = Math.floor((width * height) / density);
    for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

const phoneInput = document.getElementById('f-phone');
phoneInput.addEventListener('input', () => {
    let digits = phoneInput.value.replace(/\D/g, '');
    if (digits.startsWith('380')) digits = digits.slice(2);
    else if (digits.startsWith('0')) { /* keep as is */ }
    digits = digits.slice(0, 9);

    let formatted = '+38 (0';
    if (digits.length > 1) formatted += digits.slice(1, 2);
    if (digits.length > 2) formatted += ') ' + digits.slice(2, 5);
    if (digits.length > 5) formatted += ' ' + digits.slice(5, 7);
    if (digits.length > 7) formatted += ' ' + digits.slice(7, 9);

    phoneInput.value = digits.length ? formatted : '';
});

function setupCheckbox(wrapId, inputId) {
    const wrap = document.getElementById(wrapId);
    const input = document.getElementById(inputId);
    wrap.addEventListener('click', (e) => {
        e.preventDefault();
        input.checked = !input.checked;
        clearFieldError(inputId);
    });
}
setupCheckbox('ageCheckWrap', 'f-age');
setupCheckbox('agreeCheckWrap', 'f-agree');

document.getElementById('privacyLink').addEventListener('click', (e) => {
    e.stopPropagation();
});

const REQUIRED_TEXT_FIELDS = ['f-lastname', 'f-firstname'];

function clearFieldError(id) {
    const el = document.getElementById(id);
    if (el && el.classList.contains('input-field')) el.classList.remove('field-error');
    const msg = document.querySelector(`.field-error-msg[data-for="${id}"]`);
    if (msg) msg.classList.remove('show');
}

function setFieldError(id) {
    const el = document.getElementById(id);
    if (el && el.classList.contains('input-field')) el.classList.add('field-error');
    const msg = document.querySelector(`.field-error-msg[data-for="${id}"]`);
    if (msg) msg.classList.add('show');
}

REQUIRED_TEXT_FIELDS.forEach(id => {
    document.getElementById(id).addEventListener('input', () => clearFieldError(id));
});
phoneInput.addEventListener('input', () => clearFieldError('f-phone'));
document.querySelectorAll('input[name="military"]').forEach(r => {
    r.addEventListener('change', () => clearFieldError('military'));
});

function validateForm() {
    let valid = true;

    REQUIRED_TEXT_FIELDS.forEach(id => {
        const val = document.getElementById(id).value.trim();
        if (!val) { setFieldError(id); valid = false; } else { clearFieldError(id); }
    });

    const phoneDigits = phoneInput.value.replace(/\D/g, '');
    if (phoneDigits.length < 9) {
        setFieldError('f-phone');
        valid = false;
    } else {
        clearFieldError('f-phone');
    }

    const militaryChecked = document.querySelector('input[name="military"]:checked');
    if (!militaryChecked) {
        setFieldError('military');
        valid = false;
    } else {
        clearFieldError('military');
    }

    if (!document.getElementById('f-age').checked) {
        setFieldError('f-age');
        valid = false;
    } else {
        clearFieldError('f-age');
    }

    if (!document.getElementById('f-agree').checked) {
        setFieldError('f-agree');
        valid = false;
    } else {
        clearFieldError('f-agree');
    }

    return valid;
}

const form = document.getElementById('applicationForm');
const submitBtn = document.getElementById('submitBtn');
const submitBtnLabel = document.getElementById('submitBtnLabel');
const formStatus = document.getElementById('formStatus');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        showStatus('Будь ласка, заповніть усі обов\'язкові поля коректно.', true);
        return;
    }

    submitBtn.disabled = true;
    const originalLabel = submitBtnLabel.textContent;
    submitBtnLabel.textContent = 'Надсилання...';
    hideStatus();

    const payload = buildDiscordPayload();

    try {
        const res = await fetch(WEBHOOK_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            form.style.display = 'none';
            formSuccess.classList.add('show');
        } else {
            submitBtnLabel.textContent = originalLabel;
            submitBtn.disabled = false;
            showStatus('Не вдалося надіслати заявку. Спробуйте ще раз.', true);
        }
    } catch (err) {
        submitBtnLabel.textContent = originalLabel;
        submitBtn.disabled = false;
        showStatus('Немає з\'єднання з сервером. Перевірте інтернет.', true);
    }
});

function showStatus(text, isError) {
    formStatus.textContent = text;
    formStatus.classList.add('show');
    formStatus.classList.toggle('error', !!isError);
}
function hideStatus() {
    formStatus.classList.remove('show');
}

function buildDiscordPayload() {
    const val = id => {
        const el = document.getElementById(id);
        return el.value.trim() || '—';
    };
    const military = document.querySelector('input[name="military"]:checked');

    return {
        embeds: [{
            title: "Нова заявка на службу в СБУ",
            color: 0xF7931E,
            fields: [
                { name: "Прізвище", value: val('f-lastname'), inline: true },
                { name: "Ім'я", value: val('f-firstname'), inline: true },
                { name: "По батькові", value: val('f-middlename'), inline: true },
                { name: "Телефон", value: val('f-phone'), inline: true },
                { name: "Telegram", value: val('f-telegram'), inline: true },
                { name: "Discord", value: val('f-discord'), inline: true },
                { name: "Військовослужбовець зараз?", value: military ? military.value : '—', inline: true }
            ],
            footer: { text: "СБУ — Анкета кандидата" },
            timestamp: new Date().toISOString()
        }]
    };
}

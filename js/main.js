// ===== Navbar: shadow state on scroll (nav itself is always visible — fixes
// the old bug where it stayed hidden until the user scrolled 60% of the
// viewport, which meant it never appeared at all on short pages) =====
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
}

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
}
function closeMenu() {
    document.getElementById('navLinks').classList.remove('open');
}

// ===== Highlight the current page in the nav (replaces the old scroll-spy
// logic, which only worked for in-page anchors and broke once the site was
// split into separate pages) =====
(function highlightActiveNav() {
    const currentPage = document.body.dataset.page;
    if (!currentPage) return;
    document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
        if (link.dataset.page === currentPage) link.classList.add('active');
    });
})();

// ===== Reveal-on-scroll animation =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, observerOptions);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== Resource tabs used on subject sub-pages (Syllabus / Notes / Lab
// Manuals / Assignments / Quiz & Test) =====
document.querySelectorAll('.resource-tabs').forEach(wrapper => {
    const buttons = wrapper.querySelectorAll('.tab-btn');
    const panels = wrapper.querySelectorAll('.tab-panel');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const target = wrapper.querySelector('.tab-panel[data-tab="' + btn.dataset.tab + '"]');
            if (target) target.classList.add('active');
        });
    });
});

// ===== Contact form handler — Web3Forms =====
// Guarded with a null-check because contactForm only exists on contact.html;
// previously this threw "Cannot read properties of null" and silently broke
// every script below it whenever the shared script ran on other pages.
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const status = document.getElementById('formStatus');
        const btn = this.querySelector('.btn-submit');

        const name = document.getElementById('cf-name').value.trim();
        const email = document.getElementById('cf-email').value.trim();
        const subject = document.getElementById('cf-subject').value;
        const message = document.getElementById('cf-message').value.trim();

        if (!name || !email || !subject || !message) {
            status.className = 'form-status error';
            status.textContent = 'Please fill in all required fields.';
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            status.className = 'form-status error';
            status.textContent = 'Please enter a valid email address.';
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
        status.className = 'form-status';

        try {
            const formData = new FormData(this);
            formData.set('subject', 'New Contact [' + subject + '] — Prof. Ram Kumar');

            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                status.className = 'form-status success';
                status.textContent = 'Thank you, ' + name + '! Your message has been sent successfully.';
                this.reset();
            } else {
                throw new Error(data.message || 'Submission failed.');
            }
        } catch (err) {
            status.className = 'form-status error';
            status.textContent = 'Something went wrong. Please email directly at ramahk92@geckhagaria.org.in';
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
    });
}

// ===== Footer copyright year, always current instead of hardcoded =====
document.querySelectorAll('.copyright-year').forEach(el => {
    el.textContent = new Date().getFullYear();
});

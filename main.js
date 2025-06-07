// Always reset scroll position to top on refresh and navigation
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};
window.onload = function () {
    setTimeout(function() { window.scrollTo(0, 0); }, 1);
};
localStorage.removeItem('theme');

// Splash screen logic
window.addEventListener('DOMContentLoaded', function() {
    // Show splash screen for 5 seconds
    setTimeout(function() {
        document.getElementById('splashScreen').classList.add('fade-out');
    }, 5000);
    // Remove splash screen from DOM after fade out
    setTimeout(function() {
        document.getElementById('splashScreen').style.display = 'none';
    }, 3000);
});

// Theme toggle logic
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const sunRays = themeIcon.querySelector('#sun-rays');
const moon = themeIcon.querySelector('#moon');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
function setTheme(theme) {
    document.body.classList.toggle('light-theme', theme === 'light');
    if (theme === 'light') {
        sunRays.style.opacity = '1';
        moon.style.opacity = '0';
    } else {
        sunRays.style.opacity = '0';
        moon.style.opacity = '1';
    }
}
setTheme(savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light'));
themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    const theme = isLight ? 'light' : 'dark';
    if (isLight) {
        sunRays.style.opacity = '1';
        moon.style.opacity = '0';
    } else {
        sunRays.style.opacity = '0';
        moon.style.opacity = '1';
    }
    localStorage.setItem('theme', theme);
});
if (document.body.classList.contains('light-theme')) {
    sunRays.style.opacity = '1';
    moon.style.opacity = '0';
} else {
    sunRays.style.opacity = '0';
    moon.style.opacity = '1';
}

// Contact form AJAX and popup with spinner
const contactForm = document.getElementById('contactForm');
const formSuccessMsg = document.getElementById('formSuccessMsg');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        formSuccessMsg.style.display = 'none'; // Hide on new submit
        const btn = contactForm.querySelector('button[type="submit"]');
        const btnText = btn.querySelector('.btn-text');
        const btnSpinner = btn.querySelector('.btn-spinner');
        btn.disabled = true;
        btnText.style.display = 'none';
        btnSpinner.style.display = 'inline-block';
        const formData = new FormData(contactForm);
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            btn.disabled = false;
            btnText.style.display = 'inline';
            btnSpinner.style.display = 'none';
            formSuccessMsg.textContent = 'Thank you! Your message has been sent.';
            formSuccessMsg.style.display = 'block';
            contactForm.reset();
        })
        .catch((err) => {
            btn.disabled = false;
            btnText.style.display = 'inline';
            btnSpinner.style.display = 'none';
            formSuccessMsg.textContent = 'Thank you! Your message has been sent.';
            formSuccessMsg.style.display = 'block';
        });
    });
}

// Scroll Down Button Logic
(function() {
    var scrollDownBtn = document.getElementById('scrollDownBtn');
    var splashScreen = document.getElementById('splashScreen');
    function enableScrollBtn() {
        if (scrollDownBtn) {
            scrollDownBtn.onclick = function() {
                var aboutSection = document.getElementById('about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            };
        }
    }
    // If splash screen is present, wait until it's hidden
    if (splashScreen && splashScreen.style.display !== 'none') {
        var observer = new MutationObserver(function() {
            if (splashScreen.style.display === 'none') {
                enableScrollBtn();
                observer.disconnect();
            }
        });
        observer.observe(splashScreen, { attributes: true, attributeFilter: ['style'] });
    } else {
        enableScrollBtn();
    }
})();

// Scroll to Top Button Logic
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
        scrollToTopBtn.classList.remove('hide');
    } else {
        scrollToTopBtn.classList.remove('show');
        scrollToTopBtn.classList.add('hide');
    }
});
scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Animate hero elements when splash screen disappears
(function() {
    var splashScreen = document.getElementById('splashScreen');
    var heroEls = [
        document.querySelector('.hero-profile.hero-animate'),
        document.querySelector('.main-title.hero-animate'),
        document.querySelector('.subtitle.hero-animate'),
        document.querySelector('.hero-social-links.hero-animate'),
        document.querySelector('.scroll-down-btn.hero-animate')
    ];
    function animateHero() {
        heroEls.forEach(function(el, i) {
            if (el) el.classList.add('in');
        });
    }
    if (splashScreen) {
        var observer = new MutationObserver(function() {
            if (splashScreen.style.display === 'none') {
                animateHero();
                observer.disconnect();
            }
        });
        observer.observe(splashScreen, { attributes: true, attributeFilter: ['style'] });
    } else {
        animateHero();
    }
})();

// Card entry animation on scroll
(function() {
    var cards = document.querySelectorAll('.card-animate');
    function animateCards() {
        var windowBottom = window.innerHeight + window.scrollY;
        cards.forEach(function(card) {
            var rect = card.getBoundingClientRect();
            var cardTop = rect.top + window.scrollY;
            if (windowBottom > cardTop + 60) {
                card.classList.add('in');
            }
        });
    }
    window.addEventListener('scroll', animateCards);
    window.addEventListener('resize', animateCards);
    document.addEventListener('DOMContentLoaded', animateCards);
    setTimeout(animateCards, 400); // In case of delayed rendering
})();

// Card Slider with Partial Previews
(function() {
    const track = document.querySelector('.slider-track');
    const cards = Array.from(track.querySelectorAll('.project-card'));
    const leftArrow = document.querySelector('.slider-arrow.left');
    const rightArrow = document.querySelector('.slider-arrow.right');
    let current = 0;
    let interval;

    function updateSlider(index) {
        // Clamp index
        if (index < 0) index = cards.length - 1;
        if (index >= cards.length) index = 0;
        current = index;
        // Center the active card
        const percent = -index * 66; // 60% card + 6% gap
        track.style.transform = `translateX(${percent}%)`;
        // Update active class
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
    }

    function next() {
        updateSlider(current + 1);
    }
    function prev() {
        updateSlider(current - 1);
    }
    function startAuto() {
        interval = setInterval(next, 6000);
    }
    function stopAuto() {
        clearInterval(interval);
    }
    if (leftArrow && rightArrow) {
        leftArrow.addEventListener('click', () => { prev(); stopAuto(); startAuto(); });
        rightArrow.addEventListener('click', () => { next(); stopAuto(); startAuto(); });
    }
    // Init
    updateSlider(0);
    startAuto();
    // Responsive: reset transform on resize
    window.addEventListener('resize', () => updateSlider(current));
})(); 
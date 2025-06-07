document.addEventListener('DOMContentLoaded', function() {
    const apodContainer = document.getElementById('nasa-apod');
    const API_KEY = 'DEMO_KEY'; // Replace with your own API key for production
    const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            apodContainer.innerHTML = '';
            if (data.media_type === 'image') {
                apodContainer.innerHTML = `
                    <img class="nasa-apod-img" src="${data.url}" alt="NASA Astronomy Picture of the Day" />
                    <div class="nasa-apod-title">${data.title}</div>
                    <div class="nasa-apod-date">${data.date}</div>
                    <div class="nasa-apod-desc">${data.explanation}</div>
                `;
            } else if (data.media_type === 'video') {
                apodContainer.innerHTML = `
                    <iframe class="nasa-apod-img" src="${data.url}" frameborder="0" allowfullscreen></iframe>
                    <div class="nasa-apod-title">${data.title}</div>
                    <div class="nasa-apod-date">${data.date}</div>
                    <div class="nasa-apod-desc">${data.explanation}</div>
                `;
            } else {
                apodContainer.innerHTML = '<div class="apod-loading">NASA APOD is not available today.</div>';
            }
        })
        .catch(err => {
            apodContainer.innerHTML = '<div class="apod-loading">Failed to load NASA Picture of the Day.</div>';
        });

    // Like button logic
    const likeBtns = document.querySelectorAll('.like-btn');
    likeBtns.forEach(btn => {
        const postId = btn.getAttribute('data-post-id');
        const countSpan = document.querySelector('.like-count[data-post-id="' + postId + '"]');
        // Get like state and count from localStorage
        let liked = localStorage.getItem('blog_like_' + postId) === '1';
        let count = parseInt(localStorage.getItem('blog_like_count_' + postId) || '0', 10);
        if (liked) btn.classList.add('liked');
        countSpan.textContent = count;
        btn.addEventListener('click', function() {
            liked = !liked;
            btn.classList.toggle('liked', liked);
            if (liked) {
                count++;
            } else {
                count = Math.max(0, count - 1);
            }
            countSpan.textContent = count;
            localStorage.setItem('blog_like_' + postId, liked ? '1' : '0');
            localStorage.setItem('blog_like_count_' + postId, count);
        });
    });

    // NASA Modal logic
    const openNasaModalBtn = document.getElementById('openNasaModal');
    const nasaModal = document.getElementById('nasaModal');
    const closeNasaModalBtn = document.getElementById('closeNasaModal');
    const nasaModalBody = document.getElementById('nasaModalBody');
    const nasaModalOverlay = document.querySelector('.nasa-modal-overlay');
    let apodLoaded = false;

    function openNasaModal() {
        nasaModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        if (!apodLoaded) {
            fetchNasaApod();
            apodLoaded = true;
        }
    }
    function closeNasaModal() {
        nasaModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    openNasaModalBtn.addEventListener('click', openNasaModal);
    closeNasaModalBtn.addEventListener('click', closeNasaModal);
    nasaModalOverlay.addEventListener('click', closeNasaModal);
    document.addEventListener('keydown', function(e) {
        if (nasaModal.style.display === 'block' && (e.key === 'Escape' || e.key === 'Esc')) {
            closeNasaModal();
        }
    });

    function fetchNasaApod() {
        const API_KEY = 'DEMO_KEY'; // Replace with your own API key for production
        const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
        nasaModalBody.innerHTML = '<div class="apod-loading">Loading NASA\'s picture of the day...</div>';
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                if (data.media_type === 'image') {
                    nasaModalBody.innerHTML = `
                        <img class="nasa-apod-img" src="${data.url}" alt="NASA Astronomy Picture of the Day" />
                        <div class="nasa-apod-title">${data.title}</div>
                        <div class="nasa-apod-date">${data.date}</div>
                        <div class="nasa-apod-desc">${data.explanation}</div>
                    `;
                } else if (data.media_type === 'video') {
                    nasaModalBody.innerHTML = `
                        <iframe class="nasa-apod-img" src="${data.url}" frameborder="0" allowfullscreen></iframe>
                        <div class="nasa-apod-title">${data.title}</div>
                        <div class="nasa-apod-date">${data.date}</div>
                        <div class="nasa-apod-desc">${data.explanation}</div>
                    `;
                } else {
                    nasaModalBody.innerHTML = '<div class="apod-loading">NASA APOD is not available today.</div>';
                }
            })
            .catch(err => {
                nasaModalBody.innerHTML = '<div class="apod-loading">Failed to load NASA Picture of the Day.</div>';
            });
    }

    // Theme toggle logic
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const sunRays = themeIcon.querySelector('#sun-rays');
    const moon = themeIcon.querySelector('#moon');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    function setTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            sunRays.style.opacity = '1';
            moon.style.opacity = '0';
        } else {
            document.body.classList.remove('light-theme');
            sunRays.style.opacity = '0';
            moon.style.opacity = '1';
        }
        localStorage.setItem('theme', theme);
    }
    // Set initial theme
    setTheme(savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light'));
    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');
        setTheme(isLight ? 'dark' : 'light');
    });
}); 
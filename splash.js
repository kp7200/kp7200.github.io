// Splash screen logic
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        document.getElementById('splashScreen').classList.add('fade-out');
    }, 1000);
    setTimeout(function() {
        document.getElementById('splashScreen').style.display = 'none';
    }, 1100);
}); 
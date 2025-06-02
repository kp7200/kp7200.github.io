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
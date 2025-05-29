document.addEventListener('DOMContentLoaded', function() {
    // Check if API key exists
    const apiKey = localStorage.getItem('geminiApiKey');
    
    // If no API key is found, redirect to the index page
    if (!apiKey) {
        window.location.href = 'index.html';
    }
    
    // Reset API key button
    document.getElementById('reset-api').addEventListener('click', function() {
        if (confirm('Are you sure you want to reset your API key?')) {
            localStorage.removeItem('geminiApiKey');
            window.location.href = 'index.html';
        }
    });
    
    // Add entrance animation to menu options
    const menuOptions = document.querySelectorAll('.card-option');
    menuOptions.forEach((option, index) => {
        option.style.opacity = '0';
        option.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            option.style.transition = 'all 0.5s ease';
            option.style.opacity = '1';
            option.style.transform = 'translateY(0)';
        }, 100 + (index * 200));
    });
}); 
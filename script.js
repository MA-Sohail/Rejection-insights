document.addEventListener('DOMContentLoaded', function() {
    // Check if API key already exists in local storage
    const savedApiKey = localStorage.getItem('geminiApiKey');
    
    if (savedApiKey) {
        document.getElementById('api-key').value = savedApiKey;
    }
    
    // Save API key to local storage
    document.getElementById('save-api-key').addEventListener('click', function() {
        const apiKey = document.getElementById('api-key').value.trim();
        
        if (apiKey === '') {
            alert('Please enter a valid Gemini API key');
            return;
        }
        
        // Validate API key format (basic validation)
        if (!apiKey.startsWith('AI') && apiKey.length < 10) {
            alert('This doesn\'t look like a valid Gemini API key. Please check and try again.');
            return;
        }
        
        // Save to local storage
        localStorage.setItem('geminiApiKey', apiKey);
        
        // Redirect to main menu immediately without showing an alert
        window.location.href = 'main-menu.html';
    });
}); 
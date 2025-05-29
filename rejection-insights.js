document.addEventListener('DOMContentLoaded', function() {
    // Check if API key exists
    const apiKey = localStorage.getItem('geminiApiKey');
    
    // If no API key is found, redirect to the index page
    if (!apiKey) {
        window.location.href = 'index.html';
        return;
    }
    
    // Job Description Next Button
    document.getElementById('job-description-next').addEventListener('click', function() {
        const jobDescription = document.getElementById('job-description').value.trim();
        
        if (jobDescription === '') {
            alert('Please enter a job description to continue.');
            return;
        }
        
        // Save job description to localStorage
        localStorage.setItem('jobDescription', jobDescription);
        
        // Create next page or show next section
        window.location.href = 'resume-upload.html';
    });
}); 
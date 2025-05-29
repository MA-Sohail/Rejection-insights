document.addEventListener('DOMContentLoaded', function() {
    // Check if API key exists
    const apiKey = localStorage.getItem('geminiApiKey');
    
    // If no API key is found, redirect to the index page
    if (!apiKey) {
        window.location.href = 'index.html';
        return;
    }
    
    // Check if job description exists
    const jobDescription = localStorage.getItem('jobDescription');
    
    if (!jobDescription) {
        window.location.href = 'rejection-insights.html';
        return;
    }
    
    // Back button handler
    document.getElementById('resume-back').addEventListener('click', function() {
        window.location.href = 'rejection-insights.html';
    });
    
    // Resume Next Button
    document.getElementById('resume-next').addEventListener('click', function() {
        const resumeContent = document.getElementById('resume-content').value.trim();
        
        if (resumeContent === '') {
            alert('Please enter your resume content to continue.');
            return;
        }
        
        // Show loading indicator
        document.querySelector('.resume-analysis-status').classList.remove('hidden');
        
        // Disable the next button while analyzing
        this.disabled = true;
        
        // Save resume to localStorage
        localStorage.setItem('resumeContent', resumeContent);
        
        // Here you would typically call Gemini API to analyze the resume against job description
        // For this demo, we'll simulate API analysis with a timeout
        setTimeout(function() {
            // Simulate storing analysis results
            localStorage.setItem('resumeAnalysis', JSON.stringify({
                matchScore: Math.floor(Math.random() * 41) + 60, // Random score between 60-100
                timestamp: new Date().toISOString()
            }));
            
            // Redirect to the interview page
            window.location.href = 'interview.html';
        }, 2000);
    });
}); 
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const analysisLoading = document.getElementById('analysis-loading');
    const analysisResults = document.getElementById('analysis-results');
    const analysisProgress = document.getElementById('analysis-progress');
    const analysisBackBtn = document.getElementById('analysis-back');
    const downloadAnalysisBtn = document.getElementById('download-analysis');
    
    // Check if API key exists
    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
        window.location.href = 'index.html';
        return;
    }
    
    // Check if required data exists
    const jobDescription = localStorage.getItem('jobDescription');
    const resumeContent = localStorage.getItem('resumeContent');
    const interviewTranscript = localStorage.getItem('interviewTranscript');
    
    if (!jobDescription || !resumeContent) {
        window.location.href = 'rejection-insights.html';
        return;
    }
    
    // Navigation
    analysisBackBtn.addEventListener('click', function() {
        window.location.href = 'interview.html';
    });
    
    // Download analysis
    downloadAnalysisBtn.addEventListener('click', function() {
        if (analysisResults.classList.contains('hidden')) {
            alert('Analysis is still in progress. Please wait for it to complete.');
            return;
        }
        
        downloadAnalysisDocument();
    });
    
    // Function to generate analysis
    async function generateAnalysis() {
        try {
            // Simulate progress updates
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 5;
                if (progress > 90) {
                    clearInterval(progressInterval);
                }
                analysisProgress.style.width = `${progress}%`;
            }, 500);
            
            // Parse interview transcript if available
            let interviewQuestionsAndAnswers = 'No interview data available.';
            if (interviewTranscript) {
                try {
                    const transcript = JSON.parse(interviewTranscript);
                    interviewQuestionsAndAnswers = transcript.map((message, index) => {
                        return `${message.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${message.content}`;
                    }).join('\n\n');
                } catch (e) {
                    console.error('Error parsing interview transcript:', e);
                }
            }
            
            // Prepare prompt for Gemini API - modified to prioritize rejection reasons
            const promptText = `
You are a career coach and professional resume reviewer. I'd like you to analyze the following job description and resume to identify potential reasons for rejection and provide actionable advice.

Job Description:
${jobDescription}

Candidate's Resume:
${resumeContent}

Interview Transcript:
${interviewQuestionsAndAnswers}

Based on the materials above, please provide a detailed analysis with the following structure:

1. Most Probable Reasons for Rejection: Identify and explain the top 2-3 most likely reasons why this candidate might have been rejected for this position. Be direct but constructive.

2. Resume-Job Match Score: Provide a match percentage (0-100%) and explain why.

3. Key Skill Gaps: Identify specific skills or qualifications mentioned in the job description that are missing or not clearly demonstrated in the resume.

4. Resume Strengths: Highlight positive aspects of the resume that align well with the position.

5. Areas for Improvement: Suggest specific improvements for the resume to better match the job requirements.

6. Interview Performance Analysis: Analyze the candidate's interview responses and provide feedback on communication, relevance, and overall effectiveness.

7. Recommended Action Steps: Provide 3-5 specific, actionable steps the candidate should take to improve their chances in future applications.

Format your response in a structured way with clear section headings. Be constructive but honest in your feedback.

`;

            // Call Gemini API
            const response = await callGeminiAPI(promptText);
            
            // Process the response
            const analysisHTML = formatAnalysisResponse(response);
            
            // Update the UI
            clearInterval(progressInterval);
            analysisProgress.style.width = '100%';
            
            setTimeout(() => {
                analysisLoading.classList.add('hidden');
                analysisResults.innerHTML = analysisHTML;
                analysisResults.classList.remove('hidden');
            }, 500);
            
        } catch (error) {
            console.error('Error generating analysis:', error);
            analysisLoading.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #f44336; margin-bottom: 15px;"></i>
                    <p>We encountered an error while generating your analysis:</p>
                    <p style="color: #f44336; margin: 10px 0;">${error.message}</p>
                    <button id="retry-analysis" class="primary-button" style="margin-top: 15px;">
                        <i class="fas fa-redo"></i> Retry Analysis
                    </button>
                </div>
            `;
            
            document.getElementById('retry-analysis')?.addEventListener('click', function() {
                window.location.reload();
            });
        }
    }
    
    // Function to call Gemini API
    async function callGeminiAPI(prompt) {
        try {
            const requestPayload = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 8192,
                }
            };
            
            // Make API request
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestPayload)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }
            
            const data = await response.json();
            
            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Invalid response from Gemini API');
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    // Function to format analysis response - updated to include most probable reasons
    function formatAnalysisResponse(responseText) {
        // Store the raw response for download
        localStorage.setItem('analysisRawResponse', responseText);
        
        // Extract match score (if present)
        let matchScore = 0;
        const scoreMatch = responseText.match(/(\d{1,3})%/);
        if (scoreMatch) {
            matchScore = parseInt(scoreMatch[1]);
        }
        
        // Parse and format the response - updated with new section
        const sections = {
            'Most Probable Reasons for Rejection': { icon: 'fa-exclamation-triangle', className: 'rejection-reasons' },
            'Resume-Job Match Score': { icon: 'fa-percentage', className: 'match' },
            'Key Skill Gaps': { icon: 'fa-exclamation-circle', className: 'gaps' },
            'Resume Strengths': { icon: 'fa-star', className: 'strengths' },
            'Areas for Improvement': { icon: 'fa-tools', className: 'improvements' },
            'Interview Performance Analysis': { icon: 'fa-comment-dots', className: 'interview' },
            'Recommended Action Steps': { icon: 'fa-tasks', className: 'improvements' }
        };
        
        let html = `
            <div class="match-score">
                <div class="match-score-label">Overall Match Score</div>
                <div class="match-score-value">${matchScore}%</div>
            </div>
        `;
        
        // Process each section - prioritize rejection reasons
        // First add the rejection reasons section if it exists
        const rejectionSection = 'Most Probable Reasons for Rejection';
        const rejectionRegex = new RegExp(`${rejectionSection}[:\\s]*(.*?)(?=(?:${Object.keys(sections).join('|')})[:\\s]|$)`, 's');
        const rejectionMatch = responseText.match(rejectionRegex);
        
        if (rejectionMatch && rejectionMatch[1]) {
            const sectionContent = rejectionMatch[1].trim();
            html = `
                <div class="section-card rejection-reasons">
                    <h3><i class="fas ${sections[rejectionSection].icon}"></i> ${rejectionSection}</h3>
                    <div class="section-content">
                        ${formatSectionContent(sectionContent)}
                    </div>
                </div>
            ` + html; // Add before the match score
        }
        
        // Then add the rest of the sections (except the rejection section)
        Object.keys(sections).forEach(sectionTitle => {
            if (sectionTitle === rejectionSection) return; // Skip rejection section as we already added it
            
            const sectionRegex = new RegExp(`${sectionTitle}[:\\s]*(.*?)(?=(?:${Object.keys(sections).join('|')})[:\\s]|$)`, 's');
            const sectionMatch = responseText.match(sectionRegex);
            
            if (sectionMatch && sectionMatch[1]) {
                const sectionContent = sectionMatch[1].trim();
                html += `
                    <div class="section-card ${sections[sectionTitle].className}">
                        <h3><i class="fas ${sections[sectionTitle].icon}"></i> ${sectionTitle}</h3>
                        <div class="section-content">
                            ${formatSectionContent(sectionContent)}
                        </div>
                    </div>
                `;
            }
        });
        
        // Add conclusion
        html += `
            <div class="conclusion">
                <p>This analysis is based on the information you provided. For more personalized coaching, consider working with a career professional.</p>
            </div>
        `;
        
        return html;
    }
    
    // Helper function to format section content
    function formatSectionContent(content) {
        // Format lists
        content = content.replace(/^\d+\.\s*(.*?)$/gm, '<li>$1</li>');
        content = content.replace(/^\*\s*(.*?)$/gm, '<li>$1</li>');
        content = content.replace(/^\-\s*(.*?)$/gm, '<li>$1</li>');
        
        // Wrap lists in <ul> tags
        if (content.includes('<li>')) {
            content = '<ul>' + content + '</ul>';
            // Fix multiple <ul> tags
            content = content.replace(/<\/ul>\s*<ul>/g, '');
        }
        
        // Format paragraphs
        content = content.replace(/(.+?)(\n{2,}|$)/g, function(match, p1) {
            if (!p1.includes('<li>') && !p1.includes('<ul>') && !p1.includes('</ul>')) {
                return '<p>' + p1 + '</p>';
            }
            return match;
        });
        
        return content;
    }
    
    // Function to download analysis as HTML
    function downloadAnalysisDocument() {
        const jobTitle = localStorage.getItem('jobTitle') || 'position';
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        // Create HTML content
        const content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rejection Analysis - ${jobTitle}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #4361ee;
            text-align: center;
            margin-bottom: 30px;
        }
        h2 {
            color: #3f37c9;
            margin-top: 30px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        h3 {
            color: #4361ee;
            margin-top: 20px;
        }
        .section-card {
            margin-bottom: 30px;
            padding: 20px;
            background-color: #f9f9f9;
            border-left: 5px solid #4361ee;
            border-radius: 5px;
        }
        .match-score {
            text-align: center;
            font-size: 24px;
            margin: 30px 0;
            padding: 20px;
            background-color: #f0f0f0;
            border-radius: 10px;
        }
        .match-score-value {
            font-size: 48px;
            font-weight: bold;
            color: #4361ee;
        }
        ul {
            margin-bottom: 20px;
        }
        li {
            margin-bottom: 10px;
        }
        .conclusion {
            font-style: italic;
            color: #666;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            font-size: 0.9em;
            color: #777;
        }
    </style>
</head>
<body>
    <h1>Rejection Analysis Report</h1>
    <p><strong>Position:</strong> ${jobTitle}</p>
    <p><strong>Date:</strong> ${date}</p>
    
    ${analysisResults.innerHTML}
    
    <div class="footer">
        <p>Generated by Rejection Insights</p>
    </div>
</body>
</html>
`;

        // Create blob and download link
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rejection-analysis-${jobTitle.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Start the analysis when the page loads
    generateAnalysis();
}); 
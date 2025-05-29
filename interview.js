document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendMessageBtn = document.getElementById('send-message');
    const restartInterviewBtn = document.getElementById('restart-interview');
    const saveTranscriptBtn = document.getElementById('save-transcript');
    const interviewJobTitle = document.getElementById('interview-job-title');
    const interviewBackBtn = document.getElementById('interview-back');
    const interviewNextBtn = document.getElementById('interview-next');
    
    // Variables
    let interviewTranscript = [];
    let interviewInProgress = false;
    let waitingForResponse = false;
    
    // Check if API key exists
    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
        window.location.href = 'index.html';
        return;
    }
    
    // Check if required data exists
    const jobDescription = localStorage.getItem('jobDescription');
    const resumeContent = localStorage.getItem('resumeContent');
    
    if (!jobDescription || !resumeContent) {
        window.location.href = 'rejection-insights.html';
        return;
    }
    
    // Extract job title from description or use default
    const jobTitle = extractJobTitle(jobDescription) || 'Position';
    localStorage.setItem('jobTitle', jobTitle);
    
    // Navigation
    interviewBackBtn.addEventListener('click', function() {
        window.location.href = 'resume-upload.html';
    });
    
    interviewNextBtn.addEventListener('click', function() {
        if (interviewTranscript.length < 4) { // At least 2 exchanges (2 AI + 2 user messages)
            if (!confirm('You\'ve had a very short interview. Are you sure you want to proceed to analysis?')) {
                return;
            }
        }
        window.location.href = 'analysis.html';
    });
    
    // Restart interview
    restartInterviewBtn.addEventListener('click', function() {
        if (interviewTranscript.length > 0) {
            const confirmRestart = confirm('Are you sure you want to restart the interview? Current progress will be lost.');
            if (confirmRestart) {
                resetInterview();
                startInterview();
            }
        } else {
            startInterview();
        }
    });
    
    // Save transcript
    saveTranscriptBtn.addEventListener('click', function() {
        if (interviewTranscript.length === 0) {
            alert('No interview transcript to save.');
            return;
        }
        
        let transcriptText = `# Mock Interview Transcript\n\n`;
        transcriptText += `Job Title: ${localStorage.getItem('jobTitle') || 'N/A'}\n`;
        transcriptText += `Date: ${new Date().toLocaleString()}\n\n`;
        
        interviewTranscript.forEach(message => {
            const role = message.role === 'assistant' ? 'Interviewer' : 'You';
            transcriptText += `## ${role}\n${message.content}\n\n`;
        });
        
        const blob = new Blob([transcriptText], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `interview-transcript-${new Date().toISOString().slice(0, 10)}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Send message
    sendMessageBtn.addEventListener('click', sendUserMessage);
    
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendUserMessage();
        }
    });
    
    // Function to send user message
    function sendUserMessage() {
        if (waitingForResponse) return; // Prevent sending while waiting for response
        
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessageToChat('user', message);
        userInput.value = '';
        
        // Get AI response
        waitingForResponse = true;
        showTypingIndicator();
        
        getAIResponse(message)
            .then(response => {
                hideTypingIndicator();
                addMessageToChat('assistant', response);
            })
            .catch(error => {
                console.error('Error getting AI response:', error);
                hideTypingIndicator();
                alert('Error getting response from AI: ' + error.message);
            })
            .finally(() => {
                waitingForResponse = false;
            });
    }
    
    // Function to add message to chat
    function addMessageToChat(role, content) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${role === 'assistant' ? 'ai' : 'user'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerText = content;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.innerText = new Date().toLocaleTimeString();
        
        messageElement.appendChild(messageContent);
        messageElement.appendChild(messageTime);
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add to transcript
        interviewTranscript.push({
            role: role,
            content: content
        });
        
        // Store transcript in localStorage
        localStorage.setItem('interviewTranscript', JSON.stringify(interviewTranscript));
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.classList.remove('hidden');
        }
    }
    
    // Function to hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.classList.add('hidden');
        }
    }
    
    // Function to get AI response
    async function getAIResponse(userMessage) {
        try {
            const apiKey = localStorage.getItem('geminiApiKey');
            if (!apiKey) {
                throw new Error('API key not found. Please verify your API key in the first step.');
            }

            const jobTitle = localStorage.getItem('jobTitle') || 'the position';
            const jobDescription = localStorage.getItem('jobDescription') || '';
            const resumeContent = localStorage.getItem('resumeContent') || '';

            const systemInstructionText = `
You are a seasoned HR professional with extensive experience in conducting interviews for various job titles across multiple industries. Your approach is friendly yet professional, ensuring candidates feel comfortable while also challenging them with insightful questions.

Your task is to conduct a mock interview for the position of ${jobTitle}. Please ask questions one at a time and wait for the candidate's response before proceeding to the next question.

The interview should begin with a brief introduction about the company and the role, followed by a series of relevant questions that assess the candidate's skills, experience, and fit for the position.

Example Introduction: "Welcome to the interview for the ${jobTitle} position at our company. We are excited to learn more about you. Let's start with an overview of your professional background."

Be sure to tailor your questions to the specific job title and focus on key competencies that are essential for success in that role.

Job Description: ${jobDescription}

Candidate Resume: ${resumeContent}

Constraints:
- Avoid asking overly personal questions.
- Ensure questions are relevant to the job title and responsibilities.
- Do not rush through the interview; allow time for thoughtful responses.
- Ask one question at a time and wait for the candidate's response.
`;

            // Prepare message history for API
            const messageHistory = [...interviewTranscript];
            
            // Add the new user message
            if (userMessage !== 'Start the interview') {
                messageHistory.push({
                    role: 'user',
                    content: userMessage
                });
            }
            
            // Format for Gemini API
            const contents = messageHistory.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }]
            }));
            
            // Create request payload
            const requestPayload = {
                contents: contents,
                systemInstruction: {
                    parts: [{ text: systemInstructionText }]
                },
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                }
            };
            
            // Special case for starting the interview
            if (userMessage === 'Start the interview' || contents.length === 0) {
                requestPayload.contents = [{
                    role: 'user',
                    parts: [{ text: 'Hello, I am here for the interview.' }]
                }];
            }
            
            // Make API request
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=`+apiKey, {
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
    
    // Function to start interview
    function startInterview() {
        if (!chatMessages || !interviewJobTitle) return;

        chatMessages.innerHTML = ''; // Clear chat
        
        chatMessages.innerHTML = `
            <div class="loading-indicator" style="text-align: center; padding: 20px;">
                <div class="loading-spinner" style="/* Add spinner styles if needed */"></div>
                <p>Preparing your interview...</p>
            </div>
        `;
        
        const jobTitle = localStorage.getItem('jobTitle');
        interviewJobTitle.textContent = jobTitle || 'Interview';
        interviewTranscript = []; // Reset transcript
        interviewInProgress = true;
        waitingForResponse = true; // Set waiting flag as we are about to make a call
        
        // Get initial message from AI
        setTimeout(() => {
            if (chatMessages.querySelector('.loading-indicator')) {
                 chatMessages.innerHTML = ''; // Clear loading indicator
            }
            showTypingIndicator();
            
            getAIResponse('Start the interview') // This special message signals the start
                .then(response => {
                    hideTypingIndicator();
                    addMessageToChat('assistant', response);
                })
                .catch(error => {
                    console.error('Error starting interview:', error);
                    hideTypingIndicator();
                    chatMessages.innerHTML = `
                        <div class="message ai">
                            <div class="message-content">
                                Sorry, I couldn't start the interview: ${error.message}. Please check your API key and try again.
                            </div>
                            <div class="message-time">
                                ${new Date().toLocaleTimeString()}
                            </div>
                        </div>
                    `;
                })
                .finally(() => {
                    waitingForResponse = false; // Reset waiting flag
                });
        }, 500);
    }
    
    // Function to reset interview
    function resetInterview() {
        interviewInProgress = false;
        interviewTranscript = [];
        waitingForResponse = false;
        if (chatMessages) chatMessages.innerHTML = '';
        hideTypingIndicator();
        localStorage.removeItem('interviewTranscript');
    }
    
    // Helper function to extract job title from description
    function extractJobTitle(description) {
        // Try to find common job title patterns
        const titlePatterns = [
            /position:?\s*([^.,\n]+)/i,
            /job title:?\s*([^.,\n]+)/i,
            /title:?\s*([^.,\n]+)/i,
            /role:?\s*([^.,\n]+)/i,
            /for\s+(?:a|the)\s+([^.,\n]+?)(?:\s+position|\s+role|\s+job)/i
        ];
        
        for (const pattern of titlePatterns) {
            const match = description.match(pattern);
            if (match && match[1]) {
                return match[1].trim();
            }
        }
        
        // Fallback: take the first 5 words if they look like a title
        const firstLine = description.split('\n')[0];
        if (firstLine && firstLine.length < 100) {
            return firstLine.trim();
        }
        
        return 'Position';
    }
    
    // Start the interview when the page loads
    startInterview();
}); 
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiClient = {
  async generateContent(prompt) {
    try {
      console.log('📤 Sending request to Gemini API...');
      console.log('🔑 API Key present:', !!process.env.GEMINI_API_KEY);
      console.log('📝 Prompt length:', prompt?.length || 0);
      
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured in environment variables');
      }
      
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      console.log('✅ Gemini API JSON Response:');
      console.log(JSON.stringify(response, null, 2));
      
      // Parse response according to Gemini 2.0 format
      let text = '';
      
      // Method 1: Try using response.text() method
      try {
        text = response.text();
        console.log('📊 Using response.text() method');
      } catch (e) {
        // Method 2: Parse from candidates structure
        console.log('📊 Parsing from candidates structure');
        if (response.candidates && 
            response.candidates[0] && 
            response.candidates[0].content && 
            response.candidates[0].content.parts && 
            response.candidates[0].content.parts[0]) {
          text = response.candidates[0].content.parts[0].text;
        } else {
          throw new Error('Invalid response structure from Gemini API');
        }
      }
      
      console.log('💬 Simplified text output:', text);
      console.log('📏 Response length:', text?.length || 0);
      
      // Log metadata for monitoring
      if (response.usageMetadata) {
        console.log('📈 Token usage:', {
          prompt: response.usageMetadata.promptTokenCount,
          response: response.usageMetadata.candidatesTokenCount,
          total: response.usageMetadata.totalTokenCount
        });
      }
      
      if (response.modelVersion) {
        console.log('🤖 Model version:', response.modelVersion);
      }
      
      return text;
    } catch (error) {
      console.error('❌ Gemini API Error:', error.message);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        status: error.status,
        statusText: error.statusText,
      });
      throw new Error(`Gemini API failed: ${error.message}`);
    }
  },

  async analyzeResume(resumeText) {
    const prompt = `Analyze this resume and provide:
1. A score from 0-100 for overall quality
2. Key strengths (3-5 points)
3. Areas for improvement (2-3 points)
4. Recommended keywords to add

Resume:
${resumeText}

Respond in JSON format with keys: score, strengths, improvements, keywords`;

    return this.generateContent(prompt);
  },

  async generateBlogSummary(blogContent) {
    const prompt = `Create a concise SEO-optimized summary (2-3 sentences) for this blog post:

Title: ${blogContent.title}
Content: ${blogContent.content}

Summary should be engaging and include relevant keywords.`;

    return this.generateContent(prompt);
  },

  async evaluateExamAnswers(answers, questions) {
    const prompt = `Evaluate the following exam answers and provide detailed feedback:

Questions and Answers:
${JSON.stringify({ answers, questions }, null, 2)}

Provide:
1. Score (0-100)
2. Detailed feedback for each answer
3. Areas of strength
4. Areas needing improvement

Respond in JSON format.`;

    return this.generateContent(prompt);
  },

  async analyzeCheatBehavior(violations) {
    const prompt = `Analyze the following exam integrity violations and determine cheating probability:

Violations: ${violations.join(', ')}

Provide:
1. Probability of cheating (0-100)
2. Severity level (low, medium, high)
3. Explanation
4. Recommended action

Respond in JSON format with keys: probability, severity, explanation, recommendation`;

    return this.generateContent(prompt);
  },

  async generateAIInsights(analyticsData) {
    const prompt = `Based on this analytics data, provide 3-4 actionable insights:

Data: ${JSON.stringify(analyticsData, null, 2)}

Insights should be specific and actionable.`;

    return this.generateContent(prompt);
  },

  async generateEmailContent(type, recipientName, context) {
    let prompt = '';
    
    if (type === 'selection') {
      prompt = `Write a professional and warm congratulations email for a job candidate:
      
Candidate Name: ${recipientName}
Position: ${context.position}

Make it personalized, professional, and include next steps.`;
    } else if (type === 'rejection') {
      prompt = `Write a professional rejection email for a job candidate:
      
Candidate Name: ${recipientName}
Position: ${context.position}

Make it professional, respectful, and encouraging for future applications.`;
    } else if (type === 'interview') {
      prompt = `Write an interview invitation email for a job candidate:
      
Candidate Name: ${recipientName}
Position: ${context.position}

Include enthusiasm, next steps, and contact information.`;
    } else if (type === 'contact_reply') {
      prompt = `Write a professional auto-reply email for a contact form submission:

Subject: ${context.subject}
Message: ${context.message}

Write a warm, professional response acknowledging their message and confirming follow-up.`;
    }

    return this.generateContent(prompt);
  },
};

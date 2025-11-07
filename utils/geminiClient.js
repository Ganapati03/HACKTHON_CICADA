import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiClient = {
  async generateContent(prompt) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
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

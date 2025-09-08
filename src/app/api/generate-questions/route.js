// app/api/generate-questions/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { topic, questionCount = 3, difficulty = 'medium' } = body;

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // Fallback questions when no API key
      const fallbackQuestions = [
        `What are the fundamental principles and core concepts of ${topic}?`,
        `How does ${topic} impact modern society and current practices?`,
        `What are the main challenges and opportunities in ${topic} today?`,
        `How has ${topic} evolved over time and what are future trends?`,
        `What are the practical applications and real-world uses of ${topic}?`
      ];
      
      return NextResponse.json({ 
        questions: fallbackQuestions.slice(0, questionCount),
        fallback: true,
        message: 'Using fallback questions - OpenAI API key not configured'
      });
    }

    // OpenAI API call
    const systemPrompt = `You are an expert question generator. Generate exactly ${questionCount} thoughtful, specific questions about the topic "${topic}". 

The questions should:
- Be clear and specific
- Encourage deep thinking and exploration
- Cover different aspects of the topic
- Be appropriate for ${difficulty} difficulty level
- End with a question mark

Return only a JSON object with this format:
{
  "questions": ["Question 1?", "Question 2?", "Question 3?"]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate ${questionCount} questions about: ${topic}` }
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    try {
      const result = JSON.parse(content);
      if (result.questions && Array.isArray(result.questions)) {
        return NextResponse.json({ 
          questions: result.questions,
          success: true 
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (parseError) {
      // Fallback if JSON parsing fails
      const lines = content.split('\n').filter(line => line.includes('?'));
      const extractedQuestions = lines.slice(0, questionCount).map(line => 
        line.replace(/^\d+\.?\s*/, '').replace(/^[-*]\s*/, '').trim()
      );
      
      return NextResponse.json({ 
        questions: extractedQuestions.length > 0 ? extractedQuestions : [
          `What are the key aspects of ${topic}?`,
          `How does ${topic} work in practice?`,
          `What are the implications of ${topic}?`
        ].slice(0, questionCount),
        success: true,
        parsed: false
      });
    }

  } catch (error) {
    console.error('Error generating questions:', error);
    
    // Emergency fallback
    const { topic = 'this topic', questionCount = 3 } = await request.clone().json().catch(() => ({}));
    
    return NextResponse.json({
      questions: [
        `What are the fundamental concepts of ${topic}?`,
        `How does ${topic} work in practice?`,
        `What are the main applications of ${topic}?`
      ].slice(0, questionCount),
      error: 'Using fallback due to API error',
      fallback: true
    });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Question Generation API is operational',
    hasApiKey: !!process.env.OPENAI_API_KEY,
    timestamp: new Date().toISOString()
  });
}
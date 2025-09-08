// app/api/generate-answer/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { question, difficulty = 'medium' } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // Fallback answer when no API key
      const fallbackResponse = {
        answer: `This is a comprehensive answer about "${question}". 

The topic involves multiple important aspects that are worth understanding in depth. Current research and practical experience suggest several key findings that help us understand this concept better.

Key considerations include:
- Fundamental principles and core concepts
- Historical development and evolution  
- Current applications and real-world use cases
- Future trends and emerging developments
- Challenges and potential solutions
- Best practices and recommendations

Understanding these aspects provides a solid foundation for further exploration and practical application. The field continues to evolve with new discoveries and applications being developed regularly.`,
        
        keyPoints: [
          'Understanding core principles is essential for mastery',
          'Historical context provides valuable perspective',
          'Current applications demonstrate practical value',
          'Future developments show promising directions',
          'Challenges exist but solutions are emerging'
        ],
        
        references: [
          {
            title: 'Academic Research on the Topic',
            author: 'Research Institute',
            type: 'research'
          },
          {
            title: 'Practical Applications Guide',
            author: 'Industry Experts',
            type: 'guide'
          }
        ],
        
        fallback: true,
        message: 'Using fallback answer - OpenAI API key not configured'
      };
      
      return NextResponse.json(fallbackResponse);
    }

    // OpenAI API call
    const systemPrompt = `You are an expert knowledge assistant. Provide a comprehensive answer to the question with structured information.

Return your response as a JSON object with this exact format:
{
  "answer": "A detailed, well-structured answer (2-4 paragraphs)",
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
  "references": [
    {
      "title": "Reference Title",
      "author": "Author Name", 
      "type": "book|paper|article|website|research"
    }
  ]
}

Make the answer informative, accurate, and engaging. Include 4-5 key points and 2-3 credible references.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: difficulty === 'high' ? 'gpt-4' : 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please provide a comprehensive answer to: ${question}` }
        ],
        max_tokens: 1200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    try {
      const result = JSON.parse(content);
      
      // Validate structure
      if (result.answer && Array.isArray(result.keyPoints) && Array.isArray(result.references)) {
        return NextResponse.json({ 
          ...result,
          success: true 
        });
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (parseError) {
      // Fallback if JSON parsing fails - use plain text response
      return NextResponse.json({
        answer: content,
        keyPoints: [
          'This response was provided as plain text',
          'Consider the information provided as a comprehensive overview',
          'Additional research may provide more detailed insights',
          'Multiple perspectives can enhance understanding'
        ],
        references: [
          {
            title: 'AI-Generated Response',
            author: 'OpenAI Assistant',
            type: 'ai-response'
          }
        ],
        success: true,
        parsed: false
      });
    }

  } catch (error) {
    console.error('Error generating answer:', error);
    
    // Emergency fallback
    const { question = 'the topic' } = await request.clone().json().catch(() => ({}));
    
    return NextResponse.json({
      answer: `This question about "${question}" requires comprehensive analysis. While experiencing technical difficulties, the topic involves multiple important considerations including fundamental concepts, practical applications, current developments, and future implications. Further research from authoritative sources would provide more detailed insights.`,
      keyPoints: [
        'This topic requires comprehensive research and analysis',
        'Multiple academic perspectives should be considered',
        'Practical applications demonstrate real-world relevance',
        'Current developments show ongoing evolution'
      ],
      references: [
        {
          title: 'Academic Research Databases',
          author: 'Various Researchers',
          type: 'database'
        }
      ],
      error: 'Using fallback due to API error',
      fallback: true
    });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Answer Generation API is operational',
    hasApiKey: !!process.env.OPENAI_API_KEY,
    timestamp: new Date().toISOString()
  });
}
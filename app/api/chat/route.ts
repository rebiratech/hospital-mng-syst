import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured in environment variables.');
      return NextResponse.json(
        { reply: 'API key setup incomplete. Please check Netlify settings.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const { message } = await req.json();

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: message,
      config: {
        systemInstruction:
          'You are a helpful hospital triage assistant. Provide preliminary guidance based on user symptoms, ask clarifying questions, and advise professional care when needed.',
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { reply: 'Sorry, I am having trouble processing your symptoms right now.' },
      { status: 500 }
    );
  }
}
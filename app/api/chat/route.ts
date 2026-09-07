import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: 'You are a helpful hospital triage assistant. Provide preliminary guidance based on user symptoms, ask clarifying questions, and advise seeing a doctor or seeking emergency care if symptoms are severe. Keep answers clear, empathetic, and concise.',
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    return NextResponse.json({ reply: 'Sorry, I am having trouble processing your symptoms right now.' }, { status: 500 });
  }
}
'use client';

import React, { useState } from 'react';
import {
  Phone,
  Heart,
  Sparkles,
  Send,
  Bot,
  User,
  Clock,
  Shield,
  MapPin,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content:
        'Hello! Welcome to Ketema Health Centre. I am your AI Health Assistant. Please describe your symptoms or select a quick option below, and I will give you preliminary guidance.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick symptom chips to speed up user input
  const quickSymptoms = [
    'I have a severe headache',
    'Fever and sore throat',
    'Mild stomach pain',
    'Cough and congestion',
  ];

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: messageText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Sorry, I am having trouble processing your symptoms right now. Please try again or call us directly at 0923055713.',
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, a connection error occurred. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          'Chat history cleared. How else can Ketema Health Centre assist you today?',
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      {/* Top Banner / Contact Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs sm:text-sm py-2 px-6 flex justify-between items-center shadow-inner">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium truncate">
            Compassionate Care Meets AI Innovation
          </span>
        </div>
        <div className="flex items-center space-x-6 shrink-0">
          <a
            href="tel:0923055713"
            className="flex items-center space-x-1.5 hover:text-white transition font-semibold"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>0923055713</span>
          </a>
          <span className="hidden md:inline-flex items-center space-x-1 text-emerald-300">
            <Clock className="w-4 h-4 mr-1" /> 24/7 Triage
          </span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 text-white p-2.5 rounded-2xl shadow-md shadow-emerald-600/20">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Ketema Health Centre
            </h1>
            <p className="text-xs text-emerald-600 font-medium">
              Excellence in Patient Care
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="tel:0923055713"
            className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm flex items-center space-x-2"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Call Us:</span>
            <span>0923055713</span>
          </a>
        </div>
      </header>

      {/* Hero & Content Container */}
      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {/* Inspirational Quote Section */}
        <section className="text-center space-y-3">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full inline-block uppercase tracking-wider">
            Welcome to Ketema Health
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Your Health, Our Sacred Priority.
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto italic">
            &ldquo;The art of healing comes from nature, not from the physician. Therefore the physician must start from nature, with an open mind.&rdquo;
          </p>
        </section>

        {/* Emergency Notice Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 text-amber-900 text-xs sm:text-sm shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Medical Disclaimer: </span>
            This AI assistant provides general information only and is not a substitute for professional medical advice. For immediate life-threatening emergencies, please call emergency services or contact our primary desk at <strong className="underline">0923055713</strong>.
          </div>
        </div>

        {/* AI Symptom Checker Container */}
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col h-[550px]">
          {/* Chat Window Header */}
          <div className="bg-emerald-50 border-b border-emerald-100 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-600 text-white p-2 rounded-xl">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  AI Medical Triage Assistant
                </h3>
                <p className="text-xs text-slate-500">
                  Instant symptom analysis & guidance
                </p>
              </div>
            </div>

            {/* Clear Chat Action */}
            <button
              onClick={handleClearChat}
              className="text-slate-400 hover:text-red-500 p-2 rounded-lg transition"
              title="Clear Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="bg-emerald-600 text-white p-1.5 rounded-lg text-xs mt-1 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="bg-slate-700 text-white p-1.5 rounded-lg text-xs mt-1 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs pl-2">
                <Bot className="w-4 h-4 animate-bounce text-emerald-600" />
                <span>Ketema AI is analyzing your symptoms...</span>
              </div>
            )}
          </div>

          {/* Quick Symptom Chips */}
          <div className="px-4 py-2 bg-slate-100/60 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-slate-500 shrink-0 flex items-center">
              <Sparkles className="w-3 h-3 mr-1 text-emerald-600" /> Suggestions:
            </span>
            {quickSymptoms.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(chip)}
                disabled={loading}
                className="text-xs bg-white border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-3 py-1.5 rounded-full transition shrink-0 shadow-2xs"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-slate-200 flex space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms (e.g., severe headache, fever)..."
              className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>

        {/* Facility Info Card Grid */}
        <section className="grid md:grid-cols-3 gap-4 pt-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start space-x-3">
            <Clock className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Working Hours</h4>
              <p className="text-xs text-slate-500 mt-0.5">Open 24/7 for Emergency & Triage Support</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start space-x-3">
            <Phone className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Direct Line</h4>
              <p className="text-xs text-slate-500 mt-0.5">Call 0923055713 for direct appointments</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start space-x-3">
            <Shield className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Certified Care</h4>
              <p className="text-xs text-slate-500 mt-0.5">Licensed physicians & quality standard</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-6 border-t border-slate-800 text-xs">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-white">Ketema Health Centre</span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Main Clinic
            </span>
            <a
              href="tel:0923055713"
              className="flex items-center hover:text-white transition"
            >
              <Phone className="w-3.5 h-3.5 mr-1 text-emerald-500" /> 0923055713
            </a>
          </div>
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} Ketema Health Centre. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
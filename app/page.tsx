'use client';

import React, { useState } from 'react';
import { Phone, Heart, Sparkles, Send, Bot, User, Clock, Shield, MapPin, Calendar, Info, MessageSquare } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'info' | 'triage' | 'reservation'>('triage');

  // Chat State
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! Welcome to Ketema Health Centre. I am your AI Health Assistant. Please describe your symptoms for guidance.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Reservation State
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', department: 'General Checkup' });

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, I am having trouble processing your symptoms. Please call 0923055713.' },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Top Contact Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs sm:text-sm py-2 px-6 flex justify-between items-center shadow-inner">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="font-medium">Compassionate Care Meets AI Innovation</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="tel:0923055713" className="flex items-center space-x-1.5 hover:text-white transition font-semibold">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>0923055713</span>
          </a>
          <span className="hidden md:inline-flex items-center space-x-1 text-emerald-300">
            <Clock className="w-4 h-4 mr-1" /> 24/7 Triage
          </span>
        </div>
      </div>

      {/* Main Header & Navigation */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-md">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Ketema Health Centre</h1>
            <p className="text-xs text-emerald-600 font-medium">Excellence in Patient Care</p>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <nav className="flex bg-slate-100 p-1 rounded-xl text-sm font-medium">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'info' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>About & Info</span>
          </button>

          <button
            onClick={() => setActiveTab('triage')}
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'triage' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Symptom Checker</span>
          </button>

          <button
            onClick={() => setActiveTab('reservation')}
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'reservation' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </nav>
      </header>

      {/* Main Content Areas */}
      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Quote Banner Header */}
        <section className="text-center space-y-2 mb-8">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full inline-block uppercase tracking-wider">
            Ketema Health Centre
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">Your Health, Our Sacred Priority.</h2>
          <p className="text-sm text-slate-600 italic">
            &ldquo;The art of healing comes from nature, not from the physician. Therefore the physician must start from nature, with an open mind.&rdquo;
          </p>
        </section>

        {/* PAGE 1: INFO PAGE */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">About Ketema Health Centre</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Ketema Health Centre is dedicated to delivering high-quality medical services combined with modern AI technology. Our team ensures fast triage, professional appointments, and compassionate medical care.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <Clock className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Working Hours</h4>
                <p className="text-xs text-slate-500 mt-1">24/7 Triage & Emergency Services</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <Phone className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Direct Phone</h4>
                <p className="text-xs text-slate-500 mt-1">Call 0923055713 for direct support</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <Shield className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Quality Assurance</h4>
                <p className="text-xs text-slate-500 mt-1">Certified clinical staff and facilities</p>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: AI TRIAGE MODULE */}
        {activeTab === 'triage' && (
          <section className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col h-[500px]">
            <div className="bg-emerald-50 border-b border-emerald-100 p-4 flex items-center space-x-3">
              <div className="bg-emerald-600 text-white p-2 rounded-xl">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">AI Medical Triage Assistant</h3>
                <p className="text-xs text-slate-500">Describe symptoms for preliminary guidance</p>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start space-x-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="bg-emerald-600 text-white p-1.5 rounded-lg text-xs mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="bg-slate-700 text-white p-1.5 rounded-lg text-xs mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <Bot className="w-4 h-4 animate-bounce text-emerald-600" />
                  <span>Analyzing symptoms...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleChatSubmit} className="p-3 bg-white border-t border-slate-200 flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your symptoms (e.g., severe headache, fever)..."
                className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
              <button type="submit" disabled={loading || !input.trim()} className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </section>
        )}

        {/* PAGE 3: RESERVATION PAGE */}
        {activeTab === 'reservation' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md max-w-lg mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Book an Appointment</h3>
            <p className="text-xs text-slate-500 mb-6">Schedule your clinical visit with Ketema Health Centre.</p>

            {bookingSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-sm space-y-2">
                <p className="font-bold">Reservation Submitted!</p>
                <p>Thank you, {formData.name}. Our receptionist will contact you at {formData.phone} to confirm your appointment time.</p>
                <button onClick={() => setBookingSuccess(false)} className="text-xs font-semibold text-emerald-700 underline mt-2 block">
                  Book another appointment
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0923055713"
                    className="w-full px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>General Checkup</option>
                    <option>Pediatrics</option>
                    <option>Internal Medicine</option>
                    <option>Emergency Consultation</option>
                  </select>
                </div>

                <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-2.5 rounded-xl hover:bg-emerald-700 transition">
                  Confirm Reservation
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-6 border-t border-slate-800 text-xs">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-white">Ketema Health Centre</span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Main Clinic</span>
            <a href="tel:0923055713" className="flex items-center hover:text-white transition">
              <Phone className="w-3.5 h-3.5 mr-1 text-emerald-500" /> 0923055713
            </a>
          </div>
          <p className="text-slate-500">&copy; {new Date().getFullYear()} Ketema Health Centre. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
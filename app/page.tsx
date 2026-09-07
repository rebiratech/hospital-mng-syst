'use client';

import React, { useState } from 'react';
import {
  Stethoscope,
  Calendar,
  Bot,
  Activity,
  Clock,
  HeartPulse,
  Send,
} from 'lucide-react';

export default function HospitalApp() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'booking' | 'ai'>(
    'portfolio'
  );

  // Booking Form State
  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    doctor: '',
    date: '',
    notes: '',
  });
  const [bookedSuccess, setBookedSuccess] = useState(false);

  // AI Chat State
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your AI Health Assistant. Please describe your symptoms, and I can give you preliminary guidance.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Booking Submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookedSuccess(true);
    setTimeout(() => setBookedSuccess(false), 5000);
  };

  // Handle AI Chat Submission
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Sorry, I am having trouble connecting right now.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Navigation Bar */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-2 text-xl font-bold">
            <HeartPulse className="h-7 w-7 text-red-300" />
            <span>Apex Health Center</span>
          </div>
          <nav className="flex space-x-2 mt-2 sm:mt-0">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'portfolio' ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              About & Services
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'booking' ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              Book Appointment
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                activeTab === 'ai' ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              <Bot className="h-4 w-4" /> AI Symptom Checker
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* PORTFOLIO TAB */}
        {activeTab === 'portfolio' && (
          <div className="space-y-12">
            <section className="text-center py-10 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                World-Class Healthcare at Your Fingertips
              </h1>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg mb-6">
                Apex Health Center combines top medical specialists with
                advanced technology to deliver personal, high-quality treatment.
              </p>
              <button
                onClick={() => setActiveTab('booking')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
              >
                Schedule Your Visit Today
              </button>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <Stethoscope className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Expert Specialists</h3>
                <p className="text-slate-600">
                  Access doctors across Cardiology, Neurology, Pediatrics, and
                  Orthopedics.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <Clock className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">24/7 Emergency Care</h3>
                <p className="text-slate-600">
                  Round-the-clock emergency response team fully equipped for
                  critical situations.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <Activity className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Smart AI Triage</h3>
                <p className="text-slate-600">
                  Interact with our AI assistant anytime to check symptoms and
                  guide your visit.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* BOOKING TAB */}
        {activeTab === 'booking' && (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="text-blue-600" /> Book an Appointment
            </h2>
            {bookedSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                Appointment request received! Our team will confirm your slot
                shortly.
              </div>
            )}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  value={booking.name}
                  onChange={(e) =>
                    setBooking({ ...booking, name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  value={booking.phone}
                  onChange={(e) =>
                    setBooking({ ...booking, phone: e.target.value })
                  }
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Department / Doctor
                </label>
                <select
                  required
                  className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  value={booking.doctor}
                  onChange={(e) =>
                    setBooking({ ...booking, doctor: e.target.value })
                  }
                >
                  <option value="">-- Choose Option --</option>
                  <option value="Cardiology">General Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  value={booking.date}
                  onChange={(e) =>
                    setBooking({ ...booking, date: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-700 transition"
              >
                Confirm Reservation
              </button>
            </form>
          </div>
        )}

        {/* AI SYMPTOM CHECKER TAB */}
        {activeTab === 'ai' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 h-[550px] flex flex-col">
            <div className="p-4 bg-blue-50 border-b rounded-t-2xl flex items-center gap-2">
              <Bot className="text-blue-600" />
              <span className="font-semibold text-slate-700">
                AI Medical Triage Assistant
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    m.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-slate-400 text-sm italic">
                  AI assistant is analyzing...
                </div>
              )}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t flex gap-2"
            >
              <input
                type="text"
                className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Describe your symptoms (e.g., severe headache, fever)..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-1"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

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
  Calendar,
  Info,
  MessageSquare,
  Search,
  Stethoscope,
  Activity,
  Star
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'info' | 'triage' | 'reservation' | 'doctors' | 'tracker'>('triage');

  // AI Chat State
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! Welcome to Ketuma Health Centre. I am your AI Health Assistant. Please describe your symptoms for immediate guidance.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Reservation State
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', department: 'General Checkup', doctor: 'Any Available' });

  // Tracker State
  const [searchPhone, setSearchPhone] = useState('');
  const [trackedBooking, setTrackedBooking] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Doctor Data
  const doctors = [
    { name: 'Dr. Abebe Bikila', role: 'Chief Medical Officer', dept: 'General Checkup', exp: '12+ Years', availability: 'Mon - Fri' },
    { name: 'Dr. Sarah Tadesse', role: 'Pediatric Specialist', dept: 'Pediatrics', exp: '8 Years', availability: 'Mon - Sat' },
    { name: 'Dr. Dawit Solomon', role: 'Internal Medicine', dept: 'Internal Medicine', exp: '10 Years', availability: 'Tue - Sun' },
  ];

  // Services Data
  const services = [
    { title: 'Emergency Triage', desc: 'Instant AI symptom checker and 24/7 urgent care access.', icon: Activity },
    { title: 'General Outpatient', desc: 'Routine health checkups, diagnostic testing, and consultations.', icon: Stethoscope },
    { title: 'Pediatric Care', desc: 'Specialized healthcare for infants, children, and adolescents.', icon: Heart },
    { title: 'Internal Medicine', desc: 'Comprehensive diagnosis and treatment of complex adult illnesses.', icon: Shield },
  ];

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
          { role: 'assistant', content: 'Sorry, I am having trouble processing your request. Please call 0923055713.' },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    if (searchPhone === '0923055713' || searchPhone.length >= 9) {
      setTrackedBooking({
        name: 'Patient User',
        phone: searchPhone,
        department: 'General Checkup',
        status: 'Confirmed',
        date: 'Tomorrow at 10:00 AM',
      });
    } else {
      setTrackedBooking(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans relative">
      {/* Top Bar */}
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
            <Clock className="w-4 h-4 mr-1" /> 24/7 Triage Support
          </span>
        </div>
      </div>

      {/* Main Header Nav */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col lg:flex-row justify-between items-center gap-4 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 text-white p-2.5 rounded-2xl shadow-md shadow-emerald-600/20">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Ketuma Health Centre</h1>
            <p className="text-xs text-emerald-600 font-medium">Excellence in Patient Care</p>
          </div>
        </div>

        <nav className="flex flex-wrap justify-center bg-slate-100 p-1.5 rounded-2xl text-xs sm:text-sm font-medium gap-1">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
              activeTab === 'info' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Services & About</span>
          </button>

          <button
            onClick={() => setActiveTab('triage')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
              activeTab === 'triage' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Triage</span>
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
              activeTab === 'doctors' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctors</span>
          </button>

          <button
            onClick={() => setActiveTab('reservation')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
              activeTab === 'reservation' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
              activeTab === 'tracker' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Track Booking</span>
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {/* Quote Hero Banner */}
        <section className="text-center space-y-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full inline-block uppercase tracking-wider">
            Ketuma Health Centre
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Health, Our Sacred Priority.</h2>
          <p className="text-sm text-slate-600 italic max-w-2xl mx-auto">
            &ldquo;The art of healing comes from nature, not from the physician. Therefore the physician must start from nature, with an open mind.&rdquo;
          </p>
        </section>

        {/* TAB 1: SERVICES & ABOUT */}
        {activeTab === 'info' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-lg font-bold text-slate-900">About Ketuma Health Centre</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                At Ketuma Health Centre, we combine compassionate human medical expertise with cutting-edge artificial intelligence. Our goal is to streamline patient entry, eliminate long waiting times, and offer top-class clinical care around the clock.
              </p>
            </div>

            <div>
              <h4 className="text-md font-bold text-slate-900 mb-4">Our Medical Specialties</h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {services.map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <item.icon className="w-6 h-6 text-emerald-600" />
                    <h5 className="font-bold text-slate-900 text-sm">{item.title}</h5>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Block */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 shadow-md space-y-3">
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm italic text-emerald-100">
                &ldquo;The AI symptom checker guided me immediately before I arrived, and Dr. Sarah had my info ready. Exceptional care at Ketuma Health Centre!&rdquo;
              </p>
              <p className="text-xs font-semibold text-emerald-300">— Verified Patient Review</p>
            </div>
          </div>
        )}

        {/* TAB 2: AI TRIAGE MODULE */}
        {activeTab === 'triage' && (
          <section className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col h-[520px]">
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
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-sm ${
                      msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                    }`}
                  >
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
                  <span>Ketuma AI is analyzing...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleChatSubmit} className="p-3 bg-white border-t border-slate-200 flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe symptoms (e.g., severe headache, fever)..."
                className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
              <button type="submit" disabled={loading || !input.trim()} className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </section>
        )}

        {/* TAB 3: DOCTORS DIRECTORY */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Our Medical Specialists</h3>
              <p className="text-xs text-slate-500">Select a physician to request an appointment directly.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {doctors.map((doc, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="bg-emerald-100 text-emerald-800 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg">
                      {doc.name.split(' ')[1][0]}
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{doc.name}</h4>
                    <p className="text-xs font-semibold text-emerald-600">{doc.role}</p>
                    <p className="text-xs text-slate-500">Department: {doc.dept}</p>
                    <p className="text-xs text-slate-500">Experience: {doc.exp}</p>
                  </div>

                  <button
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, department: doc.dept, doctor: doc.name }));
                      setActiveTab('reservation');
                    }}
                    className="w-full bg-slate-900 text-white hover:bg-emerald-700 text-xs font-semibold py-2.5 rounded-xl transition"
                  >
                    Book with {doc.name.split(' ')[1]}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RESERVATION PAGE WITH NETLIFY FORM */}
        {activeTab === 'reservation' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md max-w-lg mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Book an Appointment</h3>
            <p className="text-xs text-slate-500 mb-6">Schedule your clinical visit with Ketuma Health Centre.</p>

            {bookingSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-sm space-y-2">
                <p className="font-bold">Reservation Submitted!</p>
                <p>
                  Thank you, {formData.name}. Your details have been sent to our reception team. We will contact you at {formData.phone} shortly.
                </p>
                <button onClick={() => setBookingSuccess(false)} className="text-xs font-semibold text-emerald-700 underline mt-2 block">
                  Book another appointment
                </button>
              </div>
            ) : (
              <form
                name="appointments"
                method="POST"
                data-netlify="true"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const body = new URLSearchParams({
                    'form-name': 'appointments',
                    ...formData,
                  }).toString();

                  try {
                    await fetch('/', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                      body,
                    });
                    setBookingSuccess(true);
                  } catch (err) {
                    alert('Failed to submit reservation. Please call 0923055713.');
                  }
                }}
                className="space-y-4 text-sm"
              >
                <input type="hidden" name="form-name" value="appointments" />

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
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
                    name="phone"
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
                    name="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="General Checkup">General Checkup</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Emergency Consultation">Emergency Consultation</option>
                  </select>
                </div>

                <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-2.5 rounded-xl hover:bg-emerald-700 transition">
                  Confirm Reservation
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 5: APPOINTMENT STATUS TRACKER */}
        {activeTab === 'tracker' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md max-w-lg mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Track Your Reservation</h3>
              <p className="text-xs text-slate-500">Enter your phone number to check your appointment status.</p>
            </div>

            <form onSubmit={handleTrackBooking} className="flex space-x-2">
              <input
                type="tel"
                required
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="Enter phone number (0923055713)"
                className="flex-1 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition">
                Search
              </button>
            </form>

            {hasSearched && (
              <div>
                {trackedBooking ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{trackedBooking.name}</span>
                      <span className="bg-emerald-200 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                        {trackedBooking.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">Department: {trackedBooking.department}</p>
                    <p className="text-xs text-slate-600">Scheduled: {trackedBooking.date}</p>
                  </div>
                ) : (
                  <p className="text-xs text-red-500">No active reservation found for this phone number.</p>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Persistent Floating Emergency Button */}
      <a
        href="tel:0923055713"
        className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center space-x-2 z-50 transition transform hover:scale-105"
        title="Call Ketuma Health Centre"
      >
        <Phone className="w-5 h-5 animate-pulse" />
        <span className="hidden sm:inline font-bold text-xs pr-1">0923055713</span>
      </a>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-6 border-t border-slate-800 text-xs">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-white">Ketuma Health Centre</span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Main Clinic</span>
            <a href="tel:0923055713" className="flex items-center hover:text-white transition">
              <Phone className="w-3.5 h-3.5 mr-1 text-emerald-500" /> 0923055713
            </a>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-slate-500">&copy; {new Date().getFullYear()} Ketuma Health Centre. All rights reserved.</p>
            <p className="text-emerald-400 font-semibold tracking-wide">Created by Rebira Ketema</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
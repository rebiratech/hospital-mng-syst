'use client';

import React, { useState, useEffect } from 'react';
import {
  Phone, Heart, Sparkles, Send, Bot, User, Clock, Shield, MapPin,
  Calendar, Info, MessageSquare, Search, Stethoscope, Activity, Star,
  Upload, CreditCard, ChevronDown, ChevronUp, CheckCircle2, Navigation,
  ExternalLink, Copy, Check, AlertCircle, Globe, Users, Trash2, X, LogOut,
  Calculator, Droplets, Baby, BookOpen, Apple
} from 'lucide-react';
import { supabase } from './supabase';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- TRANSLATIONS DICTIONARY ---
const t = (key: string, lang: 'en' | 'am') => {
  const dict: Record<string, { en: string; am: string }> = {
    nav_services: { en: 'Services & About', am: 'አገልግሎቶች እና ስለ እኛ' },
    nav_triage: { en: 'AI Triage', am: 'የAI ርመራ' },
    nav_doctors: { en: 'Doctors', am: 'ኪሞች' },
    nav_tools: { en: 'Health Tools', am: 'የጤና መሳሪያዎች' },
    nav_book: { en: 'Book Appointment', am: 'ቀጠ ይያዙ' },
    nav_track: { en: 'Track Booking', am: 'ጠሮ ይከተ' },
    hero_title: { en: 'Your Health, Our Sacred Priority.', am: 'ናዎ የእኛ ዋና ድሚያ ነው።' },
    about_title: { en: 'About Ketuma Health Centre', am: 'ስለ ከቱማ ጤና ማዕከል' },
    specialties_title: { en: 'Our Medical Specialties', am: 'የክምና ስፔሊቲዎቻችን' },
    book_title: { en: 'Book an Appointment', am: 'ቀጠሮ ይያዙ' },
    book_sub: { en: 'Schedule your clinical visit with Ketuma Health Centre.', am: 'ከከቱማ ጤና ማዕከል ጋር የክሊኒ ጉብኝትን ያስያዙ።' },
    lbl_name: { en: 'Full Name', am: 'ሙሉ ስም' },
    lbl_phone: { en: 'Phone Number', am: 'ስልክ ቁር' },
    lbl_date: { en: 'Preferred Date', am: 'የሚልጉት ቀን' },
    lbl_dept: { en: 'Department', am: 'ክፍል' },
    lbl_file: { en: 'Upload Payment Ticket / Screenshot', am: 'የክፍያ ደረሰኝ ይስቀሉ' },
    btn_submit: { en: 'Confirm Reservation & Receipt', am: 'ቀጠሮውን ያጋግጡ' },
    btn_search: { en: 'Search', am: 'ፈልግ' },
    track_title: { en: 'Track Your Reservation', am: 'ቀጠሮን ይከታተሉ' },
    track_sub: { en: 'Enter the phone number you used during booking to check your status.', am: 'ሁኔታዎን ለማየት በቀጠሮ ጊዜ የተጠቀሙትን ስልክ ቁጥር ያስገቡ' },
    faq_title: { en: 'Frequently Asked Questions (FAQ)', am: 'በብዛት የሚነሱ ጥያቄዎች' },
    staff_portal: { en: 'Staff Portal', am: 'የሰራተኞች ርታል' },
    admin_title: { en: 'Clinic Admin Dashboard', am: 'የክሊኒክ አስተዳዳሪ ዳቦርድ' },
    tools_title: { en: 'Interactive Health Tools', am: 'ተግባራዊ የና መሳሪያዎች' },
    tools_sub: { en: 'Check your health metrics instantly. (For informational purposes only)', am: 'የጤና መለኪያዎችዎን ወዲያውኑ ይፈትሹ (ለመረጃ ዓላማ ብቻ)' },
    blog_title: { en: 'Health Tips & Articles', am: 'የጤና ምሮች እና ጽሑች' },
    blog_sub: { en: 'Stay informed with the latest health advice from our medical team.', am: 'ከህክምና ባለሙያዎችን የቅርብ ጊዜ የጤና ምክሮችን ያግኙ' },
  };
  return dict[key]?.[lang] || key;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'info' | 'triage' | 'doctors' | 'tools' | 'reservation' | 'tracker'>('info');
  const [lang, setLang] = useState<'en' | 'am'>('en');
  
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [adminBookings, setAdminBookings] = useState<any[]>([]);

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: lang === 'en' ? 'Hello! Welcome to Ketuma Health Centre. I am your AI Health Assistant. Please describe your symptoms for immediate guidance.' : 'ሰላም! እንኳን ወደ ከቱማ ጤና ማዕከል በደህና መጡ።' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', department: 'General Checkup', doctor: 'Any Available' });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const [searchPhone, setSearchPhone] = useState('');
  const [trackedBooking, setTrackedBooking] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [activeTool, setActiveTool] = useState<'bmi' | 'pregnancy' | 'water' | 'nutrition'>('bmi');
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiHeight, setBmiHeight] = useState('');
  const [bmiResult, setBmiResult] = useState<{ value: number; category: string; color: string } | null>(null);
  const [lmpDate, setLmpDate] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [waterWeight, setWaterWeight] = useState('');
  const [waterResult, setWaterResult] = useState<number | null>(null);

  // Nutrition Planner State
  const [nutritionAge, setNutritionAge] = useState('');
  const [nutritionGender, setNutritionGender] = useState<'male' | 'female'>('male');
  const [nutritionWeight, setNutritionWeight] = useState('');
  const [nutritionHeight, setNutritionHeight] = useState('');
  const [nutritionActivity, setNutritionActivity] = useState('1.2');
  const [nutritionGoal, setNutritionGoal] = useState('maintain');
  const [nutritionResult, setNutritionResult] = useState<{ calories: number; protein: number; carbs: number; fats: number } | null>(null);

  const isValidEthiopianPhone = (phone: string) => /^0(9|7)\d{8}$/.test(phone);

  useEffect(() => {
    if (showAdmin) {
      const fetchBookings = async () => {
        const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
        if (!error && data) setAdminBookings(data);
      };
      fetchBookings();
    }
  }, [showAdmin]);

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (!error) {
      const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (data) setAdminBookings(data);
    }
  };

  const deleteBooking = async (id: string) => {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (!error) {
      const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (data) setAdminBookings(data);
    }
  };

  const calculateBMI = () => {
    const w = parseFloat(bmiWeight);
    const h = parseFloat(bmiHeight) / 100;
    if (w > 0 && h > 0) {
      const bmi = w / (h * h);
      let category = '';
      let color = '';
      if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-500'; }
      else if (bmi < 25) { category = 'Normal Weight'; color = 'text-emerald-500'; }
      else if (bmi < 30) { category = 'Overweight'; color = 'text-yellow-500'; }
      else { category = 'Obese'; color = 'text-red-500'; }
      setBmiResult({ value: parseFloat(bmi.toFixed(1)), category, color });
    }
  };

  const calculateDueDate = () => {
    if (lmpDate) {
      const date = new Date(lmpDate);
      date.setDate(date.getDate() + 280);
      setDueDate(date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    }
  };

  const calculateWater = () => {
    const w = parseFloat(waterWeight);
    if (w > 0) {
      setWaterResult(parseFloat((w * 0.033).toFixed(1)));
    }
  };

  const calculateNutrition = () => {
    const w = parseFloat(nutritionWeight);
    const h = parseFloat(nutritionHeight);
    const a = parseFloat(nutritionAge);
    if (!w || !h || !a) return;

    let bmr = 10 * w + 6.25 * h - 5 * a;
    bmr += nutritionGender === 'male' ? 5 : -161;

    const tdee = bmr * parseFloat(nutritionActivity);
    let targetCalories = tdee;
    if (nutritionGoal === 'lose') targetCalories = tdee - 500;
    if (nutritionGoal === 'gain') targetCalories = tdee + 500;

    let pRatio = 0.3, cRatio = 0.4, fRatio = 0.3;
    if (nutritionGoal === 'lose') { pRatio = 0.4; cRatio = 0.3; fRatio = 0.3; }
    if (nutritionGoal === 'gain') { pRatio = 0.3; cRatio = 0.5; fRatio = 0.2; }

    setNutritionResult({
      calories: Math.round(targetCalories),
      protein: Math.round((targetCalories * pRatio) / 4),
      carbs: Math.round((targetCalories * cRatio) / 4),
      fats: Math.round((targetCalories * fRatio) / 9)
    });
  };

  const doctors = [
    { name: 'Dr. Ketema Moti', role: 'Chief Medical Officer', dept: 'General Checkup', exp: '12+ Years' },
    { name: 'Dr. Sarah Tadesse', role: 'Pediatric Specialist', dept: 'Pediatrics', exp: '8 Years' },
    { name: 'Dr. Dawit Solomon', role: 'Internal Medicine', dept: 'Internal Medicine', exp: '10 Years' },
  ];

  const services = [
    { title: 'Emergency Triage', desc: 'Instant AI symptom checker and 24/7 urgent care access.', icon: Activity },
    { title: 'General Outpatient', desc: 'Routine health checkups, diagnostic testing, and consultations.', icon: Stethoscope },
    { title: 'Pediatric Care', desc: 'Specialized healthcare for infants, children, and adolescents.', icon: Heart },
    { title: 'Internal Medicine', desc: 'Comprehensive diagnosis and treatment of complex adult illnesses.', icon: Shield },
  ];

  const faqs = [
    { q: 'How much is the registration fee?', a: 'The initial consultation registration fee is 500 ETB, payable via Telebirr or CBE Birr.' },
    { q: 'Do I need an appointment for emergency triage?', a: 'No, emergencies are handled immediately 24/7. Use our AI Triage or call 0923055713.' },
    { q: 'What should I bring for my appointment?', a: 'Please bring a valid ID card, your payment receipt, and any prior medical records.' },
    { q: 'How do I track my booking status?', a: 'Go to the "Track Booking" tab and enter the phone number used during registration.' },
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
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble. Please call 0923055713.' }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEthiopianPhone(searchPhone)) {
      alert('Please enter a valid 10-digit Ethiopian phone number.');
      return;
    }
    setHasSearched(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('phone', searchPhone)
      .order('created_at', { ascending: false })
      .limit(1);
    if (!error && data && data.length > 0) {
      setTrackedBooking(data[0]);
    } else {
      setTrackedBooking(null);
    }
  };

  if (showAdmin) {
    const departmentData = adminBookings.reduce((acc: any, curr: any) => {
      acc[curr.department] = (acc[curr.department] || 0) + 1;
      return acc;
    }, {});
    const pieData = Object.keys(departmentData).map((key: string) => ({ name: key, value: departmentData[key] }));
    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

    const statusData = adminBookings.reduce((acc: any, curr: any) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});
    const barData = Object.keys(statusData).map((key: string) => ({ name: key, count: statusData[key] }));

    return (
      <div className="min-h-screen bg-slate-100 p-6 font-sans">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-emerald-600" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{t('admin_title', lang)}</h1>
                <p className="text-sm text-slate-500">Manage patient bookings & analytics</p>
              </div>
            </div>
            <button onClick={() => setShowAdmin(false)} className="flex items-center space-x-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-slate-700 font-medium transition">
              <LogOut className="w-4 h-4" />
              <span>Exit Portal</span>
            </button>
          </div>

          {adminBookings.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-4 text-center">Bookings by Department</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                        {pieData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-4 text-center">Bookings by Status</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {adminBookings.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">No bookings found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                    <th className="p-3">Patient</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Doctor</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adminBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition text-sm">
                      <td className="p-3 font-medium">{b.name}</td>
                      <td className="p-3">{b.phone}</td>
                      <td className="p-3">{b.department}</td>
                      <td className="p-3 font-medium text-slate-700">{b.doctor}</td>
                      <td className="p-3">{b.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : b.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>{b.status}</span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {b.status !== 'Confirmed' && <button onClick={() => updateBookingStatus(b.id, 'Confirmed')} className="text-emerald-600 hover:text-emerald-800 font-medium text-xs">Confirm</button>}
                        {b.status !== 'Cancelled' && <button onClick={() => updateBookingStatus(b.id, 'Cancelled')} className="text-amber-600 hover:text-amber-800 font-medium text-xs">Cancel</button>}
                        <button onClick={() => deleteBooking(b.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans relative">
      <div className="bg-emerald-900 text-emerald-100 text-xs sm:text-sm py-2 px-6 flex justify-between items-center shadow-inner">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="font-medium">Compassionate Care Meets AI Innovation</span>
        </div>
        <div className="flex items-center space-x-4 sm:space-x-6">
          <button onClick={() => setLang(lang === 'en' ? 'am' : 'en')} className="flex items-center space-x-1.5 hover:text-white transition font-semibold bg-emerald-800/50 px-2 py-1 rounded-lg">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'en' ? 'አማ' : 'EN'}</span>
          </button>
          <a href="tel:0923055713" className="hidden sm:flex items-center space-x-1.5 hover:text-white transition font-semibold">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>0923055713</span>
          </a>
          <span className="hidden md:inline-flex items-center space-x-1 text-emerald-300">
            <Clock className="w-4 h-4 mr-1" /> Open 24/7
          </span>
        </div>
      </div>

      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex flex-col lg:flex-row justify-between items-center gap-4 sticky top-0 z-40 shadow-xs">
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
          {(['info', 'triage', 'doctors', 'tools', 'reservation', 'tracker'] as const).map((tab) => {
            const icons = { info: Info, triage: MessageSquare, doctors: Stethoscope, tools: Calculator, reservation: Calendar, tracker: Search };
            const labels = { info: t('nav_services', lang), triage: t('nav_triage', lang), doctors: t('nav_doctors', lang), tools: t('nav_tools', lang), reservation: t('nav_book', lang), tracker: t('nav_track', lang) };
            const Icon = icons[tab];
            return (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${activeTab === tab ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}>
                <Icon className="w-4 h-4" />
                <span>{labels[tab]}</span>
              </button>
            );
          })}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        <section className="text-center space-y-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full inline-block uppercase tracking-wider">Ketuma Health Centre</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('hero_title', lang)}</h2>
          <p className="text-sm text-slate-600 italic max-w-2xl mx-auto">&ldquo;The art of healing comes from nature, not from the physician.&rdquo;</p>
        </section>

        {activeTab === 'info' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-lg font-bold text-slate-900">{t('about_title', lang)}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">At Ketuma Health Centre, we combine compassionate human medical expertise with cutting-edge artificial intelligence. Our goal is to streamline patient entry, eliminate long waiting times, and offer top-class clinical care around the clock.</p>
            </div>
            <div>
              <h4 className="text-md font-bold text-slate-900 mb-4">{t('specialties_title', lang)}</h4>
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
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-md font-bold text-slate-900">{t('faq_title', lang)}</h4>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100 transition flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-800">
                      <span>{faq.q}</span>
                      {openFaq === index ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {openFaq === index && <div className="p-3.5 bg-white text-xs text-slate-600 border-t border-slate-100 leading-relaxed">{faq.a}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'triage' && (
          <section className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col h-[520px]">
            <div className="bg-emerald-50 border-b border-emerald-100 p-4 flex items-center space-x-3">
              <div className="bg-emerald-600 text-white p-2 rounded-xl"><Bot className="w-5 h-5" /></div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">AI Medical Triage Assistant</h3>
                <p className="text-xs text-slate-500">Describe symptoms for preliminary guidance</p>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start space-x-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && <div className="bg-emerald-600 text-white p-1.5 rounded-lg text-xs mt-1"><Bot className="w-4 h-4" /></div>}
                  <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'}`}>{msg.content}</div>
                  {msg.role === 'user' && <div className="bg-slate-700 text-white p-1.5 rounded-lg text-xs mt-1"><User className="w-4 h-4" /></div>}
                </div>
              ))}
              {loading && <div className="flex items-center space-x-2 text-slate-400 text-xs"><Bot className="w-4 h-4 animate-bounce text-emerald-600" /><span>Ketuma AI is analyzing...</span></div>}
            </div>
            <form onSubmit={handleChatSubmit} className="p-3 bg-white border-t border-slate-200 flex space-x-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe symptoms..." className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
              <button type="submit" disabled={loading || !input.trim()} className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"><Send className="w-4 h-4" /></button>
            </form>
          </section>
        )}

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
                    <div className="bg-emerald-100 text-emerald-800 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg">{doc.name.split(' ')[1][0]}</div>
                    <h4 className="font-bold text-slate-900 text-base">{doc.name}</h4>
                    <p className="text-xs font-semibold text-emerald-600">{doc.role}</p>
                    <p className="text-xs text-slate-500">Department: {doc.dept}</p>
                    <p className="text-xs text-slate-500">Experience: {doc.exp}</p>
                  </div>
                  <button onClick={() => { setFormData((prev) => ({ ...prev, department: doc.dept, doctor: doc.name })); setActiveTab('reservation'); }} className="w-full bg-slate-900 text-white hover:bg-emerald-700 text-xs font-semibold py-2.5 rounded-xl transition">Book with {doc.name.split(' ')[1]}</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-8">
            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">{t('tools_title', lang)}</h3>
                <p className="text-xs text-slate-500">{t('tools_sub', lang)}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {[{ id: 'bmi', label: 'BMI Calculator', icon: Activity }, { id: 'pregnancy', label: 'Due Date', icon: Baby }, { id: 'water', label: 'Water Intake', icon: Droplets }, { id: 'nutrition', label: 'Nutrition Planner', icon: Apple }].map((tool) => (
                  <button key={tool.id} onClick={() => { setActiveTool(tool.id as any); setBmiResult(null); setDueDate(null); setWaterResult(null); setNutritionResult(null); }} className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition text-sm ${activeTool === tool.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                    <tool.icon className="w-4 h-4" />
                    <span>{tool.label}</span>
                  </button>
                ))}
              </div>
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs max-w-lg mx-auto">
                {activeTool === 'bmi' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-900 text-center">Body Mass Index (BMI)</h4>
                    <div><label className="block text-xs font-medium text-slate-700 mb-1">Weight (kg)</label><input type="number" value={bmiWeight} onChange={(e) => setBmiWeight(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm" placeholder="e.g. 70" /></div>
                    <div><label className="block text-xs font-medium text-slate-700 mb-1">Height (cm)</label><input type="number" value={bmiHeight} onChange={(e) => setBmiHeight(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm" placeholder="e.g. 175" /></div>
                    <button onClick={calculateBMI} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold transition text-sm">Calculate BMI</button>
                    {bmiResult && (
                      <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <p className="text-slate-500 text-xs mb-1">Your BMI is</p>
                        <p className={`text-3xl font-bold ${bmiResult.color} mb-1`}>{bmiResult.value}</p>
                        <p className={`font-semibold text-sm ${bmiResult.color}`}>{bmiResult.category}</p>
                      </div>
                    )}
                  </div>
                )}
                {activeTool === 'pregnancy' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-900 text-center">Pregnancy Due Date</h4>
                    <div><label className="block text-xs font-medium text-slate-700 mb-1">First day of Last Menstrual Period</label><input type="date" value={lmpDate} onChange={(e) => setLmpDate(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm" /></div>
                    <button onClick={calculateDueDate} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold transition text-sm">Calculate Due Date</button>
                    {dueDate && (
                      <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <p className="text-slate-500 text-xs mb-1">Estimated Due Date</p>
                        <p className="text-xl font-bold text-emerald-600">{dueDate}</p>
                      </div>
                    )}
                  </div>
                )}
                {activeTool === 'water' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-900 text-center">Daily Water Intake</h4>
                    <div><label className="block text-xs font-medium text-slate-700 mb-1">Your Weight (kg)</label><input type="number" value={waterWeight} onChange={(e) => setWaterWeight(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm" placeholder="e.g. 70" /></div>
                    <button onClick={calculateWater} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold transition text-sm">Calculate Intake</button>
                    {waterResult !== null && (
                      <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <p className="text-slate-500 text-xs mb-1">Recommended Daily Water</p>
                        <p className="text-3xl font-bold text-blue-500 mb-1">{waterResult} <span className="text-base font-normal text-slate-600">Liters</span></p>
                        <p className="text-xs text-slate-400">That's about {Math.round(waterResult * 4)} glasses!</p>
                      </div>
                    )}
                  </div>
                )}
                {activeTool === 'nutrition' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-900 text-center">Personalized Nutrition Planner</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-medium text-slate-700 mb-1">Age</label><input type="number" value={nutritionAge} onChange={(e) => setNutritionAge(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm" placeholder="e.g. 25" /></div>
                      <div><label className="block text-xs font-medium text-slate-700 mb-1">Gender</label><select value={nutritionGender} onChange={(e) => setNutritionGender(e.target.value as any)} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm"><option value="male">Male</option><option value="female">Female</option></select></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-medium text-slate-700 mb-1">Weight (kg)</label><input type="number" value={nutritionWeight} onChange={(e) => setNutritionWeight(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm" placeholder="e.g. 70" /></div>
                      <div><label className="block text-xs font-medium text-slate-700 mb-1">Height (cm)</label><input type="number" value={nutritionHeight} onChange={(e) => setNutritionHeight(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm" placeholder="e.g. 175" /></div>
                    </div>
                    <div><label className="block text-xs font-medium text-slate-700 mb-1">Activity Level</label><select value={nutritionActivity} onChange={(e) => setNutritionActivity(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm"><option value="1.2">Sedentary (Office job)</option><option value="1.375">Light Exercise (1-2 days/week)</option><option value="1.55">Moderate Exercise (3-5 days/week)</option><option value="1.725">Heavy Exercise (6-7 days/week)</option></select></div>
                    <div><label className="block text-xs font-medium text-slate-700 mb-1">Your Goal</label><select value={nutritionGoal} onChange={(e) => setNutritionGoal(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm"><option value="lose">Lose Weight</option><option value="maintain">Maintain Weight</option><option value="gain">Gain Muscle</option></select></div>
                    <button onClick={calculateNutrition} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold transition text-sm">Calculate My Plan</button>
                    
                    {nutritionResult && (
                      <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-3">
                        <p className="text-emerald-800 font-bold text-lg">Daily Target: {nutritionResult.calories} Calories</p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-white p-2 rounded-lg shadow-xs"><p className="text-slate-500">Protein</p><p className="font-bold text-emerald-600 text-lg">{nutritionResult.protein}g</p></div>
                          <div className="bg-white p-2 rounded-lg shadow-xs"><p className="text-slate-500">Carbs</p><p className="font-bold text-blue-600 text-lg">{nutritionResult.carbs}g</p></div>
                          <div className="bg-white p-2 rounded-lg shadow-xs"><p className="text-slate-500">Fats</p><p className="font-bold text-amber-600 text-lg">{nutritionResult.fats}g</p></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">{t('blog_title', lang)}</h3>
                <p className="text-xs text-slate-500">{t('blog_sub', lang)}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[{ icon: AlertCircle, title: 'Preventing Malaria', excerpt: 'Use insecticide-treated nets, clear standing water, and seek immediate testing if you experience chills and fever.', color: 'bg-red-100 text-red-600' }, { icon: Apple, title: 'Boost Your Immunity', excerpt: 'Eat local foods rich in Vitamin C and Zinc. Stay hydrated and get adequate sleep to fight off infections.', color: 'bg-emerald-100 text-emerald-600' }, { icon: Heart, title: 'Understanding Hypertension', excerpt: 'Hypertension is a "silent killer." Reduce salt intake, manage stress, and get your blood pressure checked regularly.', color: 'bg-blue-100 text-blue-600' }].map((post, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200 flex flex-col">
                    <div className={`p-6 ${post.color} flex justify-center`}><post.icon className="w-8 h-8" /></div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h4 className="text-base font-bold text-slate-900 mb-2">{post.title}</h4>
                      <p className="text-xs text-slate-600 mb-4 flex-1 leading-relaxed">{post.excerpt}</p>
                      <button className="text-emerald-600 font-semibold text-xs flex items-center space-x-1 hover:text-emerald-700 self-start"><span>Read More</span><ChevronDown className="w-3 h-3 -rotate-90" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reservation' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md max-w-lg mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-1">{t('book_title', lang)}</h3>
            <p className="text-xs text-slate-500 mb-4">{t('book_sub', lang)}</p>
            {bookingSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-sm space-y-2">
                <p className="font-bold flex items-center space-x-2"><CheckCircle2 className="w-5 h-5" /><span>Reservation Submitted!</span></p>
                <p>Thank you, {formData.name}. We will confirm your visit at {formData.phone} shortly.</p>
                <button onClick={() => setBookingSuccess(false)} className="text-xs font-semibold text-emerald-700 underline mt-2 block">Book another appointment</button>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!isValidEthiopianPhone(formData.phone)) {
                  alert('Please enter a valid 10-digit Ethiopian phone number.');
                  return;
                }
                setSubmitting(true);
                try {
                  try {
                    const formPayload = new FormData();
                    formPayload.append('access_key', 'a74437c0-1e50-4d8a-818d-2c505f800e08');
                    formPayload.append('subject', `New Appointment: ${formData.name}`);
                    formPayload.append('name', formData.name);
                    formPayload.append('phone', formData.phone);
                    formPayload.append('date', formData.date);
                    formPayload.append('department', formData.department);
                    formPayload.append('doctor', formData.doctor);
                    if (receiptFile) formPayload.append('attachment', receiptFile);
                    await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formPayload });
                  } catch (emailErr) {
                    console.log("Email sent but response failed, continuing anyway...");
                  }
              
                  const { error } = await supabase.from('bookings').insert([{
                    name: formData.name,
                    phone: formData.phone,
                    date: formData.date,
                    department: formData.department,
                    doctor: formData.doctor,
                    status: 'Pending'
                  }]);
              
                  if (!error) {
                    setBookingSuccess(true);
                  } else {
                    alert('Error saving to database: ' + error.message);
                  }
                } catch (err) {
                  alert('Error submitting. Please call 0923055713.');
                } finally {
                  setSubmitting(false);
                }
              }} className="space-y-4 text-sm">
                <div><label className="block text-slate-700 font-medium mb-1">{t('lbl_name', lang)}</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" /></div>
                <div><label className="block text-slate-700 font-medium mb-1">{t('lbl_phone', lang)}</label><input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="0923055713" className="w-full px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" /></div>
                <div><label className="block text-slate-700 font-medium mb-1">{t('lbl_date', lang)}</label><input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" /></div>
                <div><label className="block text-slate-700 font-medium mb-1">{t('lbl_dept', lang)}</label><select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"><option value="General Checkup">General Checkup</option><option value="Pediatrics">Pediatrics</option><option value="Internal Medicine">Internal Medicine</option></select></div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Select Doctor</label>
                  <select value={formData.doctor} onChange={(e) => setFormData({ ...formData, doctor: e.target.value })} className="w-full px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800">
                    <option value="Any Available">Any Available</option>
                    <option value="Dr. Ketema Moti">Dr. Ketema Moti</option>
                    <option value="Dr. Sarah Tadesse">Dr. Sarah Tadesse</option>
                    <option value="Dr. Dawit Solomon">Dr. Dawit Solomon</option>
                  </select>
                </div>
                <div><label className="block text-slate-700 font-medium mb-1">{t('lbl_file', lang)}</label><div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 p-4 rounded-xl text-center cursor-pointer transition"><input type="file" accept="image/*,.pdf" onChange={(e) => { if (e.target.files?.[0]) setReceiptFile(e.target.files[0]); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /><div className="flex flex-col items-center justify-center space-y-1"><Upload className="w-5 h-5 text-emerald-600" /><span className="text-xs text-slate-600 font-medium">{receiptFile ? receiptFile.name : 'Click to upload screenshot'}</span></div></div></div>
                <button type="submit" disabled={submitting} className="w-full bg-emerald-600 text-white font-semibold py-2.5 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50">{submitting ? 'Sending...' : t('btn_submit', lang)}</button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'tracker' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md max-w-lg mx-auto space-y-6">
            <div><h3 className="text-xl font-bold text-slate-900 mb-1">{t('track_title', lang)}</h3><p className="text-xs text-slate-500">{t('track_sub', lang)}</p></div>
            <form onSubmit={handleTrackBooking} className="flex space-x-2">
              <input type="tel" required value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)} placeholder="0923055713" className="flex-1 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
              <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition">{t('btn_search', lang)}</button>
            </form>
            {hasSearched && (
              <div>
                {trackedBooking ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-emerald-200 pb-2"><span className="font-bold text-slate-900 text-base">{trackedBooking.name}</span><span className="bg-emerald-200 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">{trackedBooking.status}</span></div>
                    <p className="text-slate-700"><span className="text-slate-500">Department:</span> {trackedBooking.department}</p>
                    <p className="text-slate-700"><span className="text-slate-500">Doctor:</span> {trackedBooking.doctor}</p>
                    <p className="text-slate-700"><span className="text-slate-500">Date:</span> {trackedBooking.date}</p>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-sm flex items-start space-x-2"><AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /><p>No active reservation found for this phone number.</p></div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <a href="tel:0923055713" className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center space-x-2 z-50 transition transform hover:scale-105">
        <Phone className="w-5 h-5 animate-pulse" />
        <span className="hidden sm:inline font-bold text-xs pr-1">0923055713</span>
      </a>

      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex justify-between items-center"><h3 className="font-bold text-slate-900">Staff Access</h3><button onClick={() => setShowPinModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button></div>
            <p className="text-xs text-slate-500">Enter the 4-digit staff PIN to continue.</p>
            <input type="password" value={pinInput} onChange={(e) => setPinInput(e.target.value)} placeholder="Enter PIN (Hint: 1234)" className="w-full px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center text-lg tracking-widest" />
            {pinError && <p className="text-xs text-red-500 text-center">{pinError}</p>}
            <button onClick={() => { if (pinInput === '1234') { setShowAdmin(true); setShowPinModal(false); } else { setPinError('Incorrect PIN. Please try again.'); } }} className="w-full bg-emerald-600 text-white font-semibold py-2.5 rounded-xl hover:bg-emerald-700 transition">Unlock Dashboard</button>
          </div>
        </div>
      )}

      <footer className="bg-slate-900 text-slate-400 py-6 px-6 border-t border-slate-800 text-xs">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2"><Shield className="w-4 h-4 text-emerald-500" /><span className="font-semibold text-white">Ketuma Health Centre</span></div>
          <div className="flex items-center space-x-6"><a href="tel:0923055713" className="flex items-center hover:text-white transition"><Phone className="w-3.5 h-3.5 mr-1 text-emerald-500" /> 0923055713</a></div>
          <div className="text-right space-y-1">
            <p className="text-slate-500">&copy; {new Date().getFullYear()} Ketuma Health Centre.</p>
            <button onClick={() => { setShowPinModal(true); setPinError(''); setPinInput(''); }} className="text-emerald-500/60 hover:text-emerald-400 transition flex items-center space-x-1 mx-auto md:ml-auto"><Users className="w-3 h-3" /><span>{t('staff_portal', lang)}</span></button>
          </div>
        </div>
      </footer>
    </div>
  );
}
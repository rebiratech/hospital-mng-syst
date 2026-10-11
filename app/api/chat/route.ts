import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;
    const msg = message.toLowerCase().trim();

    // Clean up "I have", "I'm having", etc. to find the real symptom
    const cleanMsg = msg
      .replace(/^(i have|i'm having|i feel|i am having|i got|ive got|ive been having|my|i have a|i have an|i have )\s*/gi, '')
      .trim();

    // 🚨 1. EMERGENCY CHECK (Always first)
    const emergencyKeywords = ['dying', 'chest pain', "can't breathe", 'cannot breathe', 'bleeding heavily', 'unconscious', 'stroke', 'heart attack', 'severe pain', 'coughing blood', 'vomiting blood', 'seizure', 'collapsed'];
    if (emergencyKeywords.some(k => msg.includes(k))) {
      return NextResponse.json({ 
        reply: "🚨 EMERGENCY ALERT\n\nThese symptoms require IMMEDIATE medical attention. Please call our emergency line at 0923055713 or go to the nearest hospital RIGHT NOW. Do not wait!" 
      });
    }

    // 👋 2. GREETINGS & CONVERSATION
    const greetings = ['hey', 'hello', 'hi', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy', 'sup', 'what\'s up', 'yo'];
    if (greetings.some(g => msg === g || msg.startsWith(g + ' ') || msg.startsWith(g + ','))) {
      return NextResponse.json({ 
        reply: "Hello! 👋 Welcome to Ketuma Health Centre. I'm your AI Health Assistant. How are you feeling today? Please describe any symptoms you're experiencing, and I'll help guide you. Or if you'd like to book an appointment, just let me know!" 
      });
    }

    // 😊 3. HOW ARE YOU / SMALL TALK
    if (msg.includes('how are you') || msg.includes('how r u') || msg.includes('how do you do')) {
      return NextResponse.json({ 
        reply: "I'm doing great, thank you for asking! 😊 I'm here to help you with any health concerns. How can I assist you today? Are you experiencing any symptoms, or would you like to book an appointment?" 
      });
    }

    // 🙏 4. THANK YOU
    if (msg.includes('thank') || msg.includes('thanks') || msg.includes('thx')) {
      return NextResponse.json({ 
        reply: "You're very welcome! 😊 I'm glad I could help. Is there anything else you'd like to know about your symptoms, or would you like to book an appointment with our doctors?" 
      });
    }

    // 👍 5. YES / OK / SURE
    if (msg === 'yes' || msg === 'ok' || msg === 'okay' || msg === 'sure' || msg === 'yeah') {
      return NextResponse.json({ 
        reply: "Great!  Please let me know how I can help you. You can describe your symptoms, ask about our services, or I can help you book an appointment. What would you like to do?" 
      });
    }

    // 👎 6. NO / NOPE
    if (msg === 'no' || msg === 'nope' || msg === 'nah') {
      return NextResponse.json({ 
        reply: "No problem at all! 😊 If you change your mind or need any health advice, I'm here to help. Just type your symptoms or questions anytime." 
      });
    }

    // 📅 7. BOOKING REQUESTS
    if (msg.includes('book') || msg.includes('appointment') || msg.includes('schedule') || msg.includes('visit doctor') || msg.includes('see doctor') || msg.includes('make appointment')) {
      return NextResponse.json({ 
        reply: "I'd be happy to help you book an appointment! \n\nPlease click on the **'Book Appointment'** tab at the top of the page to schedule your visit with our specialists. You'll be able to choose your preferred date, department, and doctor.\n\nIf you need any assistance with the booking process, just let me know!" 
      });
    }

    // 🏥 8. CLINIC INFORMATION QUESTIONS
    if (msg.includes('where are you') || msg.includes('location') || msg.includes('address') || msg.includes('find you')) {
      return NextResponse.json({ 
        reply: "📍 We are located at:\n\n**Ketuma Health Centre**\nIn front of Holeta Administration\nHoleta, Ethiopia\n\nYou can also call us at **0923055713** for directions. We're open 24/7 for emergencies!" 
      });
    }

    if (msg.includes('hours') || msg.includes('open') || msg.includes('close') || msg.includes('time')) {
      return NextResponse.json({ 
        reply: "🕐 **Our Operating Hours:**\n\n• **Emergency Services:** 24/7 (Always open)\n• **Outpatient Services:** Monday - Saturday, 8:00 AM - 6:00 PM\n• **Pharmacy:** Monday - Saturday, 8:00 AM - 8:00 PM\n\nFor emergencies, call us anytime at **0923055713**!" 
      });
    }

    if (msg.includes('phone') || msg.includes('call') || msg.includes('number') || msg.includes('contact')) {
      return NextResponse.json({ 
        reply: "📞 **Contact Information:**\n\n• **Emergency Line:** 0923055713 (24/7)\n• **General Inquiries:** 0923055713\n\nDon't hesitate to reach out if you need anything!" 
      });
    }

    if (msg.includes('services') || msg.includes('what do you offer') || msg.includes('specialties')) {
      return NextResponse.json({ 
        reply: " **Our Medical Services:**\n\n• **Emergency Triage** - 24/7 urgent care\n• **General Outpatient** - Routine checkups\n• **Pediatric Care** - Children's health\n• **Internal Medicine** - Complex adult illnesses\n• **AI Symptom Checker** - Instant guidance\n• **Laboratory Services** - Blood tests, X-rays\n• **Pharmacy** - Full-service pharmacy\n\nWould you like to know more about any specific service?" 
      });
    }

    if (msg.includes('doctor') || msg.includes('physician') || msg.includes('specialist')) {
      return NextResponse.json({ 
        reply: "👨‍⚕️ **Our Medical Team:**\n\n• **Dr. Ketema Moti** - Chief Medical Officer (General Checkup)\n• **Dr. Sarah Tadesse** - Pediatric Specialist\n• **Dr. Dawit Solomon** - Internal Medicine\n\nAll our doctors are highly qualified and experienced. Would you like to book an appointment with any of them?" 
      });
    }

    if (msg.includes('cost') || msg.includes('price') || msg.includes('fee') || msg.includes('how much')) {
      return NextResponse.json({ 
        reply: "💰 **Our Fees:**\n\n• **Initial Consultation:** 500 ETB\n• **Follow-up Visit:** 300 ETB\n• **Laboratory Tests:** Varies by test\n• **Emergency Services:** Assessed based on condition\n\nPayment can be made via Telebirr or CBE Birr. Would you like to book an appointment?" 
      });
    }

    // 🤔 9. WHAT CAN YOU DO / HELP
    if (msg.includes('what can you do') || msg.includes('help me') || msg.includes('how can you help') || msg.includes('what do you do')) {
      return NextResponse.json({ 
        reply: "I'm your AI Health Assistant! 🤖 I can help you with:\n\n• **Symptom Analysis** - Describe your symptoms and I'll provide guidance\n• **Health Advice** - Get tips on managing common conditions\n• **Appointment Booking** - I'll guide you to book a visit\n• **Clinic Information** - Hours, location, services, and more\n• **Emergency Guidance** - Know when to seek immediate care\n\nJust tell me what's on your mind!" 
      });
    }

    //  10. WORRIED / SCARED / ANXIOUS (Emotional support)
    if (msg.includes('worried') || msg.includes('scared') || msg.includes('anxious') || msg.includes('nervous') || msg.includes('afraid')) {
      return NextResponse.json({ 
        reply: "I understand you're feeling worried, and that's completely normal. 💙 Please know that you're in good hands. Many health concerns are treatable, especially when caught early.\n\nTake a deep breath. Let's work through this together. Can you tell me what symptoms you're experiencing? I'll help you understand what might be going on and what steps to take next." 
      });
    }

    // 📚 11. MASSIVE DISEASE KNOWLEDGE BASE
    const medicalDB: { keywords: string[]; possible: string; action: string; severity: 'mild' | 'moderate' | 'serious' }[] = [
      // === MILD CONDITIONS ===
      { keywords: ['headache', 'head pain', 'head hurts'], possible: 'Tension headache, migraine, dehydration, eye strain, or stress.', action: 'Rest in a quiet, dark room. Drink plenty of water. Apply a cold or warm compress to your forehead. You may take paracetamol if needed.', severity: 'mild' },
      { keywords: ['common cold', 'runny nose', 'stuffy nose', 'sneezing', 'sneeze'], possible: 'Common cold (viral upper respiratory infection) or seasonal allergies.', action: 'Rest, drink warm fluids, use saline nasal drops, and inhale steam. Take vitamin C. Avoid cold drinks.', severity: 'mild' },
      { keywords: ['cough', 'coughing'], possible: 'Viral infection, allergies, throat irritation, or early bronchitis.', action: 'Drink warm water with honey, avoid cold drinks and dust, use a humidifier. If it lasts more than 2 weeks, see a doctor.', severity: 'mild' },
      { keywords: ['sore throat', 'throat pain', 'throat hurts', 'painful swallowing'], possible: 'Viral pharyngitis, strep throat, or tonsillitis.', action: 'Gargle with warm salt water, drink warm liquids, rest your voice. Avoid spicy and cold foods.', severity: 'mild' },
      { keywords: ['fever', 'high temperature', 'hot body', 'burning up'], possible: 'Viral infection, malaria, typhoid, or other infections.', action: 'Rest, drink plenty of fluids, take paracetamol, and use a damp cloth to cool your body. If fever is above 39°C or lasts more than 3 days, see a doctor immediately.', severity: 'mild' },
      { keywords: ['stomach ache', 'stomach pain', 'abdominal pain', 'tummy hurts', 'belly pain'], possible: 'Gas, indigestion, food poisoning, gastritis, or appendicitis (if severe).', action: 'Rest, drink warm water, avoid heavy or spicy foods. Apply a warm compress. If pain is severe or on the lower right side, seek medical help.', severity: 'mild' },
      { keywords: ['nausea', 'feeling sick', 'want to vomit', 'queasy'], possible: 'Food poisoning, motion sickness, pregnancy, or stomach infection.', action: 'Sit upright, sip ginger tea or clear fluids, eat small bland meals like crackers. Avoid strong smells.', severity: 'mild' },
      { keywords: ['vomiting', 'throwing up', 'puking'], possible: 'Food poisoning, stomach flu (gastroenteritis), or infection.', action: 'Stay hydrated with ORS (oral rehydration salts), rest your stomach for 1-2 hours, then sip clear fluids. If vomiting lasts more than 24 hours, see a doctor.', severity: 'mild' },
      { keywords: ['diarrhea', 'loose stool', 'watery stool', 'frequent pooping'], possible: 'Food poisoning, stomach infection, or food intolerance.', action: 'Drink ORS or plenty of water to prevent dehydration. Eat bland foods like rice, bananas, and toast. Avoid dairy and spicy foods.', severity: 'mild' },
      { keywords: ['constipation', 'can\'t poop', 'hard stool', 'difficulty pooping'], possible: 'Low fiber diet, dehydration, or lack of exercise.', action: 'Drink lots of water, eat fiber-rich foods (fruits, vegetables, whole grains), and exercise. Try warm water in the morning.', severity: 'mild' },
      { keywords: ['fatigue', 'tired', 'exhausted', 'no energy', 'weak', 'weakness'], possible: 'Anemia, poor sleep, stress, thyroid issues, or vitamin deficiency.', action: 'Get 7-8 hours of sleep, eat a balanced diet rich in iron and vitamins, stay hydrated, and exercise lightly. If it persists, get a blood test.', severity: 'mild' },
      { keywords: ['dizziness', 'dizzy', 'lightheaded', 'feeling faint'], possible: 'Dehydration, low blood sugar, low blood pressure, or inner ear issue.', action: 'Sit or lie down immediately. Drink water, eat something sugary if you haven\'t eaten. Stand up slowly. If it persists, see a doctor.', severity: 'mild' },
      { keywords: ['itchy', 'itching', 'itch'], possible: 'Allergies, dry skin, insect bite, or skin infection.', action: 'Avoid scratching, apply cool compress, use moisturizer or anti-itch cream. Take an antihistamine if allergic.', severity: 'mild' },
      { keywords: ['rash', 'skin rash', 'red skin', 'skin irritation'], possible: 'Allergic reaction, eczema, heat rash, or infection.', action: 'Keep the area clean and dry, avoid scratching, wear loose cotton clothes. If it spreads or you have fever, see a doctor.', severity: 'mild' },
      { keywords: ['acne', 'pimples', 'zits', 'breakouts'], possible: 'Hormonal changes, oily skin, or bacterial infection.', action: 'Wash face twice daily with gentle cleanser, avoid touching face, use non-comedogenic products. Don\'t pop pimples.', severity: 'mild' },
      { keywords: ['back pain', 'lower back pain', 'back hurts'], possible: 'Muscle strain, poor posture, or herniated disc.', action: 'Rest, apply ice or heat, avoid heavy lifting, and do gentle stretches. If pain radiates down your leg, see a doctor.', severity: 'mild' },
      { keywords: ['insomnia', 'can\'t sleep', 'sleeplessness', 'trouble sleeping'], possible: 'Stress, anxiety, caffeine, or poor sleep habits.', action: 'Avoid screens before bed, keep a regular sleep schedule, limit caffeine, and try relaxation techniques like deep breathing.', severity: 'mild' },
      { keywords: ['anxiety', 'nervous', 'worried', 'panicking', 'panic'], possible: 'Stress, anxiety disorder, or panic attack.', action: 'Practice deep breathing (inhale 4 sec, hold 4 sec, exhale 4 sec). Talk to someone you trust. Limit caffeine. Consider speaking with a counselor.', severity: 'mild' },
      { keywords: ['sad', 'depressed', 'hopeless', 'crying', 'low mood'], possible: 'Depression, grief, or hormonal changes.', action: 'Talk to someone you trust, maintain a daily routine, exercise, and get sunlight. If feelings persist for more than 2 weeks, please see a doctor.', severity: 'mild' },

      // === MODERATE CONDITIONS ===
      { keywords: ['migraine', 'severe headache', 'throbbing head', 'headache with nausea'], possible: 'Migraine — a neurological condition causing severe head pain.', action: 'Rest in a dark, quiet room. Apply a cold compress to your forehead. Take prescribed migraine medication. Avoid triggers like bright lights and certain foods.', severity: 'moderate' },
      { keywords: ['asthma', 'wheezing', 'shortness of breath', 'breathing difficulty'], possible: 'Asthma attack or respiratory infection.', action: 'Use your rescue inhaler immediately. Sit upright and stay calm. If symptoms don\'t improve in 15 minutes, seek emergency care.', severity: 'moderate' },
      { keywords: ['bronchitis', 'chest congestion', 'productive cough', 'coughing mucus'], possible: 'Bronchitis — inflammation of the airways, often viral.', action: 'Rest, drink warm fluids, use a humidifier, and avoid smoke. If you cough up blood or have high fever, see a doctor.', severity: 'moderate' },
      { keywords: ['uti', 'urinary tract infection', 'burning when peeing', 'frequent urination', 'painful urination'], possible: 'Urinary Tract Infection (UTI) — bacterial infection of the urinary system.', action: 'Drink plenty of water, urinate frequently, avoid caffeine and alcohol. You will likely need antibiotics — please visit the clinic.', severity: 'moderate' },
      { keywords: ['gastritis', 'acid reflux', 'gerd', 'heartburn', 'acid', 'burning stomach'], possible: 'Gastritis or GERD — stomach acid irritating the lining.', action: 'Avoid spicy, fatty, and acidic foods. Don\'t lie down after eating. Eat smaller meals. Take antacids. If persistent, see a doctor.', severity: 'moderate' },
      { keywords: ['arthritis', 'joint pain', 'stiff joints', 'swollen joints'], possible: 'Arthritis — inflammation of the joints.', action: 'Apply warm compresses, do gentle exercises, maintain a healthy weight. Anti-inflammatory medication may help. Consult a doctor for long-term management.', severity: 'moderate' },
      { keywords: ['sinusitis', 'sinus pain', 'facial pressure', 'stuffy nose with pain'], possible: 'Sinusitis — inflammation of the sinuses, often after a cold.', action: 'Use steam inhalation, saline nasal spray, and drink warm fluids. If symptoms last more than 10 days, you may need antibiotics.', severity: 'moderate' },
      { keywords: ['vertigo', 'spinning sensation', 'loss of balance', 'room spinning'], possible: 'Vertigo — inner ear problem causing dizziness.', action: 'Sit or lie down immediately. Move your head slowly. Avoid sudden movements. If accompanied by hearing loss, see a doctor.', severity: 'moderate' },
      { keywords: ['eczema', 'dry skin', 'itchy skin', 'atopic dermatitis'], possible: 'Eczema — chronic skin inflammation.', action: 'Use fragrance-free moisturizers, avoid hot showers, identify and avoid triggers. Topical creams can help — consult a dermatologist.', severity: 'moderate' },
      { keywords: ['psoriasis', 'scaly skin', 'silver patches'], possible: 'Psoriasis — autoimmune skin condition.', action: 'Moisturize regularly, avoid stress and alcohol, get sunlight in moderation. Specialized treatments are available — see a dermatologist.', severity: 'moderate' },
      { keywords: ['hemorrhoids', 'piles', 'bleeding when pooping', 'anal pain'], possible: 'Hemorrhoids — swollen veins in the rectum.', action: 'Eat high-fiber foods, drink water, avoid straining. Use over-the-counter creams. If bleeding persists, see a doctor.', severity: 'moderate' },
      { keywords: ['anemia', 'low iron', 'pale', 'tired all the time'], possible: 'Anemia — low red blood cells or hemoglobin.', action: 'Eat iron-rich foods (spinach, red meat, lentils), take vitamin C to help absorption. A blood test (CBC) is needed to confirm.', severity: 'moderate' },
      { keywords: ['allergy', 'allergic reaction', 'itchy eyes', 'runny nose with itching', 'sneezing fits'], possible: 'Allergic reaction to pollen, dust, food, or medication.', action: 'Avoid the trigger, take antihistamines, use saline nasal spray. If you have trouble breathing or swelling, seek emergency care.', severity: 'moderate' },

      // === SERIOUS CONDITIONS ===
      { keywords: ['malaria', 'chills', 'mosquito', 'intermittent fever', 'fever with chills'], possible: 'Malaria — a serious mosquito-borne disease common in Ethiopia.', action: 'This requires IMMEDIATE testing. Come to Ketuma Health Centre for a rapid malaria test. Drink fluids and avoid self-medication.', severity: 'serious' },
      { keywords: ['typhoid', 'contaminated water', 'prolonged fever', 'stomach pain with fever', 'rose spots'], possible: 'Typhoid fever — bacterial infection from contaminated food/water.', action: 'This needs antibiotics. Drink only boiled water. Come to the clinic for a Widal test or blood culture. Rest and eat light foods.', severity: 'serious' },
      { keywords: ['diabetes', 'blood sugar', 'high sugar', 'excessive thirst', 'frequent urination with thirst'], possible: 'Diabetes — high blood sugar levels.', action: 'Monitor your blood sugar, avoid sugary foods, drink water, and take prescribed medication. Schedule a checkup with our Internal Medicine specialist.', severity: 'serious' },
      { keywords: ['high blood pressure', 'hypertension', 'high bp'], possible: 'Hypertension — elevated blood pressure, a "silent killer".', action: 'Reduce salt intake, manage stress, exercise regularly, and take prescribed medication. Get your BP checked at the clinic today.', severity: 'serious' },
      { keywords: ['pneumonia', 'sharp chest pain when breathing', 'high fever with cough', 'difficulty breathing with fever'], possible: 'Pneumonia — serious lung infection.', action: 'This requires medical evaluation and likely antibiotics. Please visit the clinic today. Rest and stay hydrated.', severity: 'serious' },
      { keywords: ['tuberculosis', 'tb', 'coughing blood', 'night sweats', 'chronic cough', 'weight loss with cough'], possible: 'Tuberculosis (TB) — serious bacterial lung infection.', action: 'Wear a mask, isolate yourself, and come to the clinic IMMEDIATELY for a sputum test and chest X-ray. TB is curable with proper treatment.', severity: 'serious' },
      { keywords: ['hepatitis', 'jaundice', 'yellow eyes', 'yellow skin', 'dark urine'], possible: 'Hepatitis — liver inflammation, possibly viral.', action: 'This requires immediate blood tests. Avoid alcohol and fatty foods. Visit the clinic as soon as possible for evaluation.', severity: 'serious' },
      { keywords: ['kidney', 'kidney pain', 'lower back pain with fever', 'blood in urine'], possible: 'Kidney infection or kidney stones.', action: 'Drink plenty of water. If you have fever or blood in urine, come to the clinic immediately for tests.', severity: 'serious' },
      { keywords: ['heart disease', 'cardiac', 'angina', 'heart palpitations', 'irregular heartbeat'], possible: 'Heart condition — requires careful evaluation.', action: 'Avoid heavy exertion, manage stress, eat heart-healthy foods. Schedule a cardiology checkup immediately. If you have chest pain, call emergency.', severity: 'serious' },
      { keywords: ['cancer', 'tumor', 'lump', 'unexplained weight loss', 'persistent pain'], possible: 'Possible serious condition requiring thorough investigation.', action: 'Please don\'t panic, but do come to the clinic for a full evaluation. Early detection is key. Our doctors will guide you through the necessary tests.', severity: 'serious' },
      { keywords: ['hiv', 'aids', 'immune system', 'exposure risk'], possible: 'Possible HIV exposure or infection.', action: 'We offer confidential testing and counseling. Early treatment (ART) allows you to live a long, healthy life. Please visit the clinic for testing.', severity: 'serious' },
      { keywords: ['dengue', 'severe joint pain', 'rash with fever', 'pain behind eyes'], possible: 'Dengue fever — mosquito-borne viral infection.', action: 'Rest, drink plenty of fluids, and AVOID aspirin/ibuprofen. Come to the clinic for blood tests to check platelet count.', severity: 'serious' },
      { keywords: ['cholera', 'severe watery diarrhea', 'rapid dehydration', 'rice-water stool'], possible: 'Cholera — severe bacterial infection causing rapid dehydration.', action: 'Start ORS (oral rehydration salts) IMMEDIATELY and go to the nearest health facility for IV fluids. This is life-threatening without treatment.', severity: 'serious' },
      { keywords: ['epilepsy', 'seizure', 'fits', 'convulsions'], possible: 'Epilepsy or seizure disorder.', action: 'Ensure you take medication regularly, get enough sleep, and avoid triggers. If a seizure lasts more than 5 minutes, call emergency.', severity: 'serious' },
      { keywords: ['pregnancy complications', 'bleeding during pregnancy', 'severe abdominal pain pregnant', 'no fetal movement'], possible: 'Possible pregnancy complication.', action: 'This requires IMMEDIATE medical attention. Go to the clinic or hospital right away. Do not wait.', severity: 'serious' },
      { keywords: ['appendicitis', 'severe lower right abdominal pain', 'pain near belly button moving right'], possible: 'Possible appendicitis — a medical emergency.', action: 'Do NOT eat or drink anything. Go to the emergency room immediately. Surgery may be needed.', severity: 'serious' },
      { keywords: ['meningitis', 'stiff neck', 'severe headache with fever', 'sensitivity to light'], possible: 'Possible meningitis — serious brain/spinal cord infection.', action: 'This is a MEDICAL EMERGENCY. Go to the hospital immediately. Do not wait.', severity: 'serious' },
      { keywords: ['stroke', 'face drooping', 'arm weakness', 'speech difficulty', 'sudden numbness'], possible: 'Possible stroke — time is critical.', action: 'CALL 0923055713 IMMEDIATELY. Note the time symptoms started. Do NOT give food or water. Emergency treatment must begin within hours.', severity: 'serious' },
      { keywords: ['pregnant', 'pregnancy', 'baby', 'prenatal', 'maternity', 'morning sickness'], possible: 'Pregnancy — congratulations!', action: 'Take folic acid, eat nutritious foods, avoid alcohol and smoking. Schedule regular prenatal checkups with our obstetrician.', severity: 'mild' }
    ];

    // 12. DISEASE MATCHING LOGIC
    let match = null;
    for (const entry of medicalDB) {
      for (const keyword of entry.keywords) {
        if (msg.includes(keyword) || cleanMsg.includes(keyword)) {
          match = entry;
          break;
        }
      }
      if (match) break;
    }

    // 13. BUILD RESPONSE
    let reply = '';
    if (match) {
      const severityEmoji = match.severity === 'mild' ? '🟢' : match.severity === 'moderate' ? '🟡' : '';
      const severityLabel = match.severity.charAt(0).toUpperCase() + match.severity.slice(1);
      reply = `${severityEmoji} **Severity: ${severityLabel}**\n\n🔍 **Possible Diagnosis:** ${match.possible}\n\n💊 **What To Do Now:** ${match.action}\n\n🏥 **Recommendation:** We strongly recommend visiting Ketuma Health Centre for a proper checkup. Our doctors can provide personalized care. Would you like to book an appointment?`;
    } else {
      reply = ` Thank you for sharing.\n\nWhile I can't provide a specific diagnosis for "${cleanMsg || message}", here's what I recommend:\n\n💊 **What To Do Now:** Please rest, drink plenty of fluids, and avoid activities that worsen your symptoms.\n\n **Recommendation:** Since your symptoms could have many causes, the safest option is to book an appointment with our doctors for a proper evaluation. Early diagnosis is always better!\n\nWould you like to book an appointment now?`;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ reply: 'Sorry, I am having trouble connecting to the server. Please call 0923055713.' });
  }
}
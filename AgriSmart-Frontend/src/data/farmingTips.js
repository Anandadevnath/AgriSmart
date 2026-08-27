// Curated farming tips & guidelines for AgriSmart BD (bilingual).
// Each tip: { id, category, title, body, tags }
export const FARMING_TIPS = [
  // ---- Disease & Pest ----
  {
    id: 1,
    category: 'disease',
    title: { en: 'Spot leaf disease early', bn: 'পাতার রোগ তাড়াতাড়ি চিনুন' },
    body: {
      en: 'Walk your field every morning. Yellow or spotted leaves can spread disease fast — photograph affected leaves with the AgriSmart scan tool for an instant diagnosis before it reaches the whole crop.',
      bn: 'প্রতি সকালে জমি ঘুরে দেখুন। হলুদ বা দাগযুক্ত পাতা রোগ দ্রুত ছড়ায় — পুরো ফসলে ছড়ানোর আগে আক্রান্ত পাতার ছবি তুলে AgriSmart স্ক্যান টুলে সাথে সাথে পরীক্ষা করুন।',
    },
    tags: ['disease', 'scan'],
  },
  {
    id: 2,
    category: 'disease',
    title: { en: 'Remove infected plants quickly', bn: 'আক্রান্ত গাছ দ্রুত সরিয়ে ফেলুন' },
    body: {
      en: 'Pull out and destroy severely infected plants instead of spraying more pesticide. This stops the disease spreading and saves money on chemicals.',
      bn: 'মারাত্মক আক্রান্ত গাছ টেনে তুলে ধ্বংস করুন, বেশি কীটনাশক স্প্রে করার বদলে। এতে রোগ ছড়ানো বন্ধ হবে এবং কীটনাশকের খরচও বাঁচবে।',
    },
    tags: ['disease', 'pest'],
  },
  {
    id: 3,
    category: 'disease',
    title: { en: 'Rotate crops between seasons', bn: 'মৌসুমে মৌসুমে ফসল বদলান' },
    body: {
      en: 'Growing the same crop in the same land every season lets soil-borne pests build up. Rotating with a different family (e.g. paddy after pulses) keeps the soil healthy and cuts disease.',
      bn: 'একই জমিতে প্রতি মৌসুমে একই ফসল চাষ করলে মাটিবাহিত পোকা বেড়ে যায়। ভিন্ন জাতের ফসল (যেমন ডালের পরে ধান) চাষ করলে মাটি সুস্থ থাকে এবং রোগ কমে।',
    },
    tags: ['disease', 'soil'],
  },
  // ---- Soil & Water ----
  {
    id: 4,
    category: 'soil',
    title: { en: 'Test soil before planting', bn: 'চাষের আগে মাটি পরীক্ষা করুন' },
    body: {
      en: 'A simple soil test (pH and NPK) tells you exactly which fertilizer your land needs. You will often save 20–30% on fertilizer by not applying what the soil already has.',
      bn: 'সহজ মাটি পরীক্ষা (pH ও NPK) জানিয়ে দেয় আপনার জমিতে ঠিক কোন সার দরকার। মাটিতে যা আগে থেকেই আছে তা আর না দিলে সারের ২০–৩০% খরচ বাঁচে।',
    },
    tags: ['soil', 'fertilizer'],
  },
  {
    id: 5,
    category: 'soil',
    title: { en: 'Use compost and cow dung', bn: 'জৈব সার ও গোবর ব্যবহার করুন' },
    body: {
      en: 'Mixing compost or decomposed cow dung improves soil structure and water holding. Add it 2–3 weeks before planting so it has time to break down.',
      bn: 'কম্পোস্ট বা পচা গোবর মেশালে মাটির গঠন ও পানি ধারণ ক্ষমতা বাড়ে। রোপণের ২–৩ সপ্তাহ আগে মেশান, যেন ভালোভাবে পচে যায়।',
    },
    tags: ['soil', 'organic'],
  },
  {
    id: 6,
    category: 'soil',
    title: { en: 'Water at the right time of day', bn: 'সঠিক সময়ে পানি দিন' },
    body: {
      en: 'Water early morning or late evening when evaporation is lowest. This gives crops more usable water and cuts your irrigation bill.',
      bn: 'সকালে বা সন্ধ্যায় পানি দিন, যখন বাষ্পীভবন কম থাকে। এতে ফসল বেশি পানি পায় এবং সেচের খরচ কমে।',
    },
    tags: ['water', 'irrigation'],
  },
  // ---- Weather & Climate ----
  {
    id: 7,
    category: 'weather',
    title: { en: 'Act on weather alerts', bn: 'আবহাওয়ার সতর্কতায় ব্যবস্থা নিন' },
    body: {
      en: 'When rain or storms are forecast, delay pesticide spraying and move harvested produce to dry storage. AgriSmart’s weather panel helps you plan the week ahead.',
      bn: 'বৃষ্টি বা ঝড়ের পূর্বাভাস থাকলে কীটনাশক স্প্রে স্থগিত রাখুন এবং ঘরে তোলা ফসল শুকনো জায়গায় সরান। AgriSmart-এর আবহাওয়া প্যানেল এক সপ্তাহের পরিকল্পনায় সাহায্য করে।',
    },
    tags: ['weather', 'alert'],
  },
  {
    id: 8,
    category: 'weather',
    title: { en: 'Dry paddy before storage', bn: 'মজুতের আগে ধান ভালোভাবে শুকান' },
    body: {
      en: 'Paddy stored with more than 13–14% moisture rots and breeds weevils. Sun-dry for 2–3 days and test a handful — grains should crack, not bend.',
      bn: '১৩–১৪% এর বেশি আর্দ্রতায় মজুত করা ধান পচে যায় ও পোকা ধরে। ২–৩ দিন রোদে শুকিয়ে মুঠোভর্তি ধান পরীক্ষা করুন — দানা ভাঙবে, বাঁকবে না।',
    },
    tags: ['storage', 'postharvest'],
  },
  // ---- Marketing & Selling ----
  {
    id: 9,
    category: 'market',
    title: { en: 'Check market price before selling', bn: 'বিক্রির আগে বাজারদর দেখুন' },
    body: {
      en: 'Always check the AgriSmart live price panel before negotiating. Knowing today’s wholesale price means you can refuse a lowball offer with confidence.',
      bn: 'দরদামের আগে সর্বদা AgriSmart-এর লাইভ দাম দেখুন। আজকের পাইকারি দাম জানা থাকলে কম দামের প্রস্তাব আত্মবিশ্বাসের সঙ্গে ফিরিয়ে দিতে পারবেন।',
    },
    tags: ['market', 'price'],
  },
  {
    id: 10,
    category: 'market',
    title: { en: 'Sell graded produce for more', bn: 'ভালো মানের ফসল ভাগ করে বিক্রি করুন' },
    body: {
      en: 'Separate large, unblemished produce from smaller pieces. Graded lots regularly fetch 10–20% more than mixed baskets, and buyers find them faster on the marketplace.',
      bn: 'বড় ও ত্রুটিহীন ফসল আলাদা করুন। মানভেদে বাছাই করা ফসলে সাধারণত ১০–২০% বেশি দাম পাওয়া যায় এবং বাজারে ক্রেতাও দ্রুত খুঁজে পায়।',
    },
    tags: ['market', 'quality'],
  },
  {
    id: 11,
    category: 'market',
    title: { en: 'Use a direct photo in your listing', bn: 'তালিকায় সঠিক ছবি দিন' },
    body: {
      en: 'Clear, well-lit photos of your actual harvest build buyer trust. Show the crop, not the packaging — listings with real photos get more chats and faster sales.',
      bn: 'আপনার আসল ফসলের পরিষ্কার ছবি ক্রেতার আস্থা বাড়ায়। প্যাকেজিং নয়, ফসল দেখান — সত্যিকারের ছবির তালিকায় বেশি চ্যাট ও দ্রুত বিক্রি হয়।',
    },
    tags: ['market', 'listing'],
  },
  // ---- General Best Practice ----
  {
    id: 12,
    category: 'general',
    title: { en: 'Keep a simple farm diary', bn: 'সহজ কৃষি ডায়েরি রাখুন' },
    body: {
      en: 'Note sowing date, fertilizer applied, and harvest yield each season. Over two years this small diary becomes your best guide to what works on your land.',
      bn: 'প্রতি মৌসুমে বপনের তারিখ, সারের পরিমাণ ও ফলন লিখে রাখুন। দুই বছরে এই ছোট ডায়েরিই আপনার জমির জন্য সেরা গাইড হয়ে উঠবে।',
    },
    tags: ['general', 'planning'],
  },
  {
    id: 13,
    category: 'general',
    title: { en: 'Buy seeds from certified sources', bn: 'সনদযুক্ত উৎস থেকে বীজ কিনুন' },
    body: {
      en: 'Certified seed is more expensive but germinates reliably and resists disease better. The few extra taka pay back many times in yield at harvest.',
      bn: 'সনদযুক্ত বীজ একটু দামি হলেও নির্ভরযোগ্যভাবে গজায় এবং রোগ প্রতিরোধে ভালো। অল্প অতিরিক্ত খরচ ফলনের মাধ্যমে বহুগুণ ফিরে আসে।',
    },
    tags: ['general', 'seed'],
  },
];

export const TIP_CATEGORIES = [
  { value: 'all', en: 'All Tips', bn: 'সব টিপস' },
  { value: 'disease', en: 'Disease & Pests', bn: 'রোগ ও পোকা' },
  { value: 'soil', en: 'Soil & Water', bn: 'মাটি ও পানি' },
  { value: 'weather', en: 'Weather & Storage', bn: 'আবহাওয়া ও মজুত' },
  { value: 'market', en: 'Marketing & Selling', bn: 'বাজার ও বিক্রি' },
  { value: 'general', en: 'General Tips', bn: 'সাধারণ টিপস' },
];

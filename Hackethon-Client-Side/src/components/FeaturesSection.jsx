import React from "react";
import { useLanguage } from '../context/LanguageContext';
import { FeatureCard } from "./common/FeatureCard";

export default function FeaturesSection() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  const features = [
    {
      icon: '🩺',
      title: isBn ? 'ফসলের রোগ পরীক্ষা (ছবি)' : 'Crop Disease Check by Photo',
      description: isBn ? 'স্মার্টফোনের ক্যামেরায় ফসলের ছবি তুলে রোগ শনাক্ত করুন এবং সহজ সমাধান পান।' : 'Use your smartphone camera to detect crop diseases instantly and get simple solutions.',
    },
    {
      icon: '🏪',
      title: isBn ? 'মধ্যস্বত্ত্বভোগী ছাড়া বাজার' : 'Zero-Intermediary Market',
      description: isBn ? 'মধ্যস্বত্ত্বভোগী ছাড়াই ফসল সরাসরি ক্রেতার কাছে বিক্রি করে ন্যায্য দাম নিশ্চিত করুন।' : 'Sell your harvest directly to real buyers with no middlemen — keep fair prices.',
    },
    {
      icon: '⛅',
      title: isBn ? 'লাইভ আবহাওয়া ও দাম' : 'Live Weather & Price Alerts',
      description: isBn ? 'স্থানীয় আবহাওয়ার আপডেট ও বাজারদর পেয়ে অপ্রত্যাশিত ক্ষতি থেকে ফসল রক্ষা করুন।' : 'Rapid, localized weather updates and market prices protect your yields from unexpected loss.',
    },
    {
      icon: '💬',
      title: isBn ? 'ক্রেতার সঙ্গে সরাসরি চ্যাট' : 'Direct Buyer Chat',
      description: isBn ? 'ক্রেতা ও কৃষকের মধ্যে সরাসরি চ্যাট — সহজ যোগাযোগ, দ্রুত দরদাম ও লেনদেন।' : 'Easy real-time chat between buyers and farmers for quick negotiation and deals.',
    },
    {
      icon: '🚨',
      title: isBn ? 'জরুরি SMS সতর্কতা' : 'Emergency SMS Notifications',
      description: isBn ? 'জরুরি পরিস্থিতিতে তাৎক্ষণিক SMS সতর্কতা — ফসল রক্ষায় দ্রুত ব্যবস্থা নিন।' : 'Get immediate SMS alerts in emergencies so you can act before it is too late.',
    },
    {
      icon: '📈',
      title: isBn ? 'সহজ বিক্রয় ড্যাশবোর্ড' : 'Simplified Sales Dashboard',
      description: isBn ? 'সহজ ড্যাশবোর্ডে দামের প্রবণতা ও বিক্রয় দেখুন, আরও ভালো সিদ্ধান্ত নিন।' : 'A simple dashboard shows clear price trends and sales so you can decide better.',
    },
    {
      icon: '💡',
      title: isBn ? 'কৃষি টিপস ও নির্দেশনা' : 'Curated Farming Tips',
      description: isBn ? 'বিশেষজ্ঞদের পরামর্শ ও ফসল পরিচর্যার গাইডলাইন — প্রতিদিনের কৃষিকাজে সহায়তা।' : 'Curated tips and guidelines from experts to support your daily farm work.',
    },
    {
      icon: '🌐',
      title: isBn ? 'দ্বিভাষিক সমর্থন' : 'Bilingual Support (বাংলা / English)',
      description: isBn ? 'বাংলা ও ইংরেজি — প্রতিটি কৃষক নিজের ভাষায় ব্যবহার করতে পারবেন।' : 'Use the platform in Bangla or English — every farmer is comfortable in their own language.',
    },
  ];

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-[#e9fff4] via-[#f3fff9] to-[#e7ffee] overflow-hidden">
      {/* Soft Glowing Blobs */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-200/50 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-emerald-200/50 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-[1300px] mx-auto relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-green-950">
            {isBn ? 'AgriSmart BD এর মূল ফিচার' : 'AgriSmart BD Core Features'}
          </h2>
          <p className="text-green-800/70 mt-3 max-w-2xl mx-auto">
            {isBn ? 'কৃষক ও ক্রেতার জন্য — ব্যবহারে সহজ, সংযোগে সরাসরি, সিদ্ধান্তে স্মার্ট।' : 'Built for farmers and buyers — easy to use, direct to connect, smart to decide.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

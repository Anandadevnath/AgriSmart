import React from "react";
import { useLanguage } from '../context/LanguageContext';
import { FeatureCard } from "./common/FeatureCard";
import { Scan, Store, TrendingUp, MessageCircle, LayoutGrid } from "lucide-react";

export default function FeaturesSection() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  const features = [
    {
      icon: Scan,
      title: isBn ? 'ফসলের রোগ পরীক্ষা (ছবি)' : 'Crop Disease Check by Photo',
      description: isBn ? 'স্মার্টফোনের ক্যামেরায় ফসলের ছবি তুলে রোগ শনাক্ত করুন এবং সহজ সমাধান পান।' : 'Use your smartphone camera to detect crop diseases instantly and get simple solutions.',
    },
    {
      icon: Store,
      title: isBn ? 'মধ্যস্বত্ত্বভোগী ছাড়া বাজার' : 'Zero-Intermediary Market',
      description: isBn ? 'মধ্যস্বত্ত্বভোগী ছাড়াই ফসল সরাসরি ক্রেতার কাছে বিক্রি করে ন্যায্য দাম নিশ্চিত করুন।' : 'Sell your harvest directly to real buyers with no middlemen — keep fair prices.',
    },
    {
      icon: TrendingUp,
      title: isBn ? 'লাইভ আবহাওয়া ও দাম' : 'Live Weather & Price Alerts',
      description: isBn ? 'স্থানীয় আবহাওয়ার আপডেট ও বাজারদর পেয়ে অপ্রত্যাশিত ক্ষতি থেকে ফসল রক্ষা করুন।' : 'Rapid, localized weather updates and market prices protect your yields from unexpected loss.',
    },
    {
      icon: MessageCircle,
      title: isBn ? 'ক্রেতার সঙ্গে সরাসরি চ্যাট' : 'Direct Buyer Chat',
      description: isBn ? 'ক্রেতা ও কৃষকের মধ্যে সরাসরি চ্যাট — সহজ যোগাযোগ, দ্রুত দরদাম ও লেনদেন।' : 'Easy real-time chat between buyers and farmers for quick negotiation and deals.',
    },
    {
      icon: LayoutGrid,
      title: isBn ? 'সহজ বিক্রয় ড্যাশবোর্ড' : 'Simplified Sales Dashboard',
      description: isBn ? 'সহজ ড্যাশবোর্ডে দামের প্রবণতা ও বিক্রয় দেখুন, আরও ভালো সিদ্ধান্ত নিন।' : 'A simple dashboard shows clear price trends and sales so you can decide better.',
    },
  ];

  return (
    <section className="relative py-24 px-5 md:px-8 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-[560px] mb-14">
          <div className="inline-flex items-center gap-2 text-[13px] font-bold tracking-[0.08em] uppercase text-[#0b3b2a] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#7cc24a]" />
            {isBn ? 'মূল ফিচার' : 'Core capabilities'}
          </div>
          <h2 className="font-display font-extrabold text-[#0b3b2a] text-3xl md:text-[38px] tracking-[-0.02em] leading-[1.15] mb-4">
            {isBn ? 'কৃষক ও ক্রেতার জন্য — এক জায়গায় সবকিছু' : 'Everything a farmer and a buyer need — in one place'}
          </h2>
          <p className="text-[#47564c] leading-[1.8]">
            {isBn ? 'ব্যবহারে সহজ, সংযোগে সরাসরি, সিদ্ধান্তে স্মার্ট।' : 'Easy to use, direct to connect, smart to decide.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e4eae3] border border-[#e4eae3] rounded-[16px] overflow-hidden">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
}
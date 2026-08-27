import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { FooterSection } from './common/FooterSection';

export default function Footer() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  return (
    <footer className="relative bg-[#053d2b] text-[#e6ffe6] pt-20 pb-12 border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">

          {/* BRAND COLUMN */}
          <div className="col-span-1 lg:col-span-2">
            <motion.div whileHover={{ scale: 1.04 }} className="inline-flex items-center gap-2 mb-6 no-underline">
              <span className="text-3xl">🌾</span>
              <span className="text-2xl font-extrabold">
                <span className="text-[#7ee2a0]">Agri</span>
                <span className="text-white">Smart</span>
                <span className="text-[#7ee2a0] ml-0.5 text-sm font-normal align-super">BD</span>
              </span>
            </motion.div>
            <p className="text-sm leading-relaxed text-[#c0e0c0] mb-8 max-w-xs">
              {isBn
                ? 'কৃষকের আলো — ফসলের রোগ সনাক্তকরণ, মধ্যস্বত্ত্বভোগী ছাড়া সরাসরি বাজার, লাইভ আবহাওয়া ও দামের আপডেট এবং ক্রেতার সঙ্গে সরাসরি চ্যাট।'
                : 'Smart Farming & Direct Marketplace — crop disease detection by photo, a zero-middleman market, live weather & price alerts, and direct chat with real buyers.'}
            </p>

            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} className="w-8 h-8 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#0af58a] hover:text-[#053d2b] transition-all" href="#">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* LINKS COLUMNS */}
          <FooterSection
            title={isBn ? 'দ্রুত লিঙ্ক' : 'Quick Links'}
            items={[]}
            links={[
              { label: isBn ? 'হোম' : 'Home', to: '/' },
              { label: isBn ? 'বাজার' : 'Marketplace', to: '/marketplace' },
              { label: isBn ? 'দাম' : 'Prices', to: '/prices' },
              { label: isBn ? 'চ্যাট' : 'Chat', to: '/chat' },
              { label: isBn ? 'আমাদের সম্পর্কে' : 'About', to: '/about' },
            ]}
          />
          <FooterSection
            title={isBn ? 'সরঞ্জাম' : 'Tools'}
            items={[]}
            links={[
              { label: isBn ? 'ফসল পরীক্ষা (AI)' : 'Scan Crop (AI)', to: '/scan-crop' },
              { label: isBn ? 'ড্যাশবোর্ড' : 'Dashboard', to: '/dashboard' },
              { label: isBn ? 'লগইন' : 'Login', to: '/login' },
              { label: isBn ? 'রেজিস্টার' : 'Register', to: '/register' },
            ]}
          />
          <FooterSection
            title={isBn ? 'সম্পদ' : 'Resources'}
            items={isBn ? ['কৃষি টিপস', 'সাহায্য কেন্দ্র', 'প্রশ্নাবলি'] : ['Farming Tips', 'Help Center', 'FAQs']}
          />
        </div>

        {/* BOTTOM SECTION */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-xs text-[#a0c0a0]">
          <div className="md:col-span-3">© 2026 AgriSmart BD. All rights reserved.</div>

          <div className="md:col-span-6 flex flex-wrap gap-4 justify-center text-[#c0e0c0]">
             <div className="flex items-center gap-1.5"><MapPin size={14} /> Dhaka, Bangladesh</div>
             <div className="flex items-center gap-1.5"><Phone size={14} /> +880 16123</div>
             <div className="flex items-center gap-1.5"><Mail size={14} /> support@agrismart.bd</div>
          </div>

          <div className="md:col-span-3 flex justify-end">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-xs">
              <span>🌾 {isBn ? 'কৃষকের আলো' : 'কৃষকের আলো'}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

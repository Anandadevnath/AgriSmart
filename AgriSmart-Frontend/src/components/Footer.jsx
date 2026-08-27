import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, Wheat } from "lucide-react";
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { FooterSection } from './common/FooterSection';

export default function Footer() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  return (
    <footer className="relative bg-[#0b3b2a] text-white pt-16 pb-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-14">

          {/* BRAND COLUMN */}
          <div className="col-span-1 lg:col-span-2">
            <div className="inline-flex items-center gap-2.5 mb-6">
              <span className="w-9 h-9 rounded-[10px] bg-[#7cc24a] flex items-center justify-center text-[#0b3b2a]">
                <Wheat className="w-5 h-5" strokeWidth={2.2} />
              </span>
              <span className="font-display font-extrabold text-xl tracking-tight">
                AgriSmart
                <span className="text-[#7cc24a] ml-1 text-xs font-bold align-super">BD</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/65 mb-8 max-w-xs">
              {isBn
                ? 'কৃষকের আলো — ফসলের রোগ সনাক্তকরণ, মধ্যস্বত্ত্বভোগী ছাড়া সরাসরি বাজার, লাইভ আবহাওয়া ও দামের আপডেট এবং ক্রেতার সঙ্গে সরাসরি চ্যাট।'
                : 'Smart Farming & Direct Marketplace — crop disease detection by photo, a zero-middleman market, live weather & price alerts, and direct chat with real buyers.'}
            </p>

            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} className="w-9 h-9 bg-white/5 border border-white/12 rounded-[10px] flex items-center justify-center text-white/70 hover:bg-[#7cc24a] hover:text-[#0b3b2a] hover:border-[#7cc24a] transition-all duration-200" href="#" aria-label="social">
                  <Icon size={15} strokeWidth={2} />
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
        <div className="pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-xs text-white/55">
          <div className="md:col-span-3">© 2026 AgriSmart BD. All rights reserved.</div>

          <div className="md:col-span-6 flex flex-wrap gap-5 justify-center">
            <span className="inline-flex items-center gap-1.5"><MapPin size={13} strokeWidth={2} /> Dhaka, Bangladesh</span>
            <span className="inline-flex items-center gap-1.5"><Phone size={13} strokeWidth={2} /> +880 16123</span>
            <span className="inline-flex items-center gap-1.5"><Mail size={13} strokeWidth={2} /> support@agrismart.bd</span>
          </div>

          <div className="md:col-span-3 flex justify-end">
            <span className="inline-flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-[8px] border border-white/10 text-xs text-white/70">
              <Wheat size={12} className="text-[#7cc24a]" /> {isBn ? 'কৃষকের আলো' : 'The farmer’s light'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
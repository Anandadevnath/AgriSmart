import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import heroBg from '../assets/bg.png';
import { Button } from './common/Button';
import { Link } from 'react-router-dom';

export default function HeroBanner() {
  const bgImage = `linear-gradient(180deg, rgba(2, 20, 12, 0.45), rgba(4, 10, 6, 0.6)), url(${heroBg})`;
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  return (
    <section className="relative min-h-[70vh] sm:min-h-[85vh] md:min-h-[98vh] flex items-center text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center saturate-[0.95] brightness-[0.7] z-0"
        style={{ backgroundImage: bgImage }}
      />

      <div className="relative z-10 w-full max-w-[1360px] mx-auto grid gap-9 px-4 py-24 items-center md:grid-cols-2">
        <motion.div
          className="text-white"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } },
          }}
        >
          <div className="mb-4 flex items-center gap-3 flex-wrap">
            <span className="inline-block bg-[#0b6b3a]/40 text-[#e7fff0] text-sm px-4 py-1.5 rounded-full font-semibold shadow-lg backdrop-blur-sm">
              {isBn ? 'স্মার্ট ফার্মিং ও সরাসরি বাজার' : 'Smart Farming & Direct Marketplace'}
            </span>
            <span className="inline-block bg-white/10 text-[#e7fff0] text-sm px-4 py-1.5 rounded-full font-semibold shadow-lg backdrop-blur-sm">
              {isBn ? 'কৃষকের আলো' : 'কৃষকের আলো'}
            </span>
          </div>

          <motion.h1 className="mb-5 font-extrabold text-4xl sm:text-5xl md:text-[48px] lg:text-[56px] text-white" style={{ textShadow: '0 6px 18px rgba(3,10,6,0.35)', letterSpacing: '0.6px', lineHeight: '1.08' }} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            {isBn ? (
              <>
                ফসলের রোগ ধরা পড়ুক,
                <br />
                লাভ নিশ্চিত হোক সরাসরি।
              </>
            ) : (
              <>
                Detect crop disease,
                <br />
                sell directly & profit fairly.
              </>
            )}
          </motion.h1>

          <motion.p className="max-w-[640px] text-[rgba(235,249,237,0.95)] mb-7 text-base md:text-lg" style={{ lineHeight: 1.9, letterSpacing: '0.2px' }} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            {isBn ? (
              'ছবি তুলে ফসলের রোগ শনাক্ত করুন, মধ্যস্বত্ত্বভোগী ছাড়া সরাসরি ক্রেতার সঙ্গে বিক্রি করুন, আর লাইভ আবহাওয়া ও বাজারদরের আপডেট পেয়ে সঠিক সিদ্ধান্ত নিন।'
            ) : (
              'Upload a photo to detect crop diseases, sell straight to real buyers with no middlemen, and make smarter decisions with live weather & market-price updates.'
            )}
          </motion.p>

          <motion.div className="flex gap-5 items-center flex-wrap" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <Link to="/scan-crop" className="no-underline">
              <Button variant="primary" className="bg-[#0b6b3a] hover:bg-[#095730] transition-colors shadow-lg px-8 py-3 rounded-xl text-lg font-bold">
                {isBn ? 'ফসল পরীক্ষা করুন' : 'Scan Your Crop'} <span className="font-extrabold">→</span>
              </Button>
            </Link>

            <Link to="/marketplace" className="no-underline">
              <Button variant="secondary">
                {isBn ? 'বাজার ঘুরে দেখুন' : 'Explore Marketplace'}
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right-side info card */}
        <div className="flex items-center justify-end">
          <div className="w-full max-w-[360px] space-y-4">
            <div className="bg-white/8 backdrop-blur-md rounded-[12px] p-5 shadow-[0_12px_36px_rgba(6,40,20,0.12)] border border-white/10 text-white">
              <div className="text-sm font-semibold mb-2 text-[#eafbf0]">{isBn ? 'আমাদের লক্ষ্য' : 'Our Mission'}</div>
              <div className="text-[14px] leading-6 text-[rgba(235,249,237,0.95)] mb-4">
                {isBn ? (
                  'কৃষকদের ফসল রক্ষা করতে, মধ্যস্বত্ত্বভোগী ছাড়া ন্যায্য দাম পেতে এবং সময়মতো জরুরি সাহায্য পেতে স্মার্ট প্রযুক্তির মাধ্যমে ক্ষমতায়ন করা।'
                ) : (
                  'Empowering farmers with smart technology to protect crops from disease, earn fair prices with no middlemen, and get urgent help in time.'
                )}
              </div>
              <Link className="inline-flex items-center gap-2 text-sm font-semibold bg-white/6 px-3 py-2 rounded-md no-underline text-white" to="/about">
                {isBn ? 'আরও জানুন' : 'Learn More'} <span className="opacity-90">→</span>
              </Link>
            </div>

            <div className="bg-white/8 backdrop-blur-md rounded-[12px] p-5 shadow-[0_12px_36px_rgba(6,40,20,0.12)] border border-white/10 text-white">
              <div className="text-sm font-semibold mb-2 text-[#eafbf0]">{isBn ? 'কেন AgriSmart?' : 'Why AgriSmart?'}</div>
              <ul className="text-[14px] leading-6 text-[rgba(235,249,237,0.95)] space-y-1.5 list-none p-0 m-0">
                <li>🔍 {isBn ? 'ছবিতে ফসলের রোগ শনাক্ত' : 'AI crop disease detection by photo'}</li>
                <li>🤝 {isBn ? 'মধ্যস্বত্ত্বভোগী ছাড়া সরাসরি বিক্রি' : 'Zero-middleman direct selling'}</li>
                <li>⛅ {isBn ? 'লাইভ আবহাওয়া ও দাম' : 'Live weather & market prices'}</li>
                <li>💬 {isBn ? 'ক্রেতার সঙ্গে সরাসরি চ্যাট' : 'Direct chat with real buyers'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

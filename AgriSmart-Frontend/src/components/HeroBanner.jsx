import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Button } from './common/Button';
import { Link } from 'react-router-dom';
import { Scan, ArrowRight, CloudSun, TrendingUp, MessageCircle, MapPin } from 'lucide-react';
import { useWeatherSnapshot } from '../hooks/useWeatherSnapshot';

export default function HeroBanner() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const { weather } = useWeatherSnapshot('Dhaka');

  const quickStats = [
    { value: '10K+', label: isBn ? 'ফসল পরীক্ষা' : 'Crops scanned' },
    { value: '5K+', label: isBn ? 'কৃষক যুক্ত' : 'Farmers connected' },
    { value: '৳50Cr+', label: isBn ? 'ন্যায্য মূল্য' : 'Fair price secured' },
  ];

  return (
    <section className="relative pt-[72px] bg-[#f6f8f5] overflow-hidden">
      {/* Hairline ground texture — faint leaf grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{ backgroundImage: 'linear-gradient(rgba(11,59,42,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(11,59,42,0.035) 1px, transparent 1px)', backgroundSize: '72px 72px' }}
      />

      <div className="relative max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-24 grid gap-12 lg:grid-cols-12 lg:gap-10 items-center">
        {/* LEFT — editorial headline + CTAs */}
        <motion.div
          className="lg:col-span-7"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="flex items-center gap-2.5 mb-7">
            <span className="inline-flex items-center gap-2 text-[13px] font-bold tracking-[0.08em] uppercase text-[#0b3b2a] bg-white border border-[#0b3b2a]/10 rounded-[10px] px-3.5 py-2">
              <CloudSun className="w-4 h-4 text-[#7cc24a]" />
              {isBn ? 'স্মার্ট ফার্মিং ও সরাসরি বাজার' : 'Smart Farming · Direct Marketplace'}
            </span>
            {weather && (
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#47564c]">
                <MapPin className="w-3.5 h-3.5 text-[#9aa79e]" />
                {weather.location} {weather.temp}
              </span>
            )}
          </motion.div>

          <motion.h1 variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
            className="font-display font-extrabold text-[#0b3b2a] text-[38px] sm:text-5xl md:text-[52px] lg:text-[58px] leading-[1.06] tracking-[-0.03em] mb-7 max-w-[15ch]">
            {isBn ? (
              <>
                ফসলের রোগ ধরা পড়ুক,
                <span className="text-[#7cc24a]"> লাভ নিশ্চিত হোক</span> সরাসরি।
              </>
            ) : (
              <>
                Detect crop disease,
                <span className="text-[#7cc24a]"> sell directly</span> &amp; profit fairly.
              </>
            )}
          </motion.h1>

          <motion.p variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            className="text-[#47564c] max-w-[52ch] text-base md:text-lg leading-[1.85] mb-9">
            {isBn ? (
              'ছবি তুলে ফসলের রোগ শনাক্ত করুন, মধ্যস্বত্ত্বভোগী ছাড়া সরাসরি ক্রেতার সঙ্গে বিক্রি করুন, আর লাইভ আবহাওয়া ও বাজারদরের আপডেট পেয়ে সঠিক সিদ্ধান্ত নিন।'
            ) : (
              'Upload a photo to detect crop diseases, sell straight to real buyers with no middlemen, and make smarter decisions with live weather and market-price updates.'
            )}
          </motion.p>

          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="flex items-center gap-4 flex-wrap">
            <Link to="/scan-crop" className="no-underline">
              <Button variant="primary" size="lg" className="gap-2.5">
                <Scan className="w-5 h-5" strokeWidth={2.4} />
                {isBn ? 'ফসল পরীক্ষা করুন' : 'Scan Your Crop'}
              </Button>
            </Link>
            <Link to="/marketplace" className="no-underline">
              <Button variant="secondary" size="lg" className="gap-2">
                {isBn ? 'বাজার ঘুরে দেখুন' : 'Explore Marketplace'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Ledger stat row */}
          <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-[#0b3b2a]/8 pt-7 max-w-[560px]">
            {quickStats.map((s) => (
              <div key={s.label}>
                <div className="font-display font-extrabold text-[#0b3b2a] text-2xl md:text-[28px] tracking-tight tabular">{s.value}</div>
                <div className="text-[13px] font-medium text-[#6f7d73] mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — deep ink product panel */}
        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="bg-[#0b3b2a] text-white rounded-[18px] p-7 md:p-9 relative overflow-hidden">
            <div className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#7cc24a]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-[#7cc24a]/8 blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="text-[13px] font-bold tracking-[0.1em] uppercase text-[#7cc24a]">
                  {isBn ? 'আজকের আপডেট' : "Today's Snapshot"}
                </div>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-white/70">
                  <TrendingUp className="w-4 h-4 text-[#7cc24a]" />
                  {isBn ? 'লাইভ' : 'LIVE'}
                </div>
              </div>

              {/* Weather block */}
              <div className="flex items-end justify-between mb-7 pb-7 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-1.5 text-[13px] font-medium text-white/70 mb-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {weather?.location || 'Dhaka'}
                  </div>
                  <div className="font-display font-extrabold text-5xl tracking-tight tabular">
                    {weather?.temp ?? '—'}
                  </div>
                </div>
                {weather && (
                  <div className="text-right text-[13px] leading-relaxed text-white/80">
                    <div>{isBn ? 'সর্বোচ্চ' : 'Max'} {weather.todayMax}</div>
                    <div>{isBn ? 'সর্বনিম্ন' : 'Min'} {weather.todayMin}</div>
                    <div className="text-[#a9d884]">{isBn ? 'বৃষ্টির সম্ভাবনা' : 'Rain'} {weather.rainProb}%</div>
                  </div>
                )}
              </div>

              {/* Feature bullets */}
              <ul className="space-y-3.5 mb-7">
                {[
                  { icon: Scan, text: isBn ? 'ছবিতে ফসলের রোগ শনাক্ত' : 'AI crop disease detection by photo' },
                  { icon: TrendingUp, text: isBn ? 'মধ্যস্বত্ত্বভোগী ছাড়া সরাসরি বিক্রি' : 'Zero-middleman direct selling' },
                  { icon: CloudSun, text: isBn ? 'লাইভ আবহাওয়া ও বাজারদর' : 'Live weather & market prices' },
                  { icon: MessageCircle, text: isBn ? 'ক্রেতার সঙ্গে সরাসরি চ্যাট' : 'Direct chat with real buyers' },
                ].map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <li key={i} className="flex items-start gap-3 text-[14.5px] leading-snug text-white/85">
                      <span className="w-7 h-7 rounded-[8px] bg-[#7cc24a]/15 text-[#7cc24a] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" strokeWidth={2.2} />
                      </span>
                      {f.text}
                    </li>
                  );
                })}
              </ul>

              <Link to="/about" className="no-underline">
                <Button variant="accent" size="sm" className="w-full gap-2">
                  {isBn ? 'AgriSmart সম্পর্কে জানুন' : 'About AgriSmart BD'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
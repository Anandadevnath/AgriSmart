import React from "react";
import { useLanguage } from '../context/LanguageContext';
import { motion } from "framer-motion";
import { Button } from "./common/Button";
import { Link } from "react-router-dom";

export default function CallToAction() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  return (
    <section className="relative overflow-hidden text-white bg-[linear-gradient(180deg,#0aa460_0%,#0a8f58_60%,#067e4b_100%)] py-24 px-4">
      <div className="relative max-w-[1180px] mx-auto text-center px-4">
        <motion.h2 initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-lg">
          {isBn ? 'কৃষকের আলোয় যুক্ত হোন' : 'Be the Light for Farmers'}
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-white/90 text-lg mb-8">
          {isBn ? 'ফসল রক্ষা করুন, মধ্যস্বত্ত্বভোগী ছাড়া বিক্রি করুন, আর লাইভ আপডেট পেয়ে লাভ নিশ্চিত করুন — বাংলাদেশের কৃষকদের সঙ্গে।' : 'Protect your crops, sell without middlemen, and secure fair profit with live updates — together with farmers across Bangladesh.'}
        </motion.p>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link to="/register" className="no-underline inline-flex items-center gap-2 bg-white text-[#067e4b] rounded-[28px] px-8 py-3 font-bold shadow-lg hover:scale-105 transition-transform">
            <span>✨</span> {isBn ? 'এখনই শুরু করুন →' : 'Get Started Now →'}
          </Link>
          <Link to="/scan-crop" className="no-underline">
            <Button variant="secondary">
              {isBn ? 'ফসল পরীক্ষা করুন' : 'Scan Your Crop'}
            </Button>
          </Link>
        </motion.div>

        <motion.hr initial={{ width: "0%" }} whileInView={{ width: "55%" }} viewport={{ once: true }} transition={{ duration: 1.1, ease: "easeInOut" }} className="border-0 h-[1px] bg-white/20 mx-auto mb-6" />

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="text-white/85 mb-6 text-sm tracking-wide">
          {isBn ? <>একসাথে আমরা <strong>কৃষকদের ক্ষমতায়ন</strong> এবং বাংলাদেশের কৃষিকে আরও লাভজনক করে তুলতে পারি</> : <>Together, we can <strong>empower farmers</strong> and make Bangladeshi farming far more profitable</>}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-md rounded-full px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
          <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#067e4b] text-xl">🌾</motion.div>
          <div className="text-left text-[14px] leading-tight">
            <span className="opacity-80">{isBn ? 'আমাদের স্লোগান' : 'Our Motto'}</span>
            <br />
            <strong className="text-white">কৃষকের আলো</strong>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// About.jsx — AgriSmart BD mission & platform story.
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Target, Users, ShieldCheck, Globe2, MessageCircle, Sprout } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import bg from "../assets/bg.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const FEATURES = [
  { icon: <Sprout size={20} />, en: "Crop disease detection by photo (AI)", bn: "ছবিতে ফসলের রোগ শনাক্তকরণ (AI)" },
  { icon: <ShieldCheck size={20} />, en: "Zero-intermediary direct marketplace", bn: "মধ্যস্বত্ত্বভোগী ছাড়া সরাসরি বাজার" },
  { icon: <Globe2 size={20} />, en: "Live weather & market price alerts", bn: "লাইভ আবহাওয়া ও বাজারদর সতর্কতা" },
  { icon: <MessageCircle size={20} />, en: "Direct buyer–farmer chat", bn: "ক্রেতা–কৃষক সরাসরি চ্যাট" },
  { icon: <Target size={20} />, en: "Simplified sales & analytics dashboard", bn: "সহজ বিক্রয় ও বিশ্লেষণ ড্যাশবোর্ড" },
];

const About = () => {
  const { lang } = useLanguage();
  const isBn = lang === "bn";

  return (
    <div className="min-h-screen bg-[#f2faf5]">
      {/* Hero */}
      <div className="relative min-h-[52vh] flex items-end overflow-hidden">
        <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-[#f2faf5]"></div>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}
          className="relative max-w-[900px] mx-auto px-6 pb-16 pt-20 text-center w-full">
          <div className="inline-flex items-center gap-2 text-[13px] font-bold text-white/90 bg-white/15 backdrop-blur rounded-full px-4 py-1.5 mb-5">
            🌾 AgriSmart BD — {isBn ? "কৃষকের আলো" : "The Farmer's Light"}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
            {isBn ? "কৃষকের পাশে, প্রতিটি ধাপে" : "Beside the farmer, at every step"}
          </h1>
          <p className="text-green-50/90 text-sm md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            {isBn
              ? "AgriSmart BD বাংলাদেশের কৃষকদের ক্ষমতায়নে তৈরি — ফসল রক্ষা, সরাসরি বিক্রি আর সঠিক তথ্যে সিদ্ধান্ত নেওয়ার একটি সম্পূর্ণ প্ল্যাটফর্ম।"
              : "AgriSmart BD is built to empower Bangladesh's farmers — a complete platform for protecting crops, selling directly, and deciding with the right information."}
          </p>
        </motion.div>
      </div>

      {/* Mission */}
      <div className="max-w-[1000px] mx-auto px-5 py-16">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-green-950 inline-flex items-center gap-2.5 mb-4">
              <Heart size={24} className="text-[#0b6b3a]" />
              {isBn ? "আমাদের লক্ষ্য" : "Our Mission"}
            </h2>
            <p className="text-green-900/75 leading-relaxed text-[15px] mb-4">
              {isBn
                ? "বাংলাদেশের প্রায় ৬৫% মানুষ কৃষির ওপর নির্ভরশীল, তবুও মধ্যস্বত্ত্বভোগীদের কারণে কৃষকরা ফসলের প্রকৃত দাম পান না এবং রোগ-বালাইতে ফসল হারান। AgriSmart BD সেই দুটি সমস্যা সরাসরি সমাধান করে — রোগের দ্রুত শনাক্তকরণ এবং মধ্যস্বত্ত্বভোগী ছাড়া সরাসরি বাজার।"
                : "Nearly 65% of Bangladesh depends on agriculture, yet middlemen keep farmers from earning the true value of their crops, and disease wipes out harvests. AgriSmart BD tackles both directly — rapid disease detection and a marketplace with zero middlemen."}
            </p>
            <p className="text-green-900/75 leading-relaxed text-[15px]">
              {isBn
                ? "আমাদের বিশ্বাস, প্রতিটি কৃষকের হাতে প্রযুক্তি থাকলে — সঠিক রোগ নির্ণয়, লাইভ দাম ও সরাসরি ক্রেতার সংযোগ — কৃষিই হবে বাংলাদেশের সবচেয়ে লাভজনক পেশা।"
                : "We believe that when every farmer holds technology — accurate diagnosis, live prices, and a direct line to buyers — farming becomes one of Bangladesh's most profitable professions."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "10K+", l: isBn ? "ফসল পরীক্ষা সম্পন্ন" : "Crops scanned", i: <Sprout size={18} /> },
              { v: "5K+", l: isBn ? "কৃষক সংযুক্ত" : "Farmers connected", i: <Users size={18} /> },
              { v: "৳50Cr+", l: isBn ? "ন্যায্য মূল্য নিশ্চিত" : "Fair price secured", i: <ShieldCheck size={18} /> },
              { v: "০ মধ্যস্বত্ত্বভোগী", l: isBn ? "সরাসরি বাণিজ্য" : "Middlemen involved", i: <Target size={18} /> },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp}
                className="bg-white rounded-2xl border border-green-100 shadow-[0_6px_24px_rgba(0,60,30,0.07)] p-5 text-center">
                <div className="w-10 h-10 mx-auto rounded-xl bg-[#0b6b3a]/10 flex items-center justify-center text-[#0b6b3a] mb-2.5">{s.i}</div>
                <div className="font-extrabold text-green-950 text-lg">{s.v}</div>
                <div className="text-[12px] text-green-600 font-semibold">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What we built */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-20">
          <h2 className="text-2xl md:text-3xl font-extrabold text-green-950 mb-2">
            {isBn ? "আমরা যা তৈরি করেছি" : "What We Built"}
          </h2>
          <p className="text-green-700/60 text-[15px] mb-8">
            {isBn ? "কৃষকের প্রতিদিনের সমস্যা সমাধানের জন্য দশটি মূল ফিচার।" : "Ten core features that solve a farmer's daily problems."}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={i} variants={fadeUp}
                className="flex items-center gap-3 bg-white rounded-2xl border border-green-100 p-4 shadow-[0_4px_18px_rgba(0,60,30,0.05)] hover:border-[#49c74f]/50 transition-colors">
                <span className="w-10 h-10 rounded-xl bg-[#0b6b3a]/10 text-[#0b6b3a] flex items-center justify-center shrink-0">{f.icon}</span>
                <span className="text-[14px] font-bold text-green-950">{isBn ? f.bn : f.en}</span>
              </motion.div>
            ))}
            <motion.div variants={fadeUp}
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#49c74f]/60 bg-[#0b6b3a]/5 p-4">
              <Globe2 size={18} className="text-[#0b6b3a]" />
              <span className="text-[14px] font-bold text-[#0b6b3a]">
                {isBn ? "বাংলা ও ইংরেজি — দ্বিভাষিক" : "Bilingual — বাংলা / English"}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="mt-20 bg-[linear-gradient(135deg,#0b6b3a_0%,#064e2a_70%)] rounded-3xl p-10 text-center text-white shadow-xl">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
            {isBn ? "আজই যুক্ত হোন — কৃষকের আলোয়" : "Join today — be part of the farmer's light"}
          </h2>
          <p className="text-green-100 max-w-xl mx-auto mb-7 text-[15px]">
            {isBn
              ? "ফসল পোস্ট করুন, লাইভ দামে বিক্রি করুন, আর প্রতিটি ফসলের সঠিক যত্ন নিন।"
              : "Post your harvest, sell at live prices, and give every crop the care it deserves."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register" className="bg-white text-[#0b6b3a] rounded-xl px-6 py-3 font-extrabold text-sm hover:bg-green-50 transition-colors">
              {isBn ? "নিবন্ধন করুন →" : "Register →"}
            </Link>
            <Link to="/marketplace" className="bg-[#0b6b3a] text-white border border-white/30 rounded-xl px-6 py-3 font-extrabold text-sm hover:bg-[#085b30] transition-colors">
              {isBn ? "বাজার ঘুরে দেখুন" : "Browse Marketplace"}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;

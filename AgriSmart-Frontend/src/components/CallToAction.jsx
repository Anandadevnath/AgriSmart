import React from "react";
import { useLanguage } from '../context/LanguageContext';
import { motion } from "framer-motion";
import { Button } from "./common/Button";
import { Link } from "react-router-dom";
import { ArrowRight, Scan, Wheat } from "lucide-react";

export default function CallToAction() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  return (
    <section className="relative overflow-hidden bg-[#0b3b2a] text-white py-20 md:py-24 px-5 md:px-8">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(124,194,74,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,194,74,0.06) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
      <div className="pointer-events-none absolute -left-24 top-0 bottom-0 w-80 rounded-full bg-[#7cc24a]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-0 bottom-0 w-80 rounded-full bg-[#7cc24a]/10 blur-3xl" />

      <div className="relative max-w-[820px] mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-[13px] font-bold tracking-[0.1em] uppercase text-[#7cc24a] mb-6"
        >
          <Wheat className="w-4 h-4" />
          {isBn ? 'কৃষকের আলো' : 'The farmer’s light'}
        </motion.span>

        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="font-display font-extrabold text-3xl md:text-[44px] tracking-[-0.02em] leading-[1.12] mb-6">
          {isBn ? 'কৃষকের আলোয় যুক্ত হোন' : 'Be the light for farmers'}
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-white/75 text-base md:text-lg leading-[1.85] max-w-[560px] mx-auto mb-10">
          {isBn ? 'ফসল রক্ষা করুন, মধ্যস্বত্ত্বভোগী ছাড়া বিক্রি করুন, আর লাইভ আপডেট পেয়ে লাভ নিশ্চিত করুন — বাংলাদেশের কৃষকদের সঙ্গে।' : 'Protect your crops, sell without middlemen, and secure fair profit with live updates — together with farmers across Bangladesh.'}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/register" className="no-underline">
            <Button variant="accent" size="lg" className="gap-2">
              {isBn ? 'এখনই শুরু করুন' : 'Get Started Now'}
              <ArrowRight className="w-4 h-4" strokeWidth={2.4} />
            </Button>
          </Link>
          <Link to="/scan-crop" className="no-underline">
            <Button variant="outline" size="lg" className="border-white/25 text-white hover:bg-white/5 hover:text-white hover:border-white/50 gap-2">
              <Scan className="w-4 h-4" strokeWidth={2.4} />
              {isBn ? 'ফসল পরীক্ষা করুন' : 'Scan Your Crop'}
            </Button>
          </Link>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-10 text-white/60 text-sm leading-relaxed">
          {isBn ? 'একসাথে আমরা কৃষকদের ক্ষমতায়ন এবং বাংলাদেশের কৃষিকে আরও লাভজনক করে তুলতে পারি।' : 'Together, we can empower farmers and make Bangladeshi farming far more profitable.'}
        </motion.p>
      </div>
    </section>
  );
}
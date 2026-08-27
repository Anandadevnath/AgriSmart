import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lightbulb, ChevronRight, Sprout, Droplets, ShoppingCart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { FARMING_TIPS } from "../data/farmingTips";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const ICONS = { disease: <Sprout size={18} />, soil: <Droplets size={18} />, weather: <Sprout size={18} />, market: <ShoppingCart size={18} />, general: <Lightbulb size={18} /> };

export default function TipsPreview() {
  const { lang } = useLanguage();
  const isBn = lang === "bn";
  const picks = [FARMING_TIPS[0], FARMING_TIPS[3], FARMING_TIPS[8], FARMING_TIPS[9]];

  return (
    <section className="py-20 px-5 bg-[#e8f9ef]">
      <div className="max-w-[1180px] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-green-950">
            {isBn ? "কৃষি টিপস ও নির্দেশনা" : "Farming Tips & Guidelines"}
          </h2>
          <p className="text-green-800/70 mt-3 max-w-2xl mx-auto">
            {isBn ? "বিশেষজ্ঞদের নির্বাচিত পরামর্শ — প্রতিদিন একধাপ এগিয়ে।" : "Curated expert advice — one step ahead, every day."}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {picks.map((tip, i) => (
            <motion.div key={tip.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-green-100 shadow-[0_4px_20px_rgba(0,60,30,0.05)] p-6 flex gap-4 hover:shadow-[0_10px_28px_rgba(0,60,30,0.10)] transition-all duration-300">
              <span className="w-11 h-11 rounded-2xl bg-[#0b6b3a]/10 text-[#0b6b3a] flex items-center justify-center shrink-0">
                {ICONS[tip.category] || <Lightbulb size={18} />}
              </span>
              <div>
                <h3 className="font-extrabold text-green-950 text-[15px] mb-1.5">{isBn ? tip.title.bn : tip.title.en}</h3>
                <p className="text-[13.5px] text-green-900/65 leading-relaxed line-clamp-2">{isBn ? tip.body.bn : tip.body.en}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/tips" className="inline-flex items-center gap-1.5 bg-[#0b6b3a] text-white rounded-full px-7 py-3 font-bold text-sm shadow-lg hover:bg-[#085b30] hover:scale-[1.02] transition-all">
            {isBn ? "সব টিপস দেখুন" : "View all tips"} <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

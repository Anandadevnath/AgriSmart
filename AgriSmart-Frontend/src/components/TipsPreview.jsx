import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lightbulb, ChevronRight, Sprout, Droplets, CloudSun, ShoppingCart, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { FARMING_TIPS } from "../data/farmingTips";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const ICONS = {
  disease: <Sprout className="w-4 h-4" strokeWidth={2.2} />,
  soil: <Droplets className="w-4 h-4" strokeWidth={2.2} />,
  weather: <CloudSun className="w-4 h-4" strokeWidth={2.2} />,
  market: <ShoppingCart className="w-4 h-4" strokeWidth={2.2} />,
  general: <Lightbulb className="w-4 h-4" strokeWidth={2.2} />,
};

export default function TipsPreview() {
  const { lang } = useLanguage();
  const isBn = lang === "bn";
  const picks = [FARMING_TIPS[0], FARMING_TIPS[3], FARMING_TIPS[8], FARMING_TIPS[9]];

  return (
    <section className="py-24 px-5 md:px-8 bg-[#f6f8f5]">
      <div className="max-w-[1180px] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="max-w-[520px]">
            <div className="inline-flex items-center gap-2 text-[13px] font-bold tracking-[0.08em] uppercase text-[#0b3b2a] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#7cc24a]" />
              {isBn ? 'কৃষি টিপস' : 'Farming tips'}
            </div>
            <h2 className="font-display font-extrabold text-[#0b3b2a] text-3xl md:text-[38px] tracking-[-0.02em] leading-[1.15]">
              {isBn ? 'কৃষি টিপস ও নির্দেশনা' : 'Tips & guidelines'}
            </h2>
            <p className="text-[#47564c] mt-3 leading-[1.8]">
              {isBn ? 'বিশেষজ্ঞদের নির্বাচিত পরামর্শ — প্রতিদিন একধাপ এগিয়ে।' : 'Curated expert advice — one step ahead, every day.'}
            </p>
          </div>
          <Link to="/tips" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0b3b2a] hover:text-[#7cc24a] no-underline shrink-0 transition-colors">
            {isBn ? 'সব টিপস দেখুন' : "View all tips"} <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {picks.map((tip, i) => (
            <motion.div key={tip.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="group bg-white border border-[#e4eae3] rounded-[16px] p-6 flex gap-4 hover:border-[#7cc24a]/50 transition-colors duration-300">
              <span className="w-10 h-10 rounded-[10px] bg-[#0b3b2a]/6 text-[#0b3b2a] flex items-center justify-center shrink-0">
                {ICONS[tip.category] || <Lightbulb className="w-4 h-4" strokeWidth={2.2} />}
              </span>
              <div className="flex-1">
                <h3 className="font-display font-bold text-[#0b3b2a] text-[15px] tracking-tight mb-1.5">{isBn ? tip.title.bn : tip.title.en}</h3>
                <p className="text-[13.5px] text-[#47564c] leading-[1.7] line-clamp-2">{isBn ? tip.body.bn : tip.body.en}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#9aa79e] shrink-0 mt-1 group-hover:text-[#7cc24a] transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
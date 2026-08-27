import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Sprout, Droplets, CloudSun, ShoppingCart, BookOpen, ChevronRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { FARMING_TIPS, TIP_CATEGORIES } from "../data/farmingTips";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const CAT_ICONS = {
  disease: <Sprout size={18} />,
  soil: <Droplets size={18} />,
  weather: <CloudSun size={18} />,
  market: <ShoppingCart size={18} />,
  general: <Lightbulb size={18} />,
};

const CAT_COLORS = {
  disease: "bg-red-50 text-red-700 border-red-200",
  soil: "bg-amber-50 text-amber-700 border-amber-200",
  weather: "bg-sky-50 text-sky-700 border-sky-200",
  market: "bg-indigo-50 text-indigo-700 border-indigo-200",
  general: "bg-green-50 text-green-700 border-green-200",
};

const catName = (cat, isBn) => {
  const c = TIP_CATEGORIES.find((x) => x.value === cat);
  return c ? (isBn ? c.bn : c.en) : cat;
};

export default function Tips() {
  const { lang } = useLanguage();
  const isBn = lang === "bn";
  const [activeCat, setActiveCat] = useState("all");

  const filtered = useMemo(
    () => (activeCat === "all" ? FARMING_TIPS : FARMING_TIPS.filter((t) => t.category === activeCat)),
    [activeCat]
  );

  return (
    <div className="min-h-screen bg-[#f2faf5]">
      {/* Header */}
      <div className="relative bg-[linear-gradient(135deg,#0b6b3a_0%,#064e2a_70%)] text-white px-5 pt-14 pb-20 overflow-hidden">
        <div className="absolute -right-8 -top-8 text-[150px] opacity-10 select-none">💡</div>
        <div className="max-w-[1000px] mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-sm inline-flex items-center gap-3">
            <Lightbulb className="text-[#7fe6a0]" size={30} />
            {isBn ? "কৃষি টিপস ও নির্দেশনা" : "Farming Tips & Guidelines"}
          </h1>
          <p className="text-green-100 mt-3 max-w-xl text-[15px]">
            {isBn
              ? "বিশেষজ্ঞদের নির্বাচিত পরামর্শ — রোগ, মাটি, আবহাওয়া ও বাজারে প্রতিদিনের সিদ্ধান্তে সহায়তা।"
              : "Curated expert advice — daily support for your decisions on disease, soil, weather and the market."}
          </p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-5 -mt-10 pb-20 relative z-10">
        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {TIP_CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setActiveCat(c.value)}
              className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${
                activeCat === c.value
                  ? "bg-[#0b6b3a] text-white shadow"
                  : "bg-white text-green-800 border border-green-100 hover:bg-green-50"
              }`}
            >
              {isBn ? c.bn : c.en}
            </button>
          ))}
        </div>

        {/* Tip cards */}
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }} className="space-y-4">
          {filtered.map((tip) => (
            <motion.article
              key={tip.id}
              variants={fadeUp}
              className="bg-white rounded-2xl border border-green-100 shadow-[0_4px_20px_rgba(0,60,30,0.05)] p-6 hover:shadow-[0_10px_28px_rgba(0,60,30,0.10)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <span className={`w-11 h-11 rounded-2xl border inline-flex items-center justify-center shrink-0 ${CAT_COLORS[tip.category] || CAT_COLORS.general}`}>
                  {CAT_ICONS[tip.category] || <BookOpen size={18} />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-extrabold text-green-950 text-[16px] leading-snug">
                      {isBn ? tip.title.bn : tip.title.en}
                    </h3>
                    <span className="text-[11px] font-bold text-green-500 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
                      {catName(tip.category, isBn)}
                    </span>
                  </div>
                  <p className="text-[14px] text-green-900/70 leading-relaxed">{isBn ? tip.body.bn : tip.body.en}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tip.tags.map((t) => (
                      <span key={t} className="text-[11px] text-green-600 bg-green-50/60 rounded-md px-2 py-0.5 border border-green-100">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="mt-10 bg-[#0b6b3a] rounded-3xl p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h3 className="text-xl font-extrabold">{isBn ? "আরও জানতে চান?" : "Want to learn more?"}</h3>
            <p className="text-green-100 text-sm mt-1">
              {isBn ? "ফসলের রোগ পরীক্ষা করুন বা লাইভ দাম দেখুন।" : "Check your crop’s health or see live prices."}
            </p>
          </div>
          <div className="flex gap-3">
            <a href="/scan-crop" className="inline-flex items-center gap-1.5 bg-white text-[#0b6b3a] rounded-xl px-5 py-2.5 font-bold text-sm hover:bg-green-50 transition-colors">
              {isBn ? "ফসল পরীক্ষা করুন" : "Scan Crop"} <ChevronRight size={16} />
            </a>
            <a href="/prices" className="inline-flex items-center gap-1.5 bg-[#0b6b3a] text-white border border-white/40 rounded-xl px-5 py-2.5 font-bold text-sm hover:bg-[#085b30] transition-colors">
              {isBn ? "লাইভ দাম" : "Live Prices"} <ChevronRight size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

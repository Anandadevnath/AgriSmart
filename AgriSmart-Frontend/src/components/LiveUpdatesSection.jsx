import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { CloudSun, TrendingUp, MapPin, ArrowRight, TrendingDown, Minus } from "lucide-react";
import api from "../services/api";
import { useWeatherSnapshot } from "../hooks/useWeatherSnapshot";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function LiveUpdatesSection() {
  const { lang } = useLanguage();
  const isBn = lang === "bn";
  const { user } = useAuth();
  const district = user?.location?.district;

  const [prices, setPrices] = useState([]);
  const [pricesLoading, setPricesLoading] = useState(true);

  const { weather, loading: weatherLoading } = useWeatherSnapshot(district);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { ok, data } = await api.get('/market-price');
        if (ok && data?.data && !cancelled) setPrices(data.data.slice(0, 6));
      } catch (e) {
        /* offline fallback */
      } finally {
        if (!cancelled) setPricesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const trendMeta = (t) => {
    if (t === 'up') return { Icon: TrendingUp, cls: 'text-[#0b3b2a] bg-[#eef6e4]' };
    if (t === 'down') return { Icon: TrendingDown, cls: 'text-[#b23b3b] bg-[#fbeceb]' };
    return { Icon: Minus, cls: 'text-[#6f7d73] bg-[#eef1ee]' };
  };

  return (
    <section className="py-24 px-5 md:px-8 bg-white">
      <div className="max-w-[1180px] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div className="max-w-[520px]">
            <div className="inline-flex items-center gap-2 text-[13px] font-bold tracking-[0.08em] uppercase text-[#0b3b2a] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#7cc24a]" />
              {isBn ? 'লাইভ আপডেট' : 'Live intelligence'}
            </div>
            <h2 className="font-display font-extrabold text-[#0b3b2a] text-3xl md:text-[38px] tracking-[-0.02em] leading-[1.15]">
              {isBn ? 'লাইভ বাজারদর ও আবহাওয়া' : 'Live market prices & weather'}
            </h2>
            <p className="text-[#47564c] mt-3 leading-[1.8]">
              {isBn ? 'প্রতিদিনের হালনাগাদ দাম ও স্থানীয় আবহাওয়া — সঠিক সময়ে সঠিক সিদ্ধান্ত নিন।' : 'Daily updated prices and local weather — make the right call at the right time.'}
            </p>
          </div>
          <Link to="/prices" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0b3b2a] hover:text-[#7cc24a] no-underline shrink-0 transition-colors">
            {isBn ? 'সম্পূর্ণ দাম তালিকা' : 'View full price list'} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-5">
          {/* Weather panel */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="md:col-span-2 bg-[#0b3b2a] text-white rounded-[16px] p-7 md:p-8 relative overflow-hidden">
            <div className="pointer-events-none absolute -right-14 -top-14 w-56 h-56 rounded-full bg-[#7cc24a]/12 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[13px] font-bold tracking-[0.1em] uppercase text-[#7cc24a] mb-5">
                <CloudSun className="w-4 h-4" />
                {isBn ? 'আবহাওয়া' : 'Weather'}
              </div>

              {weatherLoading ? (
                <div className="text-white/60 text-sm">{isBn ? 'লোড হচ্ছে...' : 'Loading…'}</div>
              ) : weather ? (
                <>
                  <div className="flex items-center gap-1.5 text-[13px] font-medium text-white/70 mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {weather.location}
                  </div>
                  <div className="font-display font-extrabold text-6xl tracking-tight tabular mb-5">{weather.temp}</div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-white/80">
                    <span>{isBn ? 'সর্বোচ্চ' : 'Max'} <strong className="tabular">{weather.todayMax}</strong></span>
                    <span>{isBn ? 'সর্বনিম্ন' : 'Min'} <strong className="tabular">{weather.todayMin}</strong></span>
                    <span>{isBn ? 'বৃষ্টি' : 'Rain'} <strong className="tabular">{weather.rainProb}%</strong></span>
                  </div>
                </>
              ) : (
                <div className="text-white/60 text-sm">{isBn ? 'আবহাওয়া পাওয়া যায়নি' : 'Weather unavailable'}</div>
              )}
            </div>
          </motion.div>

          {/* Price list */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="md:col-span-3 border border-[#e4eae3] rounded-[16px] overflow-hidden bg-[#f6f8f5]">
            <div className="flex items-center justify-between px-7 py-5 border-b border-[#e4eae3] bg-white">
              <h3 className="font-display font-bold text-[#0b3b2a] text-lg tracking-tight">
                {isBn ? 'আজকের বাজারদর (প্রতি কেজি)' : "Today's Prices (per kg)"}
              </h3>
              <span className="text-xs font-bold text-[#6f7d73] tracking-wide">BDT</span>
            </div>

            {pricesLoading ? (
              <div className="text-[#47564c] text-sm py-10 text-center">{isBn ? 'দাম লোড হচ্ছে...' : 'Loading prices…'}</div>
            ) : prices.length === 0 ? (
              <div className="text-[#47564c] text-sm py-10 text-center">{isBn ? 'এখনও দাম পাওয়া যায়নি' : 'No prices available yet'}</div>
            ) : (
              <ul className="divide-y divide-[#e4eae3]">
                {prices.map((p) => {
                  const { Icon, cls } = trendMeta(p.trend);
                  return (
                    <li key={p.cropType} className="flex items-center justify-between px-7 py-3.5 hover:bg-white transition-colors">
                      <span className="font-semibold text-[#0b3b2a] text-[15px]">
                        {isBn ? (p.bn || p.cropType) : p.cropType}
                      </span>
                      <span className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-[8px] ${cls}`}>
                          <Icon className="w-3 h-3" strokeWidth={2.6} />
                          {p.changePct > 0 ? '+' : ''}{p.changePct}%
                        </span>
                        <span className="font-display font-extrabold text-[#0b3b2a] tabular">৳{p.pricePerKg}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
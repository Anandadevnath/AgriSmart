import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// A lightweight localized weather snapshot (open-meteo, no key needed).
function useWeatherSnapshot(district) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const q = encodeURIComponent((district || "Dhaka") + ", Bangladesh");
        const geo = await (await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`)).json();
        const lat = geo[0]?.lat ?? 23.8103;
        const lon = geo[0]?.lon ?? 90.4125;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FDhaka`;
        const d = await (await fetch(url)).json();
        if (!cancelled && d.current_weather) {
          setWeather({
            temp: `${Math.round(d.current_weather.temperature)}°C`,
            windspeed: `${Math.round(d.current_weather.windspeed)} km/h`,
            todayMax: `${Math.round(d.daily.temperature_2m_max[0])}°C`,
            todayMin: `${Math.round(d.daily.temperature_2m_min[0])}°C`,
            rainProb: d.daily.precipitation_probability_max?.[0] ?? 0,
            location: geo[0]?.display_name?.split(",")[0] || district || "Dhaka",
          });
        }
      } catch (e) {
        /* fall back to empty state */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [district]);

  return { weather, loading };
}

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

  const trendColor = (t) => (t === 'up' ? 'text-green-600' : t === 'down' ? 'text-red-600' : 'text-gray-500');
  const trendArrow = (t) => (t === 'up' ? '▲' : t === 'down' ? '▼' : '—');

  return (
    <section className="py-20 px-5 bg-white">
      <div className="max-w-[1180px] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-green-950">
            {isBn ? 'লাইভ বাজারদর ও আবহাওয়া' : 'Live Market Prices & Weather'}
          </h2>
          <p className="text-green-800/70 mt-3 max-w-2xl mx-auto">
            {isBn ? 'প্রতিদিনের হালনাগাদ দাম ও স্থানীয় আবহাওয়া — সঠিক সময়ে সঠিক সিদ্ধান্ত নিন।' : 'Daily updated prices and local weather — make the right call at the right time.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Weather card */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="md:col-span-2 bg-gradient-to-br from-[#0b6b3a] to-[#064e2a] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute -right-8 -top-8 text-[120px] opacity-20 select-none">🌤️</div>
            <div className="text-sm font-semibold text-green-100 mb-1">
              {isBn ? 'আবহাওয়া' : 'Weather'}
            </div>
            <div className="text-2xl font-extrabold mb-4">
              {weather?.location || (district || 'Dhaka')}
            </div>
            {weatherLoading ? (
              <div className="text-green-100">{isBn ? 'লোড হচ্ছে...' : 'Loading…'}</div>
            ) : weather ? (
              <div className="space-y-2">
                <div className="text-5xl font-extrabold">{weather.temp}</div>
                <div className="flex gap-4 text-sm text-green-100 mt-3 flex-wrap">
                  <span>📈 {isBn ? 'সর্বোচ্চ' : 'Max'} {weather.todayMax}</span>
                  <span>📉 {isBn ? 'সর্বনিম্ন' : 'Min'} {weather.todayMin}</span>
                  <span>🌧️ {weather.rainProb}%</span>
                </div>
              </div>
            ) : (
              <div className="text-green-100">{isBn ? 'আবহাওয়া পাওয়া যায়নি' : 'Weather unavailable'}</div>
            )}
            <Link to="/prices" className="inline-block mt-6 text-sm font-bold bg-white/15 hover:bg-white/25 backdrop-blur px-4 py-2 rounded-full no-underline text-white transition-colors">
              {isBn ? 'বিস্তারিত দেখুন →' : 'See Details →'}
            </Link>
          </motion.div>

          {/* Price list */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="md:col-span-3 bg-green-50 rounded-3xl p-8 border border-green-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-green-900">
                {isBn ? 'আজকের বাজারদর (প্রতি কেজি)' : "Today's Prices (per kg)"}
              </h3>
              <span className="text-xs text-green-600 bg-white rounded-full px-3 py-1 border border-green-100">
                {isBn ? 'BDT' : 'BDT'}
              </span>
            </div>

            {pricesLoading ? (
              <div className="text-green-700 text-sm py-8 text-center">{isBn ? 'দাম লোড হচ্ছে...' : 'Loading prices…'}</div>
            ) : prices.length === 0 ? (
              <div className="text-green-700 text-sm py-8 text-center">{isBn ? 'এখনও দাম পাওয়া যায়নি' : 'No prices available yet'}</div>
            ) : (
              <ul className="space-y-2.5">
                {prices.map((p) => (
                  <li key={p.cropType} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-green-100">
                    <span className="font-semibold text-green-900">
                      {isBn ? (p.bn || p.cropType) : p.cropType}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${trendColor(p.trend)}`}>{trendArrow(p.trend)} {p.changePct > 0 ? '+' : ''}{p.changePct}%</span>
                      <span className="font-extrabold text-green-800">৳{p.pricePerKg}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <Link to="/prices" className="inline-block mt-5 text-sm font-bold text-green-700 hover:text-green-900 no-underline">
              {isBn ? 'সম্পূর্ণ দাম তালিকা দেখুন →' : 'View full price list →'}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

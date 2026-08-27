import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Search, MapPin, Sun, Cloud, CloudRain, Wind, Thermometer, Eye } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { cropLabel, CROP_OPTIONS } from "../data/bangladesh";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

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
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=Asia%2FDhaka&forecast_days=7`;
        const d = await (await fetch(url)).json();
        if (!cancelled && d.current_weather) {
          setWeather({
            temp: Math.round(d.current_weather.temperature),
            windspeed: Math.round(d.current_weather.windspeed),
            todayMax: Math.round(d.daily.temperature_2m_max[0]),
            todayMin: Math.round(d.daily.temperature_2m_min[0]),
            rainProb: d.daily.precipitation_probability_max?.[0] ?? 0,
            code: d.current_weather.weathercode,
            daily: d.daily,
            location: geo[0]?.display_name?.split(",")[0] || district || "Dhaka",
          });
        }
      } catch (e) {
        /* fallback */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [district]);

  return { weather, loading };
}

const weatherIcon = (code) => {
  if (code == null) return <Sun size={24} />;
  if (code <= 3) return <Sun size={24} />;
  if (code <= 48) return <Cloud size={24} />;
  if (code <= 67) return <CloudRain size={24} />;
  return <CloudRain size={24} />;
};

const weatherLabel = (code, isBn) => {
  if (code == null) return isBn ? "পরিষ্কার" : "Clear";
  if (code <= 3) return isBn ? "পরিষ্কার" : "Clear";
  if (code <= 48) return isBn ? "মেঘলা" : "Cloudy";
  if (code <= 67) return isBn ? "বৃষ্টি" : "Rain";
  return isBn ? "ঝড়" : "Storm";
};

export default function Prices() {
  const { lang } = useLanguage();
  const isBn = lang === "bn";
  const { user } = useAuth();
  const district = user?.location?.district;

  const [prices, setPrices] = useState([]);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("all"); // all | rice | vegetables | fruits | other

  const { weather, loading: weatherLoading } = useWeatherSnapshot(district);

  // Fetch prices
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { ok, data } = await api.get("/market-price");
        if (ok && data?.data && !cancelled) setPrices(data.data);
      } catch (e) {
        /* offline */
      } finally {
        if (!cancelled) setLoadingPrices(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Categories
  const CAT_MAP = {
    rice: ["Rice", "Paddy", "Wheat", "Maize", "Barley"],
    vegetables: ["Potato", "Onion", "Garlic", "Tomato", "Chili", "Brinjal", "Cabbage", "Cauliflower", "Carrot", "Radish", "Spinach", "Pumpkin", "Bottle Gourd", "Bitter Gourd", "Cucumber", "Okra", "Beans"],
    fruits: ["Mango", "Banana", "Jackfruit", "Litchi", "Papaya", "Guava", "Watermelon", "Pineapple", "Coconut", "Orange", "Lemon"],
  };

  const filtered = useMemo(() => {
    let arr = prices;
    if (view !== "all") {
      const allowed = CAT_MAP[view] || [];
      arr = arr.filter((p) => allowed.includes(p.cropType));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter((p) => p.cropType.toLowerCase().includes(q) || (p.bn || "").includes(q));
    }
    return arr;
  }, [prices, view, search]);

  const trendIcon = (t) => {
    if (t === "up") return <TrendingUp size={16} className="text-green-600" />;
    if (t === "down") return <TrendingDown size={16} className="text-red-500" />;
    return <Minus size={16} className="text-gray-400" />;
  };

  const trendBg = (t) => {
    if (t === "up") return "bg-green-50 border-green-200";
    if (t === "down") return "bg-red-50 border-red-200";
    return "bg-gray-50 border-gray-200";
  };

  const tabs = [
    { value: "all", bn: "সব", en: "All" },
    { value: "rice", bn: "শস্য", en: "Grains" },
    { value: "vegetables", bn: "সবজি", en: "Vegetables" },
    { value: "fruits", bn: "ফল", en: "Fruits" },
  ];

  return (
    <div className="min-h-screen bg-[#f2faf5]">
      {/* Header */}
      <div className="relative bg-[linear-gradient(135deg,#0b6b3a_0%,#064e2a_70%)] text-white px-5 pt-28 pb-20 overflow-hidden">
        <div className="absolute -left-10 -top-10 text-[150px] opacity-10 select-none">📈</div>
        <div className="max-w-[1180px] mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-sm inline-flex items-center gap-3">
            <TrendingUp className="text-[#7fe6a0]" size={30} />
            {isBn ? "বাজারদর ও আবহাওয়া" : "Market Prices & Weather"}
          </h1>
          <p className="text-green-100 mt-3 max-w-xl text-[15px]">
            {isBn
              ? "প্রতিদিনের হালনাগাদ ফসলের বাজারদর ও স্থানীয় আবহাওয়ার পূর্বাভাস — কৃষকের সঠিক সিদ্ধান্ত নেওয়ার জন্য।"
              : "Daily updated crop prices and local weather forecasts — helping farmers make the right decisions."}
          </p>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-5 -mt-12 pb-20 space-y-6 relative z-10">
        {/* Weather Card */}
        <motion.div initial="hidden" animate="show" variants={fadeUp}
          className="bg-white rounded-3xl border border-green-100 shadow-[0_8px_30px_rgba(0,60,30,0.08)] p-6 md:p-8 overflow-hidden relative">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-[#0b6b3a]/10 flex items-center justify-center text-[#0b6b3a]">
                {weatherLoading ? <Thermometer size={36} className="animate-pulse text-green-400" /> : weatherIcon(weather?.code)}
              </div>
              <div>
                <div className="text-sm font-bold text-green-600 inline-flex items-center gap-1.5">
                  <MapPin size={14} />
                  {weather?.location || (district || "Dhaka")}
                </div>
                {weatherLoading ? (
                  <div className="mt-2 text-green-400 text-sm">{isBn ? "লোড হচ্ছে…" : "Loading…"}</div>
                ) : weather ? (
                  <div className="mt-1">
                    <span className="text-4xl font-extrabold text-green-950">{weather.temp}°C</span>
                    <span className="ml-3 text-green-700/60 text-sm">{weatherLabel(weather.code, isBn)}</span>
                  </div>
                ) : (
                  <div className="mt-2 text-green-400 text-sm">{isBn ? "আবহাওয়া পাওয়া যায়নি" : "Weather unavailable"}</div>
                )}
              </div>
            </div>
            {weather && (
              <div className="flex flex-wrap gap-3 md:ml-auto">
                {[
                  { icon: <Sun size={16} />, label: isBn ? "সর্বোচ্চ" : "Max", value: `${weather.todayMax}°C` },
                  { icon: <Thermometer size={16} />, label: isBn ? "সর্বনিম্ন" : "Min", value: `${weather.todayMin}°C` },
                  { icon: <CloudRain size={16} />, label: isBn ? "বৃষ্টি" : "Rain", value: `${weather.rainProb}%` },
                  { icon: <Wind size={16} />, label: isBn ? "বাতাস" : "Wind", value: `${weather.windspeed} km/h` },
                ].map((s, i) => (
                  <div key={i} className="w-[calc(50%-6px)] sm:w-auto sm:min-w-[96px] bg-green-50 rounded-2xl px-3 py-3 text-center border border-green-100">
                    <div className="text-green-600 mb-1 inline-flex items-center gap-1">{s.icon} <span className="text-[11px] font-bold">{s.label}</span></div>
                    <div className="font-extrabold text-green-950 text-[15px]">{s.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 7-day mini forecast */}
          {weather?.daily && (
            <div className="mt-6 pt-5 border-t border-green-100 flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-7 sm:overflow-visible">
              {weather.daily.time.slice(0, 7).map((t, i) => {
                const days = isBn
                  ? ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"]
                  : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const d = new Date(t);
                return (
                  <div key={t} className="text-center flex-1 min-w-[68px] sm:min-w-0">
                    <div className="text-[11px] font-bold text-green-600">{days[d.getDay()]}</div>
                    <div className="my-1 text-lg">{weatherIcon(weather.daily.weathercode?.[i] ?? 0)}</div>
                    <div className="text-[12px] font-extrabold text-green-950">{Math.round(weather.daily.temperature_2m_max[i])}°</div>
                    <div className="text-[11px] text-green-500">{Math.round(weather.daily.temperature_2m_min[i])}°</div>
                    <div className="text-[10px] text-green-500">{weather.daily.precipitation_probability_max?.[i] ?? 0}%</div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Price Table */}
        <motion.div initial="hidden" animate="show" variants={fadeUp}
          className="bg-white rounded-3xl border border-green-100 shadow-[0_8px_30px_rgba(0,60,30,0.08)] overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-1.5 overflow-x-auto">
              {tabs.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setView(t.value)}
                  className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-colors ${
                    view === t.value ? "bg-[#0b6b3a] text-white shadow" : "bg-green-50 text-green-800 hover:bg-green-100"
                  }`}
                >
                  {isBn ? t.bn : t.en}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isBn ? "ফসল খুঁজুন…" : "Search crops…"}
                className="w-full rounded-xl border border-green-200 bg-green-50/50 pl-9 pr-3 py-2.5 text-sm text-green-950 placeholder:text-green-400 focus:outline-none focus:ring-2 focus:ring-[#49c74f]/40 transition"
              />
            </div>
          </div>

          {/* Table */}
          <div className="px-6 pb-6">
            {loadingPrices ? (
              <div className="space-y-3 pt-2">
                {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-12 rounded-xl bg-green-50 animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Eye className="mx-auto text-green-300 mb-3" size={36} />
                <p className="text-green-700/60 text-sm">{isBn ? "কোনো ফসল পাওয়া যায়নি" : "No crops found"}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[12px] font-bold text-green-500 uppercase tracking-wide border-b border-green-100">
                      <th className="text-left py-3 pr-3">{isBn ? "ফসল" : "Crop"}</th>
                      <th className="text-right py-3 px-3">{isBn ? "দাম (BDT/kg)" : "Price (BDT/kg)"}</th>
                      <th className="text-right py-3 px-3">{isBn ? "পরিবর্তন" : "Change"}</th>
                      <th className="text-right py-3 pl-3">{isBn ? "প্রবণতা" : "Trend"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-50">
                    {filtered.map((p) => (
                      <tr key={p.cropType} className={`${trendBg(p.trend)} transition-colors`}>
                        <td className="py-3.5 pr-3">
                          <span className="font-bold text-green-950">{isBn ? (p.bn || p.cropType) : p.cropType}</span>
                          <span className="text-green-500 text-[12px] ml-2">{p.unit}</span>
                        </td>
                        <td className="text-right py-3.5 px-3">
                          <span className="font-extrabold text-green-950 text-[17px]">৳{p.pricePerKg}</span>
                        </td>
                        <td className="text-right py-3.5 px-3">
                          <span className={`font-bold ${p.trend === "up" ? "text-green-600" : p.trend === "down" ? "text-red-500" : "text-gray-500"}`}>
                            {p.changePct > 0 ? "+" : ""}{p.changePct}%
                          </span>
                        </td>
                        <td className="text-right py-3.5 pl-3">
                          <span className="inline-flex items-center justify-end gap-1">
                            {trendIcon(p.trend)}
                            <span className={`text-[12px] font-bold ${p.trend === "up" ? "text-green-600" : p.trend === "down" ? "text-red-500" : "text-gray-500"}`}>
                              {p.trend === "up" ? (isBn ? "বাড়ছে" : "Up") : p.trend === "down" ? (isBn ? "কমছে" : "Down") : (isBn ? "স্থিতিশীল" : "Stable")}
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
// Dashboard.jsx — AgriSmart BD Sales & Analytics dashboard.
// Shows the farmer's own listings + a simple live market price trend chart.
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  LayoutDashboard, Plus, Package, Wallet, TrendingUp, Trash2, CheckCircle2,
  Clock, ScanLine, Store, Lightbulb, ArrowUpRight, ArrowDownRight, Minus, MapPin,
  MessageSquareWarning, Send, Phone, Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";
import { sendEmergencySms } from "../services/smartAlertService";
import { generateBanglaSmartAlert } from "../utils/riskEngine";
import { cropLabel, cropBannerColor } from "../data/bangladesh";
import { FARMING_TIPS } from "../data/farmingTips";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const statusMeta = {
  available: { en: "Available", bn: "উপলব্ধ", cls: "bg-green-100 text-green-800 border-green-200" },
  reserved: { en: "Reserved", bn: "আরক্ষিত", cls: "bg-amber-100 text-amber-800 border-amber-200" },
  sold: { en: "Sold", bn: "বিক্রিত", cls: "bg-gray-100 text-gray-600 border-gray-200" },
};

export default function Dashboard() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const isBn = lang === "bn";
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState([]);
  const [showSold, setShowSold] = useState(true);
  const [smsSending, setSmsSending] = useState(false);

  // Load my listings
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const { ok, data } = await api.get("/listing/mine/list", { headers: { Authorization: `Bearer ${token}` } });
        if (!cancelled) setListings(ok ? data?.data || [] : []);
      } catch (e) {
        if (!cancelled) setListings([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?._id]);

  // Load market price trends
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { ok, data } = await api.get("/market-price");
        if (ok && data?.data && !cancelled) setPrices(data.data.slice(0, 8));
      } catch (e) {
        /* offline */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const active = listings.filter((l) => l.status !== "sold");
  const sold = listings.filter((l) => l.status === "sold");
  const totalQty = active.reduce((s, l) => s + (l.quantityKg || 0), 0);
  const revenue = sold.reduce((s, l) => s + (l.quantityKg || 0) * (l.pricePerKg || 0), 0);
  const avgPrice = active.length ? Math.round(active.reduce((s, l) => s + l.pricePerKg, 0) / active.length) : 0;

  const tip = useMemo(() => FARMING_TIPS[new Date().getDate() % FARMING_TIPS.length], []);

  const stats = [
    { icon: <Store size={20} />, label: isBn ? "সক্রিয় তালিকা" : "Active Listings", value: active.length, tone: "bg-[#0b6b3a]" },
    { icon: <Package size={20} />, label: isBn ? "মোট পরিমাণ" : "Total Quantity", value: `${totalQty} kg`, tone: "bg-[#0a8f58]" },
    { icon: <Wallet size={20} />, label: isBn ? "আয় (বিক্রিত)" : "Revenue (Sold)", value: `৳${revenue.toLocaleString()}`, tone: "bg-[#0e7d46]" },
    { icon: <TrendingUp size={20} />, label: isBn ? "গড় দাম" : "Avg Price", value: `৳${avgPrice}/kg`, tone: "bg-[#128a4f]" },
  ];

  const manage = async (listing, action) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (action === "delete") {
        const { ok } = await api.del(`/listing/${listing._id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (ok) {
          toast.success(isBn ? "তালিকা মুছে ফেলা হয়েছে" : "Listing deleted");
          setListings((p) => p.filter((l) => l._id !== listing._id));
        }
      } else {
        const { ok } = await api.patch(`/listing/${listing._id}`, { status: action }, { headers: { Authorization: `Bearer ${token}` } });
        if (ok) {
          toast.success(
            action === "sold"
              ? (isBn ? "বিক্রিত হিসেবে চিহ্নিত হয়েছে 🎉" : "Marked as sold 🎉")
              : (isBn ? "আরক্ষিত হয়েছে" : "Marked as reserved")
          );
          setListings((p) => p.map((l) => (l._id === listing._id ? { ...l, status: action } : l)));
        }
      }
    } catch (e) {
      toast.error(isBn ? "আপডেট ব্যর্থ হয়েছে" : "Update failed");
    }
  };

  const maxPrice = Math.max(...prices.map((p) => p.pricePerKg), 1);

  // Compose a sample critical Bangla alert and send it to the farmer's own phone.
  const handleTestSms = async () => {
    const phone = user?.phone;
    if (!phone) {
      toast.error(isBn ? "প্রোফাইলে ফোন নম্বর নেই" : "No phone number on profile");
      return;
    }
    setSmsSending(true);
    try {
      const message = generateBanglaSmartAlert({
        cropType: "Rice",
        cropBn: "ধান",
        storageType: "Warehouse",
        storageBn: "গুদাম",
        riskLevel: "Critical",
        riskBn: "সংকটপূর্ণ",
        etcl: 12,
        humidity: 90,
        rainProb: 80,
        temperature: 34,
      });
      await sendEmergencySms({ to: phone, message });
    } finally {
      setSmsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2faf5]">
      {/* Header */}
      <div className="relative bg-[linear-gradient(135deg,#0b6b3a_0%,#064e2a_70%)] text-white px-5 pt-28 pb-16 overflow-hidden">
        <div className="absolute -right-6 -top-6 text-[140px] opacity-10 select-none">📊</div>
        <div className="max-w-[1180px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <div className="text-[13px] text-green-200 font-semibold mb-1">
              {isBn ? "স্বাগতম" : "Welcome back"},
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm">
              {user?.name && user.name !== "name" ? user.name : (isBn ? "কৃষক" : "Farmer")} 👋
            </h1>
            <p className="text-green-100 mt-2 text-sm">
              {isBn ? "আপনার বিক্রয় ও বিশ্লেষণ এক নজরে" : "Your sales & analytics at a glance"}
            </p>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <button
              onClick={() => navigate("/marketplace?tab=mine")}
              className="inline-flex items-center gap-2 bg-white text-[#0b6b3a] rounded-xl px-5 py-2.5 font-bold text-sm shadow hover:scale-[1.02] transition-transform"
            >
              <Plus size={16} /> {isBn ? "নতুন তালিকা" : "Post Listing"}
            </button>
            <button
              onClick={() => navigate("/scan-crop")}
              className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/50 rounded-xl px-5 py-2.5 font-bold text-sm backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <ScanLine size={16} /> {isBn ? "ফসল স্ক্যান" : "Scan Crop"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-5 -mt-10 pb-20 space-y-6 relative z-10">
        {/* Stats */}
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp}
              className="bg-white rounded-2xl border border-green-100 shadow-[0_6px_24px_rgba(0,60,30,0.07)] p-5 flex items-center gap-4">
              <span className={`w-11 h-11 rounded-2xl inline-flex items-center justify-center text-white shrink-0 ${s.tone}`}>
                {s.icon}
              </span>
              <div className="min-w-0">
                <div className="text-[12px] font-bold text-green-500 truncate">{s.label}</div>
                <div className="text-xl font-extrabold text-green-950 truncate">{s.value}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Listings column */}
          <motion.div variants={fadeUp} initial="hidden" animate="show"
            className="lg:col-span-3 bg-white rounded-3xl border border-green-100 shadow-[0_6px_24px_rgba(0,60,30,0.07)] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-green-950 inline-flex items-center gap-2">
                <Package size={18} className="text-[#0b6b3a]" />
                {isBn ? "আমার তালিকা" : "My Listings"}
              </h2>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setShowSold(false)}
                  className={`text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors ${!showSold ? "bg-[#0b6b3a] text-white" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
                >
                  {isBn ? "সক্রিয়" : "Active"} ({active.length})
                </button>
                <button
                  onClick={() => setShowSold(true)}
                  className={`text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors ${showSold ? "bg-[#0b6b3a] text-white" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
                >
                  {isBn ? "সব" : "All"} ({listings.length})
                </button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-2xl bg-green-50 animate-pulse" />)}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-14">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-green-50 flex items-center justify-center mb-3">
                  <Store className="text-green-300" size={28} />
                </div>
                <p className="font-bold text-green-950 mb-1">{isBn ? "এখনও কোনো তালিকা নেই" : "No listings yet"}</p>
                <p className="text-green-700/60 text-sm mb-4">
                  {isBn ? "আপনার ফসল পোস্ট করে বিক্রি শুরু করুন।" : "Post your harvest to start selling."}
                </p>
                <Link to="/marketplace?tab=mine" className="inline-flex items-center gap-2 bg-[#0b6b3a] text-white rounded-xl px-5 py-2.5 font-bold text-sm hover:bg-[#085b30] transition-colors">
                  <Plus size={16} /> {isBn ? "তালিকা তৈরি করুন" : "Create a listing"}
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {(showSold ? listings : active).map((l) => {
                  const st = statusMeta[l.status] || statusMeta.available;
                  return (
                    <li key={l._id}
                      className="flex items-center gap-4 bg-green-50/40 border border-green-100 rounded-2xl p-3.5 hover:bg-green-50 transition-colors">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${cropBannerColor(l.cropType)}, #064e2a)` }}>
                        {l.photo?.startsWith("data:image") ? (
                          <img src={l.photo} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="text-white/80" size={20} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-green-950 text-[14px]">{cropLabel(l.cropType, isBn ? "bn" : "en")}</span>
                          <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${st.cls}`}>
                            {isBn ? st.bn : st.en}
                          </span>
                        </div>
                        <div className="text-[12.5px] text-green-700/70 flex items-center gap-3 mt-0.5 flex-wrap">
                          <span>{l.quantityKg} kg</span>
                          <span className="inline-flex items-center gap-1"><MapPin size={12} /> {l.location?.division || "—"}{l.location?.district ? ` · ${l.location.district}` : ""}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-extrabold text-green-950">৳{l.pricePerKg}<span className="text-[11px] font-semibold text-green-500">/kg</span></div>
                        <div className="text-[11px] text-green-500 font-semibold">৳{(l.quantityKg * l.pricePerKg).toLocaleString()}</div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        {l.status === "available" && (
                          <button onClick={() => manage(l, "reserved")} title={isBn ? "আরক্ষিত" : "Reserve"}
                            className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 flex items-center justify-center transition-colors">
                            <Clock size={15} />
                          </button>
                        )}
                        {(l.status === "available" || l.status === "reserved") && (
                          <button onClick={() => manage(l, "sold")} title={isBn ? "বিক্রিত" : "Sold"}
                            className="w-8 h-8 rounded-lg bg-green-100 border border-green-200 text-green-800 hover:bg-green-200 flex items-center justify-center transition-colors">
                            <CheckCircle2 size={15} />
                          </button>
                        )}
                        <button onClick={() => manage(l, "delete")} title={isBn ? "মুছুন" : "Delete"}
                          className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>

          {/* Right column: price trends + tip */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price trends */}
            <motion.div variants={fadeUp} initial="hidden" animate="show"
              className="bg-white rounded-3xl border border-green-100 shadow-[0_6px_24px_rgba(0,60,30,0.07)] p-6">
              <h2 className="text-lg font-extrabold text-green-950 inline-flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-[#0b6b3a]" />
                {isBn ? "বাজারদরের প্রবণতা" : "Market Price Trends"}
              </h2>
              {prices.length === 0 ? (
                <div className="text-sm text-green-700/50 py-8 text-center">
                  {isBn ? "দাম লোড হচ্ছে…" : "Loading prices…"}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {prices.map((p) => {
                    const w = Math.max(8, Math.round((p.pricePerKg / maxPrice) * 100));
                    return (
                      <div key={p.cropType} className="flex items-center gap-3">
                        <span className="w-20 text-[12px] font-bold text-green-800 truncate text-right shrink-0">
                          {isBn ? p.bn : p.cropType}
                        </span>
                        <div className="flex-1 h-7 rounded-lg bg-green-50 overflow-hidden">
                          <div className="h-full rounded-lg bg-gradient-to-r from-[#0b6b3a] to-[#49c74f] transition-all duration-700"
                            style={{ width: `${w}%` }} />
                        </div>
                        <span className="w-12 shrink-0 text-right text-[12px] font-extrabold text-green-950 tabular">
                          ৳{p.pricePerKg}
                        </span>
                        <span className={`w-7 shrink-0 inline-flex justify-center ${p.trend === "up" ? "text-green-600" : p.trend === "down" ? "text-red-500" : "text-gray-400"}`}>
                          {p.trend === "up" ? <ArrowUpRight size={16} /> : p.trend === "down" ? <ArrowDownRight size={16} /> : <Minus size={16} />}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              <Link to="/prices" className="inline-block mt-4 text-[13px] font-bold text-[#0b6b3a] hover:underline">
                {isBn ? "সম্পূর্ণ দাম দেখুন →" : "View full prices →"}
              </Link>
            </motion.div>

            {/* Emergency SMS */}
            <motion.div variants={fadeUp} initial="hidden" animate="show"
              className="bg-white rounded-3xl border border-green-100 shadow-[0_6px_24px_rgba(0,60,30,0.07)] p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-extrabold text-green-950 inline-flex items-center gap-2">
                  <MessageSquareWarning size={18} className="text-[#0b6b3a]" />
                  {isBn ? "জরুরি এসএমএস সতর্কতা" : "Emergency SMS Alert"}
                </h2>
                <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {isBn ? "পরীক্ষা" : "Test"}
                </span>
              </div>
              <p className="text-[12.5px] text-green-700/70 mb-3">
                {isBn ? "সংকটপূর্ণ পরিস্থিতিতে ফসলের জরুরি সতর্কতা সরাসরি আপনার ফোনে এসএমএসে পৌঁছে যায়।" : "Emergency crop alerts go straight to your phone as SMS in a critical situation."}
              </p>
              <div className="flex items-center gap-2 text-[13px] text-green-800 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 mb-3">
                <Phone size={14} className="text-[#0b6b3a]" />
                <span className="font-bold">{user?.phone || (isBn ? "নম্বর নেই" : "No phone")}</span>
              </div>
              <button
                onClick={handleTestSms}
                disabled={smsSending}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0b6b3a] text-white rounded-xl px-4 py-2.5 font-bold text-sm hover:bg-[#085b30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {smsSending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                {isBn ? "পরীক্ষামূলক এসএমএস পাঠান" : "Send test SMS"}
              </button>
              <p className="mt-3 text-[11px] text-green-500 leading-relaxed">
                {isBn ? "এসএমএস গেটওয়ে কনফিগার না থাকলে এটি ডেমো হিসাবে দেখানো হবে, আসল এসএমএস নয়।" : "Without a gateway configured this is a demo alert, not a real SMS."}
              </p>
            </motion.div>

            {/* Tip of the day */}
            <motion.div variants={fadeUp} initial="hidden" animate="show"
              className="bg-[#0b6b3a] rounded-3xl p-6 text-white relative overflow-hidden">
              <div className="absolute -right-5 -bottom-5 text-[100px] opacity-10 select-none">💡</div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <Lightbulb size={18} />
                </span>
                <h3 className="font-extrabold">{isBn ? "আজকের টিপস" : "Tip of the Day"}</h3>
              </div>
              <p className="text-green-50 text-[13.5px] leading-relaxed mb-2">
                {isBn ? tip.title.bn : tip.title.en}
              </p>
              <p className="text-green-100/80 text-[12.5px] leading-relaxed">
                {isBn ? tip.body.bn : tip.body.en}
              </p>
              <Link to="/tips" className="inline-block mt-4 text-[12px] font-bold bg-white/15 hover:bg-white/25 rounded-full px-4 py-1.5 transition-colors">
                {isBn ? "আরও টিপস →" : "More tips →"}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

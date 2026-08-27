import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Search, Store, Plus, X, MapPin, User, Wheat, Filter,
  ArrowUpDown, Send, Package, Tag, Trash2, CheckCircle2, Clock, Camera,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { CROP_OPTIONS, DIVISIONS, DISTRICTS, divLabel, cropLabel, cropBannerColor } from "../data/bangladesh";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const emptyState = (isBn) => ({
  noListings: isBn ? "এখনও কোনো তালিকা নেই" : "No listings yet",
  beFirst: isBn ? "আপনার ফসল পোস্ট করে প্রথম হোন" : "Be the first to post your harvest",
  postOne: isBn ? "তালিকা তৈরি করুন" : "Post a Listing",
});

function ListingCard({ listing, onChat, onManage, isOwner }) {
  const { lang } = useLanguage();
  const isBn = lang === "bn";
  const statusMeta = {
    available: { bn: "উপলব্ধ", en: "Available", color: "bg-green-100 text-green-800 border-green-200" },
    reserved: { bn: "আরক্ষিত", en: "Reserved", color: "bg-amber-100 text-amber-800 border-amber-200" },
    sold: { bn: "বিক্রিত", en: "Sold", color: "bg-gray-100 text-gray-600 border-gray-200" },
  };
  const st = statusMeta[listing.status] || statusMeta.available;
  const hasPhoto = listing.photo && listing.photo.startsWith("data:image");

  return (
    <motion.article
      variants={fadeUp}
      className="group bg-white rounded-2xl border border-green-100 shadow-[0_4px_20px_rgba(0,60,30,0.06)] hover:shadow-[0_12px_32px_rgba(0,60,30,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Crop visual */}
      <div className="relative h-44 w-full overflow-hidden">
        {hasPhoto ? (
          <img src={listing.photo} alt={listing.cropType} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${cropBannerColor(listing.cropType)}, #064e2a)` }}
          >
            <Wheat className="text-white/90" size={64} strokeWidth={1.2} />
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${st.color}`}>{isBn ? st.bn : st.en}</span>
        </div>
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur rounded-lg px-2.5 py-1 text-sm font-extrabold text-green-900 shadow-sm">
          ৳{listing.pricePerKg}<span className="text-[11px] font-semibold text-green-600">/kg</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-green-950 leading-snug">
            {isBn ? (listing.title ? `${listing.title} (${cropLabel(listing.cropType, 'bn')})` : cropLabel(listing.cropType, 'bn')) : (listing.title || listing.cropType)}
          </h3>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-green-700/80 mb-3">
          <span className="inline-flex items-center gap-1"><Package size={14} /> {listing.quantityKg} kg</span>
          <span className="inline-flex items-center gap-1"><MapPin size={14} /> {isBn ? divLabel(listing.location?.division, 'bn') : listing.location?.division}{listing.location?.district ? ` · ${listing.location.district}` : ''}</span>
        </div>
        <p className="text-sm text-green-900/60 leading-relaxed mb-4 line-clamp-2 flex-1">
          {listing.description || (isBn ? 'এই ফসলটি সরাসরি কিনতে চ্যাট করুন।' : 'Chat with the farmer to buy directly.')}
        </p>
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-green-50">
          <span className="inline-flex items-center gap-1.5 text-[13px] text-green-800 font-medium truncate">
            <span className="w-6 h-6 rounded-full bg-green-100 inline-flex items-center justify-center text-green-700 shrink-0">
              {listing.farmerId?.avatar ? (
                <img src={listing.farmerId.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />
              ) : (
                <User size={14} />
              )}
            </span>
            {listing.farmerId?.name || (isBn ? 'কৃষক' : 'Farmer')}
          </span>
          {isOwner ? (
            <div className="flex gap-1.5">
              {listing.status === 'available' && (
                <button
                  onClick={() => onManage(listing, 'reserved')}
                  className="inline-flex items-center gap-1 text-[12px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-2.5 py-1.5 transition-colors"
                >
                  <Clock size={13} /> {isBn ? 'আরক্ষিত' : 'Reserve'}
                </button>
              )}
              {(listing.status === 'available' || listing.status === 'reserved') && (
                <button
                  onClick={() => onManage(listing, 'sold')}
                  className="inline-flex items-center gap-1 text-[12px] font-bold text-green-800 bg-green-100 hover:bg-green-200 border border-green-200 rounded-lg px-2.5 py-1.5 transition-colors"
                >
                  <CheckCircle2 size={13} /> {isBn ? 'বিক্রিত' : 'Sold'}
                </button>
              )}
              <button
                onClick={() => onManage(listing, 'delete')}
                className="inline-flex items-center gap-1 text-[12px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg px-2.5 py-1.5 transition-colors"
              >
                <Trash2 size={13} /> {isBn ? 'মুছুন' : 'Delete'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => onChat(listing)}
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-white bg-[#0b6b3a] hover:bg-[#085b30] rounded-full px-4 py-2 transition-colors"
            >
              <Send size={14} /> {isBn ? 'চ্যাট করুন' : 'Chat'}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function PostListingModal({ open, onClose, onPosted }) {
  const { lang } = useLanguage();
  const isBn = lang === "bn";
  const { user } = useAuth();
  const [form, setForm] = useState({
    cropType: '', title: '', quantityKg: '', pricePerKg: '',
    division: user?.location?.division || '', district: user?.location?.district || '',
    description: '',
  });
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) {
      toast.error(isBn ? 'ছবিটি ২.৫ এমবির বেশি বড়' : 'Image must be under 2.5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    if (!form.cropType || !form.quantityKg || !form.pricePerKg || !form.division) {
      toast.error(isBn ? 'ফসল, পরিমাণ, দাম ও বিভাগ প্রয়োজন' : 'Crop, quantity, price and division are required');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const { ok, data } = await api.post('/listing', {
        cropType: form.cropType,
        title: form.title || undefined,
        quantityKg: Number(form.quantityKg),
        pricePerKg: Number(form.pricePerKg),
        location: { division: form.division, district: form.district || undefined },
        description: form.description || undefined,
        photo: photo || undefined,
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (ok) {
        toast.success(isBn ? 'তালিকা প্রকাশিত হয়েছে' : 'Listing published');
        setForm({ cropType: '', title: '', quantityKg: '', pricePerKg: '', division: form.division, district: form.district, description: '' });
        setPhoto(null);
        onPosted(data?.data);
        onClose();
      } else {
        toast.error(data?.message || (isBn ? 'তালিকা প্রকাশে ব্যর্থ' : 'Failed to publish'));
      }
    } catch (e) {
      toast.error(isBn ? 'নেটওয়ার্ক সমস্যা' : 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full rounded-xl border border-green-200 bg-white px-3.5 py-2.5 text-sm text-green-950 placeholder:text-green-400 focus:outline-none focus:ring-2 focus:ring-[#49c74f]/50 focus:border-[#49c74f] transition";
  const labelCls = "block text-[13px] font-bold text-green-800 mb-1.5";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-green-950/60 backdrop-blur-sm p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-green-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-extrabold text-green-950 inline-flex items-center gap-2">
                <Plus size={18} className="text-[#0b6b3a]" />
                {isBn ? 'নতুন তালিকা' : 'Post a Listing'}
              </h2>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-green-50 text-green-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>{isBn ? 'ফসলের ধরন *' : 'Crop Type *'}</label>
                  <select value={form.cropType} onChange={set('cropType')} className={inputCls}>
                    <option value="">{isBn ? 'ফসল নির্বাচন করুন' : 'Select crop'}</option>
                    {CROP_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>{isBn ? `${c.bn} (${c.value})` : c.value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{isBn ? 'শিরোনাম (ঐচ্ছিক)' : 'Title (optional)'}</label>
                  <input value={form.title} onChange={set('title')} placeholder={isBn ? 'যেমন: ফ্রেশ ধান' : 'e.g. Fresh paddy'} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{isBn ? 'পরিমাণ (কেজি) *' : 'Quantity (kg) *'}</label>
                  <input type="number" min="1" value={form.quantityKg} onChange={set('quantityKg')} placeholder="500" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{isBn ? 'দাম (প্রতি কেজি, ৳) *' : 'Price (per kg, ৳) *'}</label>
                  <input type="number" min="1" value={form.pricePerKg} onChange={set('pricePerKg')} placeholder="45" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{isBn ? 'বিভাগ *' : 'Division *'}</label>
                  <select value={form.division} onChange={set('division')} className={inputCls}>
                    <option value="">{isBn ? 'বিভাগ নির্বাচন করুন' : 'Select division'}</option>
                    {DIVISIONS.map((d) => <option key={d} value={d}>{isBn ? divLabel(d, 'bn') : d}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{isBn ? 'জেলা' : 'District'}</label>
                  <select value={form.district} onChange={set('district')} className={inputCls}>
                    <option value="">{isBn ? 'জেলা নির্বাচন করুন' : 'Select district'}</option>
                    {(DISTRICTS[form.division] || []).map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>{isBn ? 'ফসলের ছবি' : 'Crop Photo'}</label>
                <label className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-colors ${photo ? 'border-[#49c74f] bg-green-50' : 'border-green-200 bg-green-50/50 hover:border-[#49c74f]'}`}>
                  <input type="file" accept="image/*" className="hidden" onChange={onFile} />
                  {photo ? (
                    <img src={photo} alt="crop" className="h-20 rounded-xl object-cover" />
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-700">
                      <Camera size={18} /> {isBn ? 'ছবি আপলোড করুন' : 'Upload a photo'}
                    </span>
                  )}
                </label>
              </div>

              <div>
                <label className={labelCls}>{isBn ? 'বিবরণ' : 'Description'}</label>
                <textarea rows={3} value={form.description} onChange={set('description')}
                  placeholder={isBn ? 'ফসলের মান, পরিচর্যার ধরন ইত্যাদি লিখুন…' : 'Quality, variety, care details…'}
                  className={`${inputCls} resize-none`} />
              </div>

              <div className="flex gap-3 justify-end pt-1">
                <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-green-200 text-green-800 font-bold text-sm hover:bg-green-50 transition-colors">
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button onClick={submit} disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0b6b3a] hover:bg-[#085b30] text-white font-bold text-sm shadow-md disabled:opacity-60 transition-colors inline-flex items-center gap-2">
                  <Store size={16} />
                  {submitting ? (isBn ? 'প্রকাশ হচ্ছে…' : 'Publishing…') : (isBn ? 'প্রকাশ করুন' : 'Publish')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Marketplace() {
  const { lang } = useLanguage();
  const isBn = lang === "bn";
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tab, setTab] = useState(searchParams.get('tab') === 'mine' ? 'mine' : 'browse');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postOpen, setPostOpen] = useState(false);
  const [filters, setFilters] = useState({ cropType: '', division: '', district: '', q: '' });
  const [sort, setSort] = useState('newest');
  const [modalId, setModalId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === 'mine' && !user?._id) { setListings([]); setLoading(false); return; }
      if (tab === 'mine') {
        const token = localStorage.getItem('accessToken');
        const { ok, data } = await api.get('/listing/mine/list', { headers: { Authorization: `Bearer ${token}` } });
        setListings(ok ? data?.data || [] : []);
      } else {
        const params = {};
        if (filters.cropType) params.cropType = filters.cropType;
        if (filters.division) params.division = filters.division;
        if (filters.district) params.district = filters.district;
        if (filters.q) params.q = filters.q;
        const { ok, data } = await api.get('/listing', { params });
        setListings(ok ? data?.data || [] : []);
      }
    } catch (e) {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [tab, filters, user?._id]);

  useEffect(() => { load(); }, [load]);

  const sorted = useMemo(() => {
    const arr = [...listings];
    if (sort === 'priceAsc') arr.sort((a, b) => a.pricePerKg - b.pricePerKg);
    else if (sort === 'priceDesc') arr.sort((a, b) => b.pricePerKg - a.pricePerKg);
    else if (sort === 'qtyDesc') arr.sort((a, b) => b.quantityKg - a.quantityKg);
    return arr;
  }, [listings, sort]);

  const onChat = (listing) => {
    if (!user?._id) {
      toast(isBn ? 'চ্যাট করতে লগইন করুন' : 'Please login to chat');
      navigate('/login');
      return;
    }
    navigate(`/chat?recipient=${listing.farmerId?._id}&listing=${listing._id}&crop=${encodeURIComponent(listing.cropType || '')}`);
  };

  const onManage = async (listing, action) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (action === 'delete') {
        const { ok } = await api.del(`/listing/${listing._id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (ok) { toast.success(isBn ? 'তালিকা মুছে ফেলা হয়েছে' : 'Listing deleted'); load(); }
      } else {
        const { ok } = await api.patch(`/listing/${listing._id}`, { status: action }, { headers: { Authorization: `Bearer ${token}` } });
        if (ok) {
          toast.success(action === 'sold' ? (isBn ? 'বিক্রিত হিসেবে চিহ্নিত হয়েছে' : 'Marked as sold') : (isBn ? 'আরক্ষিত হয়েছে' : 'Marked as reserved'));
          load();
        }
      }
    } catch (e) { /* ignore */ }
  };

  const filterInputCls = "rounded-xl border border-green-200 bg-white px-3 py-2 text-sm text-green-950 focus:outline-none focus:ring-2 focus:ring-[#49c74f]/40 transition w-full";

  return (
    <div className="min-h-screen bg-[#f2faf5]">
      {/* Header */}
      <div className="relative bg-[linear-gradient(135deg,#0b6b3a_0%,#064e2a_70%)] text-white px-5 pt-28 pb-16 overflow-hidden">
        <div className="absolute -right-10 -top-10 text-[160px] opacity-10 select-none">🌾</div>
        <div className="max-w-[1180px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-sm inline-flex items-center gap-3">
              <Store className="text-[#7fe6a0]" size={32} />
              {isBn ? 'মধ্যস্বত্ত্বভোগী ছাড়া বাজার' : 'Direct Marketplace'}
            </h1>
            <p className="text-green-100 mt-3 max-w-xl text-[15px]">
              {isBn ? 'কৃষক থেকে ক্রেতা — সরাসরি, মধ্যস্বত্ত্বভোগী ছাড়া। প্রতিটি ফসল ন্যায্য দামে বিক্রি করুন।' : 'Farmers to buyers — direct, with no middlemen. Every crop sold at a fair price.'}
            </p>
          </div>
          <button
            onClick={() => (user?._id ? setPostOpen(true) : navigate('/login'))}
            className="inline-flex items-center gap-2 bg-white text-[#0b6b3a] rounded-2xl px-6 py-3 font-extrabold shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-transform"
          >
            <Plus size={18} /> {isBn ? 'ফসল পোস্ট করুন' : 'Post Your Crop'}
          </button>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-5 -mt-8 pb-20 relative z-10">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,60,30,0.10)] p-1.5 inline-flex gap-1 mb-6">
          <button onClick={() => { setTab('browse'); setListings([]); }}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${tab === 'browse' ? 'bg-[#0b6b3a] text-white shadow' : 'text-green-700 hover:bg-green-50'}`}>
            {isBn ? 'ব্রাউজ করুন' : 'Browse'}
          </button>
          {user?._id && (
            <button onClick={() => { setTab('mine'); setListings([]); }}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${tab === 'mine' ? 'bg-[#0b6b3a] text-white shadow' : 'text-green-700 hover:bg-green-50'}`}>
              {isBn ? 'আমার তালিকা' : 'My Listings'}
            </button>
          )}
        </div>

        {/* Filters */}
        {tab === 'browse' && (
          <div className="bg-white rounded-2xl border border-green-100 shadow-[0_4px_20px_rgba(0,60,30,0.05)] p-4 mb-6 grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" size={16} />
              <input
                value={filters.q}
                onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                placeholder={isBn ? 'ফসল খুঁজুন…' : 'Search crops…'}
                className={`${filterInputCls} pl-9`}
              />
            </div>
            <select value={filters.cropType} onChange={(e) => setFilters((f) => ({ ...f, cropType: e.target.value, district: '' }))} className={filterInputCls}>
              <option value="">{isBn ? 'সব ফসল' : 'All crops'}</option>
              {CROP_OPTIONS.map((c) => <option key={c.value} value={c.value}>{isBn ? c.bn : c.value}</option>)}
            </select>
            <select value={filters.division} onChange={(e) => setFilters((f) => ({ ...f, division: e.target.value, district: '' }))} className={filterInputCls}>
              <option value="">{isBn ? 'সব বিভাগ' : 'All divisions'}</option>
              {DIVISIONS.map((d) => <option key={d} value={d}>{isBn ? divLabel(d, 'bn') : d}</option>)}
            </select>
            <select value={filters.district} onChange={(e) => setFilters((f) => ({ ...f, district: e.target.value }))} disabled={!filters.division} className={`${filterInputCls} disabled:opacity-50`}>
              <option value="">{isBn ? 'সব জেলা' : 'All districts'}</option>
              {(DISTRICTS[filters.division] || []).map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={filterInputCls}>
              <option value="newest">{isBn ? 'নতুন আগে' : 'Newest first'}</option>
              <option value="priceAsc">{isBn ? 'দাম কম → বেশি' : 'Price low → high'}</option>
              <option value="priceDesc">{isBn ? 'দাম বেশি → কম' : 'Price high → low'}</option>
              <option value="qtyDesc">{isBn ? 'পরিমাণ বেশি' : 'Largest quantity'}</option>
            </select>
          </div>
        )}

        {/* Listing grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl bg-white border border-green-100 p-5 animate-pulse h-72">
                <div className="h-36 rounded-xl bg-green-100/70 mb-4" />
                <div className="h-4 rounded bg-green-100 w-2/3 mb-2" />
                <div className="h-3 rounded bg-green-100 w-1/2 mb-4" />
                <div className="h-8 rounded-full bg-green-100 w-24" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-green-200">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-green-50 flex items-center justify-center mb-4">
              <Filter className="text-green-400" size={28} />
            </div>
            <h3 className="text-lg font-extrabold text-green-950 mb-1">{emptyState(isBn).noListings}</h3>
            <p className="text-green-700/60 text-sm mb-5">{emptyState(isBn).beFirst}</p>
            <button onClick={() => (user?._id ? setPostOpen(true) : navigate('/login'))}
              className="inline-flex items-center gap-2 bg-[#0b6b3a] text-white rounded-xl px-5 py-2.5 font-bold text-sm hover:bg-[#085b30] transition-colors">
              <Plus size={16} /> {emptyState(isBn).postOne}
            </button>
          </div>
        ) : (
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((l) => (
              <ListingCard key={l._id} listing={l} onChat={onChat} onManage={onManage} isOwner={tab === 'mine'} />
            ))}
          </motion.div>
        )}
      </div>

      <PostListingModal open={postOpen} onClose={() => setPostOpen(false)} onPosted={() => { if (tab === 'mine') load(); }} />
    </div>
  );
}

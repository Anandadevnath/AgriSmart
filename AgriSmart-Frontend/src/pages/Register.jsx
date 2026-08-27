import React, { useState, useMemo } from "react";
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../components/common/Button';
import { Wheat, Scan, TrendingUp, PhoneCall, Mail, Lock, User, MapPin, Globe, ArrowRight } from 'lucide-react';
import bdLocations from '../data/bd-locations.json';

const inputCls = "w-full rounded-[12px] border border-[#e4eae3] bg-white px-4 py-3 text-[15px] text-[#0b3b2a] placeholder:text-[#9aa79e] focus:border-[#7cc24a] focus:outline-none focus:ring-2 focus:ring-[#7cc24a]/20 transition-colors";
const selectCls = "w-full rounded-[12px] border border-[#e4eae3] bg-white px-4 py-3 text-[15px] text-[#0b3b2a] focus:border-[#7cc24a] focus:outline-none focus:ring-2 focus:ring-[#7cc24a]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const Register = () => {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  const [registerData, setRegisterData] = useState({
    name: "",
    phone: "",
    email: "",
    division: "",
    district: "",
    upazila: "",
    language: "English",
    password: "",
    confirmPassword: "",
    agree: false
  });
  const [message, setMessage] = useState("");

  const districts = useMemo(() => {
    if (!registerData.division) return [];
    const division = bdLocations.divisions.find(d => d.name === registerData.division);
    return division ? division.districts : [];
  }, [registerData.division]);

  const upazilas = useMemo(() => {
    if (!registerData.district || !districts.length) return [];
    const district = districts.find(d => d.name === registerData.district);
    return district ? district.upazilas : [];
  }, [registerData.district, districts]);

  const handleDivisionChange = (e) => {
    setRegisterData({ ...registerData, division: e.target.value, district: "", upazila: "" });
  };

  const handleDistrictChange = (e) => {
    setRegisterData({ ...registerData, district: e.target.value, upazila: "" });
  };

  const { register, message: authMessage } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    if (registerData.password !== registerData.confirmPassword) {
      const msg = isBn ? "পাসওয়ার্ড মিলছে না।" : "Passwords do not match.";
      setMessage(msg);
      toast.error(msg);
      return;
    }
    if (!registerData.agree) {
      const msg = isBn ? "আপনাকে শর্তাবলীতে সম্মত হতে হবে।" : "You must agree to the terms.";
      setMessage(msg);
      toast.error(msg);
      return;
    }
    const payload = { ...registerData };
    const langPref = (registerData.language || '').toString().toLowerCase();
    payload.preferredLanguage = (langPref === 'english' || langPref === 'en') ? 'en' : (langPref === 'bangla' || langPref === 'bn') ? 'bn' : 'en';

    payload.location = {
      division: registerData.division || '',
      district: registerData.district || '',
      upazila: registerData.upazila || ''
    };
    delete payload.division;
    delete payload.district;
    delete payload.upazila;
    delete payload.language;

    const result = await register(payload);
    if (result.ok) {
      toast.success(result.data?.message || (isBn ? 'সফলভাবে নিবন্ধন হয়েছে' : 'Registered successfully'));
      navigate('/login');
    } else {
      const errorMsg = result?.data?.message || result?.data?.errors?.join(', ') || result?.error?.message || (isBn ? 'নিবন্ধন ব্যর্থ হয়েছে' : 'Registration failed');
      toast.error(errorMsg);
      setMessage(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8f5] pt-[72px]">
      <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 min-h-[calc(100vh-72px)]">
        {/* LEFT — brand panel */}
        <div className="relative bg-[#0b3b2a] text-white px-8 md:px-14 py-16 md:py-20 overflow-hidden hidden lg:flex flex-col justify-between">
          <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#7cc24a]/12 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-[#7cc24a]/8 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-[12px] bg-[#7cc24a] flex items-center justify-center text-[#0b3b2a]">
                <Wheat className="w-5 h-5" strokeWidth={2.2} />
              </span>
              <span className="font-display font-extrabold text-2xl tracking-tight">
                AgriSmart
                <span className="text-[#7cc24a] ml-1 text-xs font-bold align-super">BD</span>
              </span>
            </span>
          </div>

          <div className="relative max-w-[420px]">
            <h1 className="font-display font-extrabold text-[34px] leading-[1.15] tracking-[-0.02em] mb-6">
              {isBn ? 'হাজার হাজার কৃষকের সাথে যোগ দিন' : 'Join thousands of farmers'}
            </h1>
            <p className="text-white/70 leading-[1.85] text-[15px] mb-10">
              {isBn ? 'বিনামূল্যে অ্যাকাউন্ট খুলুন এবং ফসল রক্ষা, ন্যায্য দাম ও লাইভ আপডেটের সব সুবিধা পান।' : 'Create a free account and get all the benefits — crop protection, fair prices, and live updates.'}
            </p>

            <ul className="space-y-4">
              {[
                { icon: Scan, text: isBn ? 'এআই ফসলের রোগ শনাক্তকরণ' : 'AI crop disease detection' },
                { icon: TrendingUp, text: isBn ? 'লাইভ আবহাওয়া ও বাজারদর' : 'Live weather & market prices' },
                { icon: Globe, text: isBn ? 'বাংলা ও ইংরেজিতে সম্পূর্ণ সাইট' : 'Full site in Bangla & English' },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <li key={i} className="flex items-center gap-3 text-[14.5px] text-white/85">
                    <span className="w-8 h-8 rounded-[9px] bg-[#7cc24a]/15 text-[#7cc24a] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" strokeWidth={2.2} />
                    </span>
                    {f.text}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative inline-flex items-center gap-2 text-[13px] text-white/60">
            <PhoneCall className="w-4 h-4 text-[#7cc24a]" />
            {isBn ? 'সাহায্য প্রয়োজন? কল করুন: ১৬১২৩ (২৪/৭)' : 'Need help? Call: 16123 (24/7)'}
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="flex items-start justify-center px-5 md:px-10 py-12 md:py-16">
          <div className="w-full max-w-[560px]">
            <div className="lg:hidden inline-flex items-center gap-2.5 mb-10">
              <span className="w-9 h-9 rounded-[10px] bg-[#0b3b2a] flex items-center justify-center text-[#7cc24a]">
                <Wheat className="w-5 h-5" strokeWidth={2.2} />
              </span>
              <span className="font-display font-extrabold text-xl tracking-tight text-[#0b3b2a]">
                AgriSmart
                <span className="text-[#6f7d73] ml-1 text-xs font-bold align-super">BD</span>
              </span>
            </div>

            <h2 className="font-display font-extrabold text-[#0b3b2a] text-3xl tracking-[-0.02em] mb-2">
              {isBn ? 'আপনার অ্যাকাউন্ট তৈরি করুন' : 'Create your account'}
            </h2>
            <p className="text-[#6f7d73] mb-9">
              {isBn ? 'বিনামূল্যে অ্যাকাউন্ট খুলুন — এক মিনিটেরও কম সময় লাগে।' : 'Sign up free — it takes less than a minute.'}
            </p>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-semibold text-[#0b3b2a] text-sm mb-2 block">{isBn ? 'পুরো নাম' : 'Full Name'}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9aa79e]" strokeWidth={2} />
                    <input className={`${inputCls} pl-11`} type="text" placeholder={isBn ? 'আপনার নাম' : 'Your name'} value={registerData.name} onChange={e => setRegisterData({ ...registerData, name: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-[#0b3b2a] text-sm mb-2 block">{isBn ? 'ফোন নম্বর' : 'Phone Number'}</label>
                  <div className="relative">
                    <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9aa79e]" strokeWidth={2} />
                    <input className={`${inputCls} pl-11`} type="text" placeholder="+880 1XXX-XXXXXX" value={registerData.phone} onChange={e => setRegisterData({ ...registerData, phone: e.target.value })} required />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#0b3b2a] text-sm mb-2 block">{isBn ? 'ইমেইল ঠিকানা (ঐচ্ছিক)' : 'Email Address (Optional)'}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9aa79e]" strokeWidth={2} />
                  <input className={`${inputCls} pl-11`} type="email" placeholder="farmer@example.com" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-semibold text-[#0b3b2a] text-sm mb-2 block">{isBn ? 'বিভাগ' : 'Division'}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9aa79e]" strokeWidth={2} />
                    <select className={`${selectCls} pl-11`} value={registerData.division} onChange={handleDivisionChange} required>
                      <option value="">{isBn ? '-- বিভাগ নির্বাচন করুন --' : '-- Select Division --'}</option>
                      {bdLocations.divisions.map(div => (
                        <option key={div.name} value={div.name}>{isBn ? div.nameBn : div.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-[#0b3b2a] text-sm mb-2 block">{isBn ? 'জেলা' : 'District'}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9aa79e]" strokeWidth={2} />
                    <select className={`${selectCls} pl-11`} value={registerData.district} onChange={handleDistrictChange} disabled={!registerData.division} required>
                      <option value="">{isBn ? '-- জেলা নির্বাচন করুন --' : '-- Select District --'}</option>
                      {districts.map(dist => (
                        <option key={dist.name} value={dist.name}>{isBn ? dist.nameBn : dist.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-semibold text-[#0b3b2a] text-sm mb-2 block">{isBn ? 'উপজেলা' : 'Upazila'}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9aa79e]" strokeWidth={2} />
                    <select className={`${selectCls} pl-11`} value={registerData.upazila} onChange={e => setRegisterData({ ...registerData, upazila: e.target.value })} disabled={!registerData.district} required>
                      <option value="">{isBn ? '-- উপজেলা নির্বাচন করুন --' : '-- Select Upazila --'}</option>
                      {upazilas.map(upz => (
                        <option key={upz} value={upz}>{upz}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-[#0b3b2a] text-sm mb-2 block">{isBn ? 'পছন্দের ভাষা' : 'Preferred Language'}</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9aa79e]" strokeWidth={2} />
                    <select className={`${selectCls} pl-11`} value={registerData.language} onChange={e => setRegisterData({ ...registerData, language: e.target.value })} required>
                      <option value="English">{isBn ? 'ইংরেজি' : 'English'}</option>
                      <option value="Bangla">{isBn ? 'বাংলা' : 'Bangla'}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-semibold text-[#0b3b2a] text-sm mb-2 block">{isBn ? 'পাসওয়ার্ড' : 'Password'}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9aa79e]" strokeWidth={2} />
                    <input className={`${inputCls} pl-11`} type="password" placeholder={isBn ? 'পাসওয়ার্ড' : 'Password'} value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-[#0b3b2a] text-sm mb-2 block">{isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9aa79e]" strokeWidth={2} />
                    <input className={`${inputCls} pl-11`} type="password" placeholder={isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'} value={registerData.confirmPassword} onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })} required />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#f6f8f5] border border-[#e4eae3] rounded-[12px] p-4">
                <input className="w-4 h-4 mt-0.5 rounded-[4px] border border-[#e4eae3] text-[#0b3b2a] focus:ring-[#7cc24a] focus:ring-2" type="checkbox" checked={registerData.agree} onChange={e => setRegisterData({ ...registerData, agree: e.target.checked })} required />
                <span className="text-[13px] text-[#47564c] leading-relaxed">
                  {isBn ? 'আমি সেবার শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত। আমি বুঝি আমার তথ্য সুরক্ষিত ও গোপনীয় থাকবে।' : 'I agree to the Terms of Service and Privacy Policy. I understand my data will be kept secure and private.'}
                </span>
              </div>

              <Button variant="primary" type="submit" size="lg" className="w-full gap-2">
                {isBn ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account'}
                <ArrowRight className="w-4 h-4" strokeWidth={2.4} />
              </Button>
            </form>

            <div className="mt-8 pt-7 border-t border-[#e4eae3] text-[#47564c] text-sm text-center">
              {isBn ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
              <Link to="/login" className="font-bold text-[#0b3b2a] hover:text-[#7cc24a] transition-colors">
                {isBn ? 'এখানে লগইন করুন' : 'Login Here'}
              </Link>
            </div>

            {message && <div className="mt-4 text-sm font-bold text-[#0b3b2a]">{message}</div>}
            {authMessage && <div className="mt-4 text-sm font-bold text-[#0b3b2a]">{authMessage}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
import { Button } from '../components/common/Button';
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import { Wheat, Scan, TrendingUp, MessageCircle, PhoneCall, Mail, Lock } from 'lucide-react';

const inputCls = "w-full rounded-[12px] border border-[#e4eae3] bg-white px-4 py-3 text-[15px] text-[#0b3b2a] placeholder:text-[#9aa79e] focus:border-[#7cc24a] focus:outline-none focus:ring-2 focus:ring-[#7cc24a]/20 transition-colors";

const Login = () => {
  const { login, message, setMessage } = useAuth();
  const { lang } = useLanguage();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const isBn = lang === 'bn';

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(loginData);
    if (result.ok) {
      toast.success(result.data?.message || (isBn ? 'সফলভাবে লগইন হয়েছে' : 'Logged in successfully'));
      navigate('/dashboard');
    } else {
      toast.error(result?.data?.message || result?.error?.message || (isBn ? 'লগইন ব্যর্থ হয়েছে' : 'Login failed'));
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8f5] pt-[72px]">
      <div className="max-w-[1180px] mx-auto grid lg:grid-cols-2 min-h-[calc(100vh-72px)]">
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
              {isBn ? 'স্মার্ট ফার্মিং, সরাসরি বাজার' : 'Smart farming, direct market'}
            </h1>
            <p className="text-white/70 leading-[1.85] text-[15px] mb-10">
              {isBn ? 'ছবিতে রোগ শনাক্ত, মধ্যস্বত্ত্বভোগী ছাড়া বিক্রি, লাইভ আবহাওয়া ও বাজারদর — সব এক প্ল্যাটফর্মে।' : 'Photo disease detection, middleman-free selling, live weather and market prices — all in one platform.'}
            </p>

            <ul className="space-y-4">
              {[
                { icon: Scan, text: isBn ? 'এআই ফসলের রোগ শনাক্তকরণ' : 'AI crop disease detection' },
                { icon: TrendingUp, text: isBn ? 'লাইভ আবহাওয়া ও বাজারদর' : 'Live weather & market prices' },
                { icon: MessageCircle, text: isBn ? 'ক্রেতার সঙ্গে সরাসরি চ্যাট' : 'Direct chat with real buyers' },
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
            {isBn ? 'কৃষক সহায়তা হটলাইন: ১৬১২৩ (২৪/৭)' : 'Farmer support hotline: 16123 (24/7)'}
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="flex items-start justify-center px-5 md:px-10 py-12 md:py-16">
          <div className="w-full max-w-[420px]">
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
              {isBn ? 'আবার স্বাগতম' : 'Welcome back'}
            </h2>
            <p className="text-[#6f7d73] mb-9">
              {isBn ? 'AgriSmart BD তে লগইন করুন' : 'Login to AgriSmart BD'}
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="font-semibold text-[#0b3b2a] text-sm mb-2 block">
                  {isBn ? 'ইমেইল ঠিকানা' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9aa79e]" strokeWidth={2} />
                  <input className={`${inputCls} pl-11`} type="email" placeholder="farmer@example.com" value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#0b3b2a] text-sm mb-2 block">
                  {isBn ? 'পাসওয়ার্ড' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9aa79e]" strokeWidth={2} />
                  <input className={`${inputCls} pl-11`} type="password" placeholder={isBn ? 'পাসওয়ার্ড' : 'Password'} value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} required />
                </div>
              </div>

              <div className="flex justify-end">
                <Link to="/forgot" className="text-sm font-semibold text-[#0b3b2a] hover:text-[#7cc24a] no-underline transition-colors">
                  {isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                </Link>
              </div>

              <Button variant="primary" type="submit" className="w-full" size="lg">
                {isBn ? 'লগইন করুন' : 'Login to Dashboard'}
              </Button>
            </form>

            <div className="mt-8 pt-7 border-t border-[#e4eae3] text-[#47564c] text-sm text-center">
              {isBn ? 'অ্যাকাউন্ট নেই?' : "Don't have an account?"}{' '}
              <Link to="/register" className="font-bold text-[#0b3b2a] hover:text-[#7cc24a] transition-colors">
                {isBn ? 'বিনামূল্যে সাইন আপ করুন' : 'Sign Up Free'}
              </Link>
            </div>

            {message && <div className="mt-4 text-sm font-bold text-[#0b3b2a]">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
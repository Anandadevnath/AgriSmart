import React, { useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Globe, Menu, X, Store, MessageCircle, TrendingUp, Scan, Wheat } from 'lucide-react';
import { useScroll, useOutsideClick } from "../hooks/useNavbarHooks";

function Logo({ className = "h-9 md:h-10" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-display font-extrabold tracking-tight ${className}`}>
      <span className="w-8 h-8 rounded-[10px] bg-[#0b3b2a] flex items-center justify-center text-[#7cc24a]">
        <Wheat className="w-4.5 h-4.5" strokeWidth={2.2} />
      </span>
      <span className="text-lg md:text-xl text-[#0b3b2a]">
        AgriSmart
        <span className="text-[#6f7d73] ml-1 text-xs md:text-sm font-bold align-super">BD</span>
      </span>
    </span>
  );
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const wrapperRef = useRef(null);
  const scrolled = useScroll();
  useOutsideClick(wrapperRef, () => setMenuOpen(false));

  // Redesigned pages use always-fixed light navbar;
  // other pages keep original absolute-at-top / fixed-on-scroll behavior
  const isDesignPage = ['/', '/login', '/register', '/scan-crop'].includes(location.pathname);

  const navClasses = isDesignPage
    ? 'fixed top-0 left-0 right-0 z-[9999] bg-[#f6f8f5]/90 backdrop-blur-md transition-shadow duration-300 border-b border-[#0b3b2a]/8'
    : `z-[9999] box-border transition-all duration-300 ${
        scrolled
          ? 'fixed top-0 left-0 right-0 bg-[#f6f8f5]/95 backdrop-blur-md shadow-[0_1px_0_rgba(11,59,42,0.08),0_8px_24px_-12px_rgba(11,59,42,0.25)]'
          : 'absolute top-0 left-0 right-0 bg-gradient-to-b from-black/40 to-transparent'
      }`;

  const textColor = isDesignPage || scrolled ? 'text-[#0b3b2a]' : 'text-white';
  const linkHover = isDesignPage || scrolled ? 'hover:text-[#7cc24a]' : 'hover:text-green-300';

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/marketplace', label: { en: 'Marketplace', bn: 'বাজার' }, icon: Store },
    { to: '/chat', label: { en: 'Chat', bn: 'চ্যাট' }, icon: MessageCircle },
    { to: '/prices', label: { en: 'Prices', bn: 'দাম' }, icon: TrendingUp },
    { to: '/scan-crop', label: { en: 'Scan Crop', bn: 'ফসল পরীক্ষা' }, icon: Scan },
    { to: '/about', label: { en: 'About', bn: 'আমাদের সম্পর্কে' }, icon: null },
  ];

  return (
    <nav className={navClasses}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-0 flex items-center justify-between min-h-[72px]">
        <Link to="/" className="inline-block no-underline">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7 justify-end">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.to} to={link.to}
                className={`flex items-center gap-1.5 text-sm font-semibold ${textColor} ${linkHover} transition-colors`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {lang === 'en' ? link.label.en : link.label.bn}
              </Link>
            );
          })}

          <button onClick={() => setLang(l => l === 'en' ? 'bn' : 'en')}
            className={`flex items-center gap-1.5 text-sm font-semibold ${textColor} ${linkHover} transition-colors`}
          >
            <Globe className="w-4 h-4" />
            <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
          </button>

          {user ? (
            <Link to="/dashboard"
              className="bg-[#0b3b2a] text-white px-5 py-2.5 rounded-[12px] font-bold text-sm hover:bg-[#0d4a34] transition-colors"
            >
              {lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}
            </Link>
          ) : (
            <Link to="/login"
              className="bg-[#7cc24a] text-[#0b3b2a] rounded-[12px] px-5 py-2.5 font-bold text-sm no-underline hover:bg-[#8ed25e] transition-colors"
            >
              {lang === 'en' ? 'Login' : 'লগইন'}
            </Link>
          )}

          {user && (
            <div className="relative" ref={wrapperRef}>
              <button className={`flex items-center gap-2 ${textColor}`} onClick={() => setMenuOpen(!menuOpen)}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-[#7cc24a]/40" />
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#0b3b2a]/10 font-bold text-sm text-[#0b3b2a]">
                    {(user.name && user.name[0]) || 'U'}
                  </div>
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white text-[#0b3b2a] rounded-xl shadow-[0_12px_32px_-8px_rgba(11,59,42,0.2)] border border-[#e4eae3] min-w-[160px] py-2 flex flex-col">
                  <Link to="/dashboard" className="px-4 py-2 hover:bg-[#f6f8f5] text-sm" onClick={() => setMenuOpen(false)}>
                    {lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}
                  </Link>
                  <Link to="/marketplace" className="px-4 py-2 hover:bg-[#f6f8f5] text-sm" onClick={() => setMenuOpen(false)}>
                    {lang === 'en' ? 'My Listings' : 'আমার তালিকা'}
                  </Link>
                  <Link to="/profile" className="px-4 py-2 hover:bg-[#f6f8f5] text-sm" onClick={() => setMenuOpen(false)}>
                    {lang === 'en' ? 'Profile' : 'প্রোফাইল'}
                  </Link>
                  <button className="px-4 py-2 text-left hover:bg-[#f6f8f5] text-red-600 text-sm" onClick={handleLogout}>
                    {lang === 'en' ? 'Logout' : 'লগআউট'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button className={`md:hidden p-2 ${textColor}`} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#f6f8f5] border-t border-[#0b3b2a]/8 shadow-[0_16px_32px_-12px_rgba(11,59,42,0.2)]">
          <div className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.to} to={link.to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#0b3b2a] hover:bg-[#e4eae3]/60 text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {Icon && <Icon className="w-5 h-5 text-[#0b3b2a]/70" />}
                  {lang === 'en' ? link.label.en : link.label.bn}
                </Link>
              );
            })}
            <div className="border-t border-[#0b3b2a]/8 my-2" />
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#0b3b2a] hover:bg-[#e4eae3]/60 text-sm font-medium" onClick={() => setMobileOpen(false)}>
                  {lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}
                </Link>
                <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#0b3b2a] hover:bg-[#e4eae3]/60 text-sm font-medium" onClick={() => setMobileOpen(false)}>
                  {lang === 'en' ? 'Profile' : 'প্রোফাইল'}
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium"
                >
                  {lang === 'en' ? 'Logout' : 'লগআউট'}
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#7cc24a] text-[#0b3b2a] text-sm font-bold text-center justify-center" onClick={() => setMobileOpen(false)}>
                {lang === 'en' ? 'Login' : 'লগইন'}
              </Link>
            )}
            <button onClick={() => { setLang(l => l === 'en' ? 'bn' : 'en'); setMobileOpen(false); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#0b3b2a] hover:bg-[#e4eae3]/60 text-sm font-medium"
            >
              <Globe className="w-5 h-5 text-[#0b3b2a]/70" />
              {lang === 'en' ? 'বাংলা' : 'English'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
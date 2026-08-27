import React, { useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Globe, Menu, X, Store, MessageCircle, TrendingUp, Scan } from 'lucide-react';
import { useScroll, useOutsideClick } from "../hooks/useNavbarHooks";

function Logo({ lang, className = "h-10 md:h-12" }) {
  return (
    <span className={`inline-flex items-center gap-2 font-extrabold tracking-tight ${className}`}>
      <span className="text-2xl">🌾</span>
      <span className="text-xl md:text-2xl">
        <span className="text-green-600">Agri</span>
        <span className="text-green-800">Smart</span>
        <span className="text-green-600 ml-0.5 text-sm font-normal align-super">BD</span>
      </span>
    </span>
  );
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const wrapperRef = useRef(null);
  const scrolled = useScroll();
  useOutsideClick(wrapperRef, () => setMenuOpen(false));

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/');
  };

  const navClasses = scrolled
    ? 'fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm'
    : 'absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent';

  const textColor = scrolled ? 'text-green-800' : 'text-white';
  const linkHover = scrolled ? 'hover:text-green-600' : 'hover:text-green-300';

  const navLinks = [
    { to: '/marketplace', label: { en: 'Marketplace', bn: 'বাজার' }, icon: Store },
    { to: '/chat', label: { en: 'Chat', bn: 'চ্যাট' }, icon: MessageCircle },
    { to: '/prices', label: { en: 'Prices', bn: 'দাম' }, icon: TrendingUp },
    { to: '/scan-crop', label: { en: 'Scan Crop', bn: 'ফসল পরীক্ষা' }, icon: Scan },
    { to: '/about', label: { en: 'About', bn: 'আমাদের সম্পর্কে' }, icon: null },
  ];

  return (
    <nav className={`z-[9999] box-border transition-all duration-300 ${navClasses}`}>
      <div className="max-w-[1400px] mx-auto px-4 py-0 flex items-center justify-between min-h-[72px]">
        <Link to="/" className="inline-block no-underline">
          <Logo lang={lang} className="h-10 md:h-12" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 justify-end">
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

          <div className="w-px h-5 bg-current opacity-20" />

          <button onClick={() => setLang(l => l === 'en' ? 'bn' : 'en')}
            className={`flex items-center gap-1.5 text-sm font-semibold ${textColor} ${linkHover}`}
          >
            <Globe className="w-4 h-4" />
            <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
          </button>

          {user ? (
            <Link to="/dashboard"
              className="bg-green-700 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-green-800 transition-colors"
            >
              {lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}
            </Link>
          ) : (
            <Link to="/login"
              className="bg-gradient-to-r from-[#9ef96a] to-[#49c74f] text-[#05310d] rounded-[28px] px-5 py-2 font-bold text-sm no-underline shadow-[0_10px_30px_rgba(46,125,50,0.18),0_0_0_6px_rgba(73,199,79,0.06)] transition-transform duration-150 hover:-translate-y-1"
            >
              {lang === 'en' ? 'Login' : 'লগইন'}
            </Link>
          )}

          {user && (
            <div className="relative" ref={wrapperRef}>
              <button className={`flex items-center gap-2 ${textColor}`} onClick={() => setMenuOpen(!menuOpen)}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-white/20" />
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-black/10 font-bold text-sm">
                    {(user.name && user.name[0]) || 'U'}
                  </div>
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white text-green-900 rounded-xl shadow-xl min-w-[160px] py-2 flex flex-col">
                  <Link to="/dashboard" className="px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setMenuOpen(false)}>
                    {lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}
                  </Link>
                  <Link to="/marketplace" className="px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setMenuOpen(false)}>
                    {lang === 'en' ? 'My Listings' : 'আমার তালিকা'}
                  </Link>
                  <Link to="/profile" className="px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setMenuOpen(false)}>
                    {lang === 'en' ? 'Profile' : 'প্রোফাইল'}
                  </Link>
                  <button className="px-4 py-2 text-left hover:bg-gray-100 text-red-600 text-sm" onClick={handleLogout}>
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
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
          <div className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.to} to={link.to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-green-800 hover:bg-green-50 text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {Icon && <Icon className="w-5 h-5 text-green-600" />}
                  {lang === 'en' ? link.label.en : link.label.bn}
                </Link>
              );
            })}
            <div className="border-t border-gray-100 my-2" />
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-green-800 hover:bg-green-50 text-sm font-medium" onClick={() => setMobileOpen(false)}>
                  {lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}
                </Link>
                <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-green-800 hover:bg-green-50 text-sm font-medium" onClick={() => setMobileOpen(false)}>
                  {lang === 'en' ? 'Profile' : 'প্রোফাইল'}
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium"
                >
                  {lang === 'en' ? 'Logout' : 'লগআউট'}
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-green-700 text-white text-sm font-medium text-center justify-center" onClick={() => setMobileOpen(false)}>
                {lang === 'en' ? 'Login' : 'লগইন'}
              </Link>
            )}
            <button onClick={() => { setLang(l => l === 'en' ? 'bn' : 'en'); setMobileOpen(false); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-green-800 hover:bg-green-50 text-sm font-medium"
            >
              <Globe className="w-5 h-5 text-green-600" />
              {lang === 'en' ? 'বাংলা' : 'English'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
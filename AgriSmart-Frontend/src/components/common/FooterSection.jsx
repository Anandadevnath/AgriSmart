import React from "react";
import { Link } from "react-router-dom";

export const FooterSection = ({ title, items = [], links = [], children }) => (
  <div>
    <div className="font-display font-bold text-[15px] tracking-tight text-white mb-4">{title}</div>
    {children || (
      <>
        {items.map((item, i) => (
          <span key={i} className="block text-sm text-white/60 mb-2.5">{item}</span>
        ))}
        {links.map((l, i) => (
          <Link key={i} to={l.to} className="block text-sm text-white/60 mb-2.5 hover:text-[#7cc24a] transition-colors no-underline">
            {l.label}
          </Link>
        ))}
      </>
    )}
  </div>
);
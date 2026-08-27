import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const FooterSection = ({ title, items = [], links = [], children }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
    <div className="text-xl font-semibold text-[#fffbe6] mb-3">{title}</div>
    {children || (
      <>
        {items.map((item, i) => (
          <a key={i} className="block text-[#e6ffe6] mb-2 hover:text-[#0af58a] transition-colors" href="#">
            {item}
          </a>
        ))}
        {links.map((l, i) => (
          <Link key={i} to={l.to} className="block text-[#e6ffe6] mb-2 hover:text-[#0af58a] transition-colors no-underline">
            {l.label}
          </Link>
        ))}
      </>
    )}
  </motion.div>
);

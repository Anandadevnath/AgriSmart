import React from "react";
import { motion } from "framer-motion";

export const HowItWorksStep = ({ id, icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ type: "spring", stiffness: 150, damping: 20, delay }}
    whileHover={{ y: -4 }}
    className="relative border border-[#e4eae3] rounded-[16px] p-6 pt-7 bg-[#f6f8f5] h-full"
  >
    <div className="flex items-start justify-between mb-5">
      <span className="w-11 h-11 rounded-[10px] bg-[#0b3b2a] text-[#7cc24a] flex items-center justify-center">
        <Icon className="w-5 h-5" strokeWidth={2.1} />
      </span>
      <span className="font-display font-extrabold text-[#0b3b2a]/20 text-3xl tabular leading-none">
        {String(id).padStart(2, '0')}
      </span>
    </div>
    <h3 className="font-display font-bold text-[#0b3b2a] text-[17px] tracking-tight mb-2">{title}</h3>
    <p className="text-[#47564c] text-[13.5px] leading-[1.7]">{desc}</p>
  </motion.div>
);
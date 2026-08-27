import React from "react";
import { motion } from "framer-motion";

export const StatItem = ({ value, label, subLabel }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="text-center sm:text-left px-2"
  >
    <div className="font-display font-extrabold text-[#0b3b2a] text-4xl md:text-[42px] tracking-[-0.02em] tabular mb-1.5">
      {value}
    </div>
    <div className="text-sm font-bold text-[#0b3b2a]">{label}</div>
    <div className="text-[13px] text-[#6f7d73] mt-0.5">{subLabel}</div>
  </motion.div>
);
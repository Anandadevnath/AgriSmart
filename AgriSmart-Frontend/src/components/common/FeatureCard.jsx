import React from "react";
import { motion } from "framer-motion";

export const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ type: "spring", stiffness: 160, damping: 20, delay }}
    whileHover={{ y: -3 }}
    className="group bg-[#f6f8f5] p-8 h-full"
  >
    <div className="flex items-center gap-4 mb-4">
      <span className="w-11 h-11 rounded-[10px] bg-[#0b3b2a] text-[#7cc24a] flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#7cc24a] group-hover:text-[#0b3b2a]">
        <Icon className="w-5 h-5" strokeWidth={2.1} />
      </span>
    </div>
    <h3 className="font-display font-bold text-[#0b3b2a] text-lg tracking-tight mb-2">{title}</h3>
    <p className="text-[14.5px] text-[#47564c] leading-[1.75]">{description}</p>
  </motion.div>
);
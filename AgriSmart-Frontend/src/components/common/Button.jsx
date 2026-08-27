import React from "react";
import { motion } from "framer-motion";

/**
 * A reusable Button component
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'accent'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {object} props - standard button props + motion props
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = "rounded-[14px] font-bold transition-all duration-300 flex items-center justify-center font-display tracking-tight";

  const variants = {
    primary: "bg-[--color-brand-button-primary] text-[--color-brand-secondary] hover:bg-[#0d4a34] shadow-[0_2px_10px_rgba(11,59,42,0.18)] hover:shadow-[0_4px_16px_rgba(11,59,42,0.26)] disabled:opacity-50 disabled:hover:bg-[--color-brand-button-primary]",
    secondary: "bg-transparent text-[--color-brand-button-outline] border border-[--color-brand-button-outline]/25 hover:border-[--color-brand-button-outline] hover:bg-[--color-brand-button-outline]/5 disabled:opacity-50",
    outline: "border border-[--color-brand-button-outline] text-[--color-brand-button-outline] hover:bg-[--color-brand-button-outline] hover:text-white disabled:opacity-50",
    accent: "bg-[--color-brand-highlight] text-[#0b3b2a] hover:bg-[#8ed25e] shadow-[0_2px_10px_rgba(124,194,74,0.35)] hover:shadow-[0_4px_18px_rgba(124,194,74,0.4)] disabled:opacity-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-[15px]",
    lg: "px-8 py-4 text-base",
  };

  return (
    <motion.button
      whileHover={!props.disabled ? { y: -1 } : {}}
      whileTap={!props.disabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

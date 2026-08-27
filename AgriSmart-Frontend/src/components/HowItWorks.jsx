import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from '../context/LanguageContext';
import { HowItWorksStep } from "./common/HowItWorksStep";
import { Camera, BrainCircuit, Store, MessageCircle } from "lucide-react";

export default function HowItWorks() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const steps = [
    {
      id: 1,
      icon: Camera,
      titleEn: "Upload Crop Photo",
      descEn: "Take a photo of a damaged leaf or crop with your smartphone",
      titleBn: "ফসলের ছবি তুলুন",
      descBn: "ক্ষতিগ্রস্ত পাতা বা ফসলের ছবি স্মার্টফোন দিয়ে তুলুন",
    },
    {
      id: 2,
      icon: BrainCircuit,
      titleEn: "AI Detects Disease",
      descEn: "Get instant diagnosis and simple treatment solutions",
      titleBn: "এআই রোগ শনাক্ত করুক",
      descBn: "তাৎক্ষণিক রোগ নির্ণয় ও সহজ সমাধান পান",
    },
    {
      id: 3,
      icon: Store,
      titleEn: "List & Sell Direct",
      descEn: "Post your harvest on the marketplace and check live prices",
      titleBn: "তালিকা ও সরাসরি বিক্রি",
      descBn: "বাজারে আপনার ফসল পোস্ট করুন এবং লাইভ দাম দেখুন",
    },
    {
      id: 4,
      icon: MessageCircle,
      titleEn: "Chat & Get Paid Fairly",
      descEn: "Talk directly with buyers, negotiate, and keep fair prices",
      titleBn: "চ্যাট ও ন্যায্য দাম",
      descBn: "ক্রেতার সঙ্গে সরাসরি কথা বলে ন্যায্য দামে বিক্রি করুন",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="bg-white py-24 px-5 md:px-8">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="max-w-[560px] mb-14">
          <div className="inline-flex items-center gap-2 text-[13px] font-bold tracking-[0.08em] uppercase text-[#0b3b2a] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#7cc24a]" />
            {isBn ? 'কীভাবে কাজ করে' : 'How it works'}
          </div>
          <h2 className="font-display font-extrabold text-[#0b3b2a] text-3xl md:text-[38px] tracking-[-0.02em] leading-[1.15] mb-4">
            {isBn ? 'রোগ শনাক্ত থেকে সরাসরি বিক্রি' : 'From disease detection to direct selling'}
          </h2>
          <p className="text-[#47564c] leading-[1.8]">
            {isBn ? 'চারটি সহজ ধাপে সম্পূর্ণ প্রক্রিয়া।' : 'Four simple steps from start to fair pay.'}
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <HowItWorksStep
              key={step.id}
              id={step.id}
              icon={step.icon}
              title={isBn ? step.titleBn : step.titleEn}
              desc={isBn ? step.descBn : step.descEn}
              delay={i * 0.07}
            />
          ))}
        </div>

        {/* Flow strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-14 bg-[#0b3b2a] text-white rounded-[16px] px-8 py-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[14px] font-bold tracking-wide"
        >
          {[
            isBn ? 'ছবি' : 'Photo',
            isBn ? 'রোগ শনাক্ত' : 'Diagnosis',
            isBn ? 'বিক্রি' : 'Sell',
            isBn ? 'ন্যায্য দাম' : 'Fair Price',
          ].map((label, i, arr) => (
            <React.Fragment key={i}>
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#7cc24a] text-[#0b3b2a] text-[11px] flex items-center justify-center font-extrabold">
                  {i + 1}
                </span>
                {label}
              </span>
              {i < arr.length - 1 && <span className="text-[#7cc24a] font-extrabold hidden sm:inline">→</span>}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
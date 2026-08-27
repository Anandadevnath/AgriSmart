import { motion } from "framer-motion";
import { useLanguage } from '../context/LanguageContext';
import { HowItWorksStep } from "./common/HowItWorksStep";
import img1 from '../assets/1.png';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.png';
import img4 from '../assets/4.jpg';

export default function HowItWorks() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const steps = [
    {
      id: 1,
      title: "Upload Crop Photo",
      desc: "Take a photo of a damaged leaf or crop with your smartphone",
      img: img4,
      icon: "📷",
    },
    {
      id: 2,
      title: "AI Detects Disease",
      desc: "Get instant diagnosis and simple treatment solutions",
      img: img3,
      icon: "🧠",
    },
    {
      id: 3,
      title: "List & Sell Direct",
      desc: "Post your harvest on the marketplace and check live prices",
      img: img2,
      icon: "🏪",
    },
    {
      id: 4,
      title: "Chat & Get Paid Fairly",
      desc: "Talk directly with buyers, negotiate, and keep fair prices",
      img: img1,
      icon: "💬",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const stagger = {
    show: { transition: { staggerChildren: 0.18 } },
  };

  return (
    <section className="bg-[#e8f9ef] py-20 px-4">
      <div className="max-w-[1200px] mx-auto">

        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full mx-auto bg-[#dbffe7] flex items-center justify-center text-4xl text-green-700 shadow-[0_10px_40px_rgba(0,120,60,0.15)]">
            🌾
          </div>

          <h2 className="text-4xl font-extrabold text-[#125f38] mt-4">
            {isBn ? 'AgriSmart BD কীভাবে কাজ করে' : 'How AgriSmart BD Works'}
          </h2>
          <p className="text-[#226343] opacity-80 mt-2 text-sm">
            {isBn ? 'রোগ শনাক্ত থেকে সরাসরি বিক্রি — চারটি সহজ ধাপ' : 'Four simple steps from disease detection to direct selling'}
          </p>
        </motion.div>

        {/* BADGES */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mt-10"
        >
          {[
            isBn ? '✔️ ছবিতে রোগ শনাক্তকরণ' : '✔️ AI Disease Detection by Photo',
            isBn ? '✔️ মধ্যস্বত্ত্বভোগী ছাড়া বাজার' : '✔️ Zero-Middleman Marketplace',
            isBn ? '✔️ লাইভ আবহাওয়া ও দাম' : '✔️ Live Weather & Price Alerts',
            isBn ? '✔️ কৃষকের আয় বাড়ে' : '✔️ Fairer Income for Farmers',
          ].map((b, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-white rounded-xl px-6 py-3 shadow-[0_6px_20px_rgba(0,100,40,0.08)] border border-[#daf7e6] text-[#0b703d] font-medium text-sm"
            >
              {b}
            </motion.div>
          ))}
        </motion.div>

        {/* STEPS GRID */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
        >
          {steps.map((step) => (
            <HowItWorksStep
              key={step.id}
              {...step}
              title={isBn ? (
                step.id === 1 ? 'ফসলের ছবি তুলুন' : step.id === 2 ? 'এআই রোগ শনাক্ত করুক' : step.id === 3 ? 'তালিকা ও সরাসরি বিক্রি' : 'চ্যাট ও ন্যায্য দাম'
              ) : step.title}
              desc={isBn ? (
                step.id === 1 ? 'ক্ষতিগ্রস্ত পাতা বা ফসলের ছবি স্মার্টফোন দিয়ে তুলুন' : step.id === 2 ? 'তাৎক্ষণিক রোগ নির্ণয় ও সহজ সমাধান পান' : step.id === 3 ? 'বাজারে আপনার ফসল পোস্ট করুন এবং লাইভ দাম দেখুন' : 'ক্রেতার সঙ্গে সরাসরি কথা বলে ন্যায্য দামে বিক্রি করুন'
              ) : step.desc}
            />
          ))}
        </motion.div>

        {/* BOTTOM FLOW SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-20 bg-white rounded-3xl p-10 shadow-[0_20px_45px_rgba(0,80,40,0.10)] max-w-[900px] mx-auto text-center"
        >
          <h3 className="text-[20px] font-extrabold text-[#105f37] mb-6">
            {isBn ? 'কীভাবে কাজ করে' : 'How It Works'}
          </h3>

          <div className="flex justify-center items-center gap-6 text-[15px] font-semibold text-white flex-wrap">

            <div className="bg-[#0fa451] px-5 py-2 rounded-full shadow">
              {isBn ? 'ছবি' : 'Photo'}
            </div>

            <div className="text-[#0fa451] text-2xl">→</div>

            <div className="bg-[#0fa451] px-5 py-2 rounded-full shadow">
              {isBn ? 'রোগ শনাক্ত' : 'Diagnosis'}
            </div>

            <div className="text-[#0fa451] text-2xl">→</div>

            <div className="bg-[#0fa451] px-5 py-2 rounded-full shadow">
              {isBn ? 'বিক্রি' : 'Sell'}
            </div>

            <div className="text-[#0fa451] text-2xl">→</div>

            <div className="bg-[#0fa451] px-5 py-2 rounded-full shadow">
              {isBn ? 'ন্যায্য দাম' : 'Fair Price'}
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
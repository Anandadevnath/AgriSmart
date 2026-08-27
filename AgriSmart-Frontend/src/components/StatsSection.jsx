import { StatItem } from './common/StatItem';
import { useLanguage } from '../context/LanguageContext';

export default function StatsSection() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  return (
    <section className="border-y border-[#0b3b2a]/8 bg-[#f6f8f5]">
      <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-14 grid grid-cols-1 sm:grid-cols-3 gap-y-10 gap-x-8">
        <StatItem
          value="10K+"
          label={isBn ? 'ফসল পরীক্ষা সম্পন্ন' : 'Crops Scanned'}
          subLabel={isBn ? 'এআই রোগ শনাক্তকরণ' : 'AI Disease Detection'}
        />
        <StatItem
          value="5K+"
          label={isBn ? 'কৃষক সংযুক্ত' : 'Farmers Connected'}
          subLabel={isBn ? 'সরাসরি বাজারে' : 'Direct Marketplace'}
        />
        <StatItem
          value="৳50Cr+"
          label={isBn ? 'ন্যায্য মূল্য নিশ্চিত' : 'Fair Price Secured'}
          subLabel={isBn ? 'মধ্যস্বত্ত্বভোগী ছাড়া' : 'No Middlemen'}
        />
      </div>
    </section>
  );
}
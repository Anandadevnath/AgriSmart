import { StatItem } from './common/StatItem';
import { useLanguage } from '../context/LanguageContext';

export default function StatsSection(){
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  return (
    <section className="py-20 px-4 bg-green-50">
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
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
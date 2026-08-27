// Curated reference wholesale prices (BDT per kg) for common Bangladeshi crops.
// Used to power the "Live Market Price" feed. A small deterministic daily
// fluctuation is applied at request time so the feed feels live in the demo.
export const BASE_PRICES = [
  { cropType: 'Rice', bn: 'চাল', base: 62, unit: 'kg' },
  { cropType: 'Paddy', bn: 'ধান', base: 32, unit: 'kg' },
  { cropType: 'Wheat', bn: 'গম', base: 45, unit: 'kg' },
  { cropType: 'Maize', bn: 'ভুট্টা', base: 30, unit: 'kg' },
  { cropType: 'Potato', bn: 'আলু', base: 40, unit: 'kg' },
  { cropType: 'Onion', bn: 'পেঁয়াজ', base: 70, unit: 'kg' },
  { cropType: 'Garlic', bn: 'রসুন', base: 180, unit: 'kg' },
  { cropType: 'Tomato', bn: 'টমেটো', base: 55, unit: 'kg' },
  { cropType: 'Chili', bn: 'মরিচ', base: 120, unit: 'kg' },
  { cropType: 'Brinjal', bn: 'বেগুন', base: 50, unit: 'kg' },
  { cropType: 'Lentils', bn: 'মসুর ডাল', base: 110, unit: 'kg' },
  { cropType: 'Mustard', bn: 'সরিষা', base: 95, unit: 'kg' },
  { cropType: 'Jute', bn: 'পাট', base: 85, unit: 'kg' },
  { cropType: 'Ginger', bn: 'আদা', base: 210, unit: 'kg' },
  { cropType: 'Turmeric', bn: 'হলুদ', base: 160, unit: 'kg' },
  { cropType: 'Mango', bn: 'আম', base: 90, unit: 'kg' },
  { cropType: 'Banana', bn: 'কলা', base: 45, unit: 'kg' },
];

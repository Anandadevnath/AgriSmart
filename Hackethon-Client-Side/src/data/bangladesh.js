// Shared reference data for AgriSmart BD — crops, divisions & districts.
// Keeps bilingual (en/bn) labels consistent across Marketplace, Dashboard, Prices.

// Crops commonly grown & traded in Bangladesh (mirrors server CROP_TYPES).
export const CROP_OPTIONS = [
  // Grains & Cereals
  { value: 'Paddy', bn: 'ধান' },
  { value: 'Rice', bn: 'চাল' },
  { value: 'Wheat', bn: 'গম' },
  { value: 'Maize', bn: 'ভুট্টা' },
  { value: 'Barley', bn: 'যব' },
  // Cash Crops
  { value: 'Jute', bn: 'পাট' },
  { value: 'Sugarcane', bn: 'আখ' },
  { value: 'Cotton', bn: 'তুলা' },
  { value: 'Tobacco', bn: 'তামাক' },
  { value: 'Tea', bn: 'চা' },
  // Vegetables
  { value: 'Potato', bn: 'আলু' },
  { value: 'Onion', bn: 'পেঁয়াজ' },
  { value: 'Garlic', bn: 'রসুন' },
  { value: 'Tomato', bn: 'টমেটো' },
  { value: 'Chili', bn: 'মরিচ' },
  { value: 'Brinjal', bn: 'বেগুন' },
  { value: 'Cabbage', bn: 'বাঁধাকপি' },
  { value: 'Cauliflower', bn: 'ফুলকপি' },
  { value: 'Carrot', bn: 'গাজর' },
  { value: 'Radish', bn: 'মুলা' },
  { value: 'Spinach', bn: 'পালং শাক' },
  { value: 'Pumpkin', bn: 'কুমড়া' },
  { value: 'Bottle Gourd', bn: 'লাউ' },
  { value: 'Bitter Gourd', bn: 'করলা' },
  { value: 'Cucumber', bn: 'শসা' },
  { value: 'Okra', bn: 'ঢেঁড়স' },
  { value: 'Beans', bn: 'বরবটি' },
  { value: 'Ginger', bn: 'আদা' },
  { value: 'Turmeric', bn: 'হলুদ' },
  { value: 'Coriander', bn: 'ধনে' },
  // Pulses
  { value: 'Lentils', bn: 'মসুর ডাল' },
  { value: 'Chickpea', bn: 'ছোলা' },
  { value: 'Mung Bean', bn: 'মুগ ডাল' },
  { value: 'Black Gram', bn: 'মাসকলাই' },
  { value: 'Peas', bn: 'মটর' },
  // Oilseeds
  { value: 'Mustard', bn: 'সরিষা' },
  { value: 'Groundnut', bn: 'বাদাম' },
  { value: 'Sesame', bn: 'তিল' },
  { value: 'Sunflower', bn: 'সূর্যমুখী' },
  // Fruits
  { value: 'Mango', bn: 'আম' },
  { value: 'Banana', bn: 'কলা' },
  { value: 'Jackfruit', bn: 'কাঁঠাল' },
  { value: 'Litchi', bn: 'লিচু' },
  { value: 'Papaya', bn: 'পেঁপে' },
  { value: 'Guava', bn: 'পেয়ারা' },
  { value: 'Watermelon', bn: 'তরমুজ' },
  { value: 'Pineapple', bn: 'আনারস' },
  { value: 'Coconut', bn: 'নারিকেল' },
  { value: 'Orange', bn: 'কমলা' },
  { value: 'Lemon', bn: 'লেবু' },
  // Others
  { value: 'Betel Leaf', bn: 'পান' },
  { value: 'Betel Nut', bn: 'সুপারি' },
  { value: 'Vegetables', bn: 'সবজি' },
  { value: 'Other', bn: 'অন্যান্য' },
];

export const cropLabel = (value, lang) => {
  const c = CROP_OPTIONS.find((x) => x.value.toLowerCase() === String(value || '').toLowerCase());
  if (!c) return value || '';
  return lang === 'bn' ? c.bn : c.value;
};

export const DIVISIONS = ['Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh'];

export const DISTRICTS = {
  Dhaka: ['Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Narsingdi', 'Manikganj', 'Munshiganj', 'Faridpur', 'Gopalganj', 'Madaripur', 'Rajbari', 'Shariatpur'],
  Chattogram: ['Chattogram', 'Cox\'s Bazar', 'Comilla', 'Brahmanbaria', 'Chandpur', 'Feni', 'Lakshmipur', 'Noakhali', 'Rangamati', 'Khagrachhari', 'Bandarban'],
  Rajshahi: ['Rajshahi', 'Bogura', 'Pabna', 'Sirajganj', 'Natore', 'Joypurhat', 'Naogaon', 'Chapainawabganj'],
  Khulna: ['Khulna', 'Jessore', 'Satkhira', 'Bagerhat', 'Jhenaidah', 'Magura', 'Kushtia', 'Chuadanga', 'Meherpur', 'Narail'],
  Barishal: ['Barishal', 'Bhola', 'Patuakhali', 'Pirojpur', 'Barguna', 'Jhalokathi'],
  Sylhet: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  Rangpur: ['Rangpur', 'Dinajpur', 'Kurigram', 'Gaibandha', 'Nilphamari', 'Panchagarh', 'Thakurgaon', 'Lalmonirhat'],
  Mymensingh: ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'],
};

// Divisions in Bangla for the bilingual UI.
export const DIVISION_BN = {
  Dhaka: 'ঢাকা',
  Chattogram: 'চট্টগ্রাম',
  Rajshahi: 'রাজশাহী',
  Khulna: 'খুলনা',
  Barishal: 'বরিশাল',
  Sylhet: 'সিলেট',
  Rangpur: 'রংপুর',
  Mymensingh: 'ময়মনসিংহ',
};

export const divLabel = (value, lang) => (lang === 'bn' ? DIVISION_BN[value] || value : value);

// A short banner colour keyed by crop type for listing cards without a photo.
const BANNER_COLORS = ['#0b6b3a', '#128a4f', '#0e7d46', '#0a8f58', '#067e4b', '#1d9e5f', '#0f9d5c', '#0c7a44'];
export const cropBannerColor = (cropType) => {
  let h = 0;
  const s = String(cropType || '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
  return BANNER_COLORS[h % BANNER_COLORS.length];
};

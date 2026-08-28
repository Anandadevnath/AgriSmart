// src/utils/riskEngine.js

// Bangla translations for crops and storage
const CROP_BN = {
  Rice: 'চাল', Paddy: 'ধান', Wheat: 'গম', Maize: 'ভুট্টা',
  Potato: 'আলু', Onion: 'পেঁয়াজ', Jute: 'পাট', Sugarcane: 'আখ',
  Tomato: 'টমেটো', Chili: 'মরিচ', Mango: 'আম', Banana: 'কলা',
  Lentils: 'মসুর ডাল', Mustard: 'সরিষা', Garlic: 'রসুন'
};

const STORAGE_BN = {
  'Jute Bag Stack': 'পাটের বস্তার স্তূপ',
  'Silo': 'সাইলো',
  'Open Area': 'খোলা জায়গা',
  'Cold Storage': 'হিমাগার',
  'Warehouse': 'গুদাম'
};

const RISK_BN = {
  'Critical': 'সংকটপূর্ণ',
  'High': 'উচ্চ',
  'Moderate': 'মাঝারি',
  'Low': 'কম'
};

export function getMockWeatherForecast(division) {
  const divisionConfig = {
    "Chattogram Division": {
      temp: [28, 33],
      humidity: [70, 93],
      rain: [40, 80],
    },
    "Dhaka Division": { temp: [27, 32], humidity: [60, 85], rain: [30, 60] },
    "Rajshahi Division": { temp: [26, 34], humidity: [45, 70], rain: [10, 40] },
    "Rangpur Division": { temp: [25, 32], humidity: [65, 90], rain: [30, 70] },
  };

  const cfg = divisionConfig[division] || divisionConfig["Dhaka Division"];
  const rand = (min, max) => (Math.random() * (max - min) + min).toFixed(1);

  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push({
      day: `Day ${i + 1}`,
      temp: Number(rand(cfg.temp[0], cfg.temp[1])),
      humidity: Number(rand(cfg.humidity[0], cfg.humidity[1])),
      rainProb: Number(rand(cfg.rain[0], cfg.rain[1])),
    });
  }
  return days;
}

export function calculateETCL(moisture, temperature, weather) {
  const riskFactor = (moisture - 14) * 2 + (temperature - 28) * 1.5;

  let etcl = 120 - riskFactor * 6;
  etcl = Math.min(Math.max(etcl, 12), 120);

  const avgHumidity =
    weather.reduce((a, b) => a + b.humidity, 0) / weather.length;
  const avgRain = weather.reduce((a, b) => a + b.rainProb, 0) / weather.length;
  const avgTemp = weather.reduce((a, b) => a + b.temp, 0) / weather.length;

  if (avgHumidity > 80) etcl -= 12;
  if (avgRain > 60) etcl -= 18;
  if (avgTemp > 32) etcl -= 6;

  etcl = Math.max(12, etcl);

  return {
    etcl: Math.round(etcl),
    avgHumidity: avgHumidity.toFixed(1),
    avgRain: avgRain.toFixed(1),
    avgTemp: avgTemp.toFixed(1),
  };
}

// Generate human-readable, dynamic message
export function generateRiskSummaryFromRow(row) {
  const forecast = getMockWeatherForecast(row["Location (Division)"]);
  const result = calculateETCL(row["Moisture (%)"], row["Temp (C)"], forecast);

  let riskLevel;
  let advice = "";

  if (result.etcl <= 24) {
    riskLevel = "Critical";
    advice =
      "Immediate action required: dry indoors, aerate, and monitor closely.";
  } else if (result.etcl <= 48) {
    riskLevel = "High";
    advice =
      "High risk: check storage conditions, consider aeration and moisture control.";
  } else if (result.etcl <= 72) {
    riskLevel = "Moderate";
    advice = "Moderate risk: monitor moisture and temperature regularly.";
  } else {
    riskLevel = "Low";
    advice = "Low risk: maintain standard storage procedures.";
  }

  const message =
    `${row["Batch_ID"]} in ${row["Location (District)"]}, ${row["Location (Division)"]} is at ${riskLevel} risk. ` +
    `Estimated Time to Critical Loss (ETCL): ${result.etcl} hours. ` +
    `Average humidity: ${result.avgHumidity}%, rainfall probability: ${result.avgRain}%. ${advice}`;

  // Generate Bangla smart alert
  const cropType = row["Crop_Type"] || "Rice";
  const storageType = row["Storage_Type"] || "Warehouse";
  const cropBn = CROP_BN[cropType] || cropType;
  const storageBn = STORAGE_BN[storageType] || storageType;
  const riskBn = RISK_BN[riskLevel] || riskLevel;
  
  const banglaAlert = generateBanglaSmartAlert({
    cropType,
    cropBn,
    storageType,
    storageBn,
    riskLevel,
    riskBn,
    etcl: result.etcl,
    humidity: parseFloat(result.avgHumidity),
    rainProb: parseFloat(result.avgRain),
    temperature: parseFloat(result.avgTemp)
  });

  return {
    batchId: row["Batch_ID"],
    division: row["Location (Division)"],
    district: row["Location (District)"],
    cropType,
    cropBn,
    storageType,
    storageBn,
    riskLevel,
    riskBn,
    etcl: result.etcl,
    avgHumidity: result.avgHumidity,
    avgRain: result.avgRain,
    avgTemp: result.avgTemp,
    forecast,
    message,
    banglaAlert, // Smart Bangla alert message
  };
}

/**
 * Generate smart Bangla alert based on crop, weather, and risk data
 */
export function generateBanglaSmartAlert({
  cropType,
  cropBn,
  storageType,
  storageBn,
  riskLevel,
  riskBn,
  etcl,
  humidity,
  rainProb,
  temperature
}) {
  const crop = cropBn || CROP_BN[cropType] || cropType;
  const storage = storageBn || STORAGE_BN[storageType] || 'গুদাম';

  switch (riskLevel) {
    case 'Critical':
      if (rainProb > 70) {
        return `⚠️ জরুরি! আগামীকাল ${Math.round(rainProb)}% বৃষ্টির সম্ভাবনা এবং আপনার ${crop} ${storage}-এ আর্দ্রতা বেশি। এখনই শুকনো জায়গায় সরান অথবা ঢেকে রাখুন!`;
      } else if (humidity > 80) {
        return `⚠️ জরুরি! আপনার ${crop} ${storage}-এ আর্দ্রতা ${Math.round(humidity)}%। এখনই ফ্যান চালু করুন এবং বায়ু চলাচল বাড়ান!`;
      } else if (temperature > 35) {
        return `⚠️ জরুরি! তাপমাত্রা ${Math.round(temperature)}°C - আপনার ${crop} নষ্ট হতে পারে। এখনই ছায়ায় রাখুন এবং ঠান্ডা করার ব্যবস্থা করুন!`;
      } else {
        return `⚠️ জরুরি সতর্কতা! আপনার ${crop} সংকটপূর্ণ অবস্থায় আছে। ${etcl} ঘন্টার মধ্যে পদক্ষেপ নিন!`;
      }

    case 'High':
      if (rainProb > 60) {
        return `🔴 উচ্চ ঝুঁকি! আগামীকাল বৃষ্টির সম্ভাবনা ${Math.round(rainProb)}%। আপনার ${crop} ঢেকে রাখুন এবং ${storage} পরীক্ষা করুন।`;
      } else if (humidity > 75) {
        return `🔴 উচ্চ ঝুঁকি! ${storage}-এ আর্দ্রতা ${Math.round(humidity)}%। আপনার ${crop}-এর জন্য বায়ু চলাচল বাড়ান।`;
      } else {
        return `🔴 উচ্চ ঝুঁকি! আপনার ${crop} ${storage}-এ ঝুঁকিতে আছে। ${etcl} ঘন্টার মধ্যে পরীক্ষা করুন।`;
      }

    case 'Moderate':
      return `🟡 মাঝারি ঝুঁকি। আপনার ${crop} নিয়মিত পর্যবেক্ষণ করুন। আর্দ্রতা ${Math.round(humidity)}% এবং বৃষ্টির সম্ভাবনা ${Math.round(rainProb)}%।`;

    default:
      return `🟢 আপনার ${crop} ভালো অবস্থায় আছে। স্বাভাবিক সংরক্ষণ পদ্ধতি অব্যাহত রাখুন।`;
  }
}

// src/services/smartAlertService.js
// Smart Alert Service - Combines Crop + Weather + Risk for Bangla Alerts

import api from './api';

/**
 * Generate a smart Bangla alert for a crop batch
 * @param {Object} params - Alert parameters
 * @returns {Promise<Object>} - Alert data with Bangla message
 */
export async function generateSmartAlert({
  cropType,
  storageType,
  division,
  district,
  riskLevel,
  etcl,
  temperature,
  humidity,
  rainProb,
  moisture
}) {
  try {
    const { ok, data } = await api.post('/api/smart-alert', {
      cropType,
      storageType,
      division,
      district,
      riskLevel,
      etcl,
      temperature,
      humidity,
      rainProb,
      moisture
    });

    if (ok && data?.data) {
      return data.data;
    }

    throw new Error('Failed to generate alert');
  } catch (error) {
    console.error('Smart Alert Error:', error);
    // Return fallback alert
    return generateLocalFallbackAlert({
      cropType, storageType, riskLevel, etcl,
      temperature, humidity, rainProb
    });
  }
}

/**
 * Local fallback alert generation (no server needed)
 */
function generateLocalFallbackAlert({
  cropType, storageType, riskLevel, etcl,
  temperature, humidity, rainProb
}) {
  const CROP_BN = {
    Rice: 'চাল', Paddy: 'ধান', Wheat: 'গম', Maize: 'ভুট্টা',
    Potato: 'আলু', Onion: 'পেঁয়াজ', Jute: 'পাট', Sugarcane: 'আখ',
    Tomato: 'টমেটো', Chili: 'মরিচ', Mango: 'আম', Banana: 'কলা'
  };

  const STORAGE_BN = {
    'Jute Bag Stack': 'পাটের বস্তা',
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

  const cropBn = CROP_BN[cropType] || cropType;
  const storageBn = STORAGE_BN[storageType] || 'গুদাম';
  const riskBn = RISK_BN[riskLevel] || riskLevel;

  let alertMessage = '';

  switch (riskLevel) {
    case 'Critical':
      if (rainProb > 70) {
        alertMessage = `⚠️ জরুরি! আগামীকাল ${Math.round(rainProb)}% বৃষ্টির সম্ভাবনা। আপনার ${cropBn} ${storageBn} থেকে সরিয়ে শুকনো জায়গায় রাখুন। এখনই পদক্ষেপ নিন!`;
      } else if (humidity > 80) {
        alertMessage = `⚠️ জরুরি! ${storageBn}-এ আর্দ্রতা ${Math.round(humidity)}%। আপনার ${cropBn} নষ্ট হতে পারে। এখনই ফ্যান চালু করুন!`;
      } else if (temperature > 35) {
        alertMessage = `⚠️ জরুরি! তাপমাত্রা ${Math.round(temperature)}°C। আপনার ${cropBn} ক্ষতিগ্রস্ত হতে পারে। ছায়ায় রাখুন!`;
      } else {
        alertMessage = `⚠️ জরুরি সতর্কতা! আপনার ${cropBn} সংকটপূর্ণ অবস্থায়। ${etcl || 24} ঘন্টার মধ্যে পদক্ষেপ নিন।`;
      }
      break;
    case 'High':
      alertMessage = `🔴 উচ্চ ঝুঁকি! আপনার ${cropBn} ${storageBn}-এ ঝুঁকিতে আছে। আর্দ্রতা ও তাপমাত্রা নিয়ন্ত্রণ করুন।`;
      break;
    case 'Moderate':
      alertMessage = `🟡 মাঝারি ঝুঁকি। আপনার ${cropBn} নিয়মিত পর্যবেক্ষণ করুন। বায়ু চলাচল ভালো রাখুন।`;
      break;
    default:
      alertMessage = `🟢 আপনার ${cropBn} ভালো অবস্থায় আছে। স্বাভাবিক সংরক্ষণ পদ্ধতি অব্যাহত রাখুন।`;
  }

  return {
    alertMessage,
    riskLevel,
    riskBn,
    cropType,
    cropBn,
    etcl,
    timestamp: new Date().toISOString(),
    fallback: true
  };
}

/**
 * Generate alerts for multiple crops from risk data
 * @param {Array} riskResults - Array of risk assessment results
 * @param {Object} weatherData - Current weather data
 * @returns {Array} - Array of alerts with Bangla messages
 */
export async function generateAlertsFromRiskData(riskResults, weatherData = {}) {
  const alerts = [];

  for (const risk of riskResults) {
    try {
      const alert = await generateSmartAlert({
        cropType: risk.cropType || 'Rice',
        storageType: risk.storageType || 'Warehouse',
        division: risk.division,
        district: risk.district,
        riskLevel: risk.riskLevel,
        etcl: risk.etcl,
        temperature: weatherData.temp || risk.avgTemp,
        humidity: weatherData.humidity || risk.avgHumidity,
        rainProb: weatherData.rainProb || risk.avgRain,
        moisture: risk.moisture
      });

      alerts.push({
        ...risk,
        smartAlert: alert
      });
    } catch (err) {
      console.error('Error generating alert for risk:', err);
      alerts.push(risk);
    }
  }

  return alerts;
}

export default {
  generateSmartAlert,
  generateAlertsFromRiskData
};

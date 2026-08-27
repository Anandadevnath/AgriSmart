// src/services/smartAlertService.js
// Smart Alert Service - Combines Crop + Weather + Risk for Bangla Alerts

import api from './api';
import { toast } from 'react-hot-toast';

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
      const alertData = data.data;
      
      // Simulate SMS if risk is Critical
      if (alertData.shouldSimulateSMS) {
        simulateSMSNotification(alertData);
      }
      
      return alertData;
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
 * Simulate SMS Notification in Browser Console
 * Called when risk level is "Critical"
 */
export function simulateSMSNotification(alertData) {
  const timestamp = new Date().toLocaleString('bn-BD', {
    timeZone: 'Asia/Dhaka',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  // Console SMS simulation with styled output
  console.log('%c═══════════════════════════════════════════════════════════════', 'color: #dc2626; font-weight: bold;');
  console.log('%c📱 SMS NOTIFICATION - জরুরি সতর্কতা!', 'color: #dc2626; font-size: 16px; font-weight: bold;');
  console.log('%c═══════════════════════════════════════════════════════════════', 'color: #dc2626; font-weight: bold;');
  console.log('%cTo: +880-XXXX-XXXXXX (কৃষক)', 'color: #1e40af; font-weight: bold;');
  console.log('%cFrom: HarvestGuard SMS Service', 'color: #1e40af;');
  console.log('%c───────────────────────────────────────────────────────────────', 'color: #6b7280;');
  console.log('%c' + alertData.alertMessage, 'color: #111827; font-size: 14px; padding: 8px; background: #fef3c7; border-radius: 4px;');
  console.log('%c───────────────────────────────────────────────────────────────', 'color: #6b7280;');
  console.log('%cফসল: ' + (alertData.cropBn || alertData.cropType), 'color: #15803d;');
  console.log('%cঝুঁকির মাত্রা: ' + (alertData.riskBn || alertData.riskLevel), 'color: #dc2626; font-weight: bold;');
  console.log('%cসময়: ' + timestamp, 'color: #6b7280;');
  console.log('%c═══════════════════════════════════════════════════════════════', 'color: #dc2626; font-weight: bold;');

  // Also try to show browser notification if permitted
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      showBrowserNotification(alertData);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showBrowserNotification(alertData);
        }
      });
    }
  }

  // Play alert sound (optional)
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp6enJmPem5mYl5dYmxzf4KGi46OjIqGgXx2cW5ucXZ8gYaKjY+PjoyJhYB7dnJwcHN3fIKHi46QkI6MiYWAfHdzc3N2en+EiIyPkJCOjIqGgn17eHd4e3+DhoqNj5CPjouIhIB7eHZ2eXt/g4eMjY+Pjo2KiIR/e3h2dnl8gISHi42Pj46Ni4iEgHx4dnd5fIGFiIyNjo6NjImGgn56d3d5fIGFiIyNjo6NjImFgX56d3d5fIGFiIyNjo6NjImFgX56d3d5fIGFiIyNjo2NjImFgX56d3d5fIGEh4uNjo6NjImFgX56eHd5fIGEh4uNjo2MjImFgX56eHd5fIGEh4uNjo2MjImFgX56eHd5fIGEh4uNjo2MjImFgX56eHh5fIGEh4uNjo2MjImFgX56eHh5fICEh4uMjY2MjImFgX56eHh5fICEh4uMjY2MjImFgX56eHh5fICEh4uMjY2MjImFgX56eHh5fICEh4uMjYyMjImFgX56eHh5fICEh4uMjYyMjImFgX56eHh5fICEh4uMjYyMjImFgX56eHh5e4CEh4uMjYyMjImFgX56eHh5e4CEh4qMjYyMjImFgX56eHh5e4CEh4qMjYyMjImFgX56eHh5e4CDh4qMjIyMjImFgX56eHh5e4CDh4qMjIyMjImFgX56');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch (e) {}
}

/**
 * Show browser notification
 */
function showBrowserNotification(alertData) {
  new Notification('🚨 জরুরি সতর্কতা - HarvestGuard', {
    body: alertData.alertMessage,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'critical-alert',
    requireInteraction: true
  });
}

/**
 * Send an emergency SMS via the backend gateway (or demo fallback).
 * On success shows a toast; on demo fallback also shows a browser notification.
 * @param {string} to - Phone number in local format (e.g. 01812345678)
 * @param {string} message - SMS text content
 */
export async function sendEmergencySms({ to, message }) {
  try {
    const { ok, data } = await api.post('/api/smart-alert/sms', { to, message });
    if (!ok) {
      toast.error('SMS failed to send');
      return { sent: false };
    }
    if (data.simulated) {
      toast.success('📱 SMS sent (demo — no gateway configured)', { duration: 4000 });
      // Also show a browser notification so the user gets the experience
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('📱 AgriSmart SMS (Demo)', {
          body: `To: ${to}\n${message.slice(0, 80)}…`,
        });
      }
      return { sent: false, simulated: true };
    }
    if (data.sent) {
      toast.success(`📱 SMS sent to ${to}`, { duration: 4000 });
      return { sent: true };
    }
    toast.error('SMS delivery failed');
    return { sent: false };
  } catch (e) {
    toast.error('SMS service unavailable');
    return { sent: false };
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

  const result = {
    alertMessage,
    riskLevel,
    riskBn,
    cropType,
    cropBn,
    etcl,
    shouldSimulateSMS: riskLevel === 'Critical',
    timestamp: new Date().toISOString(),
    fallback: true
  };

  // Simulate SMS for Critical
  if (riskLevel === 'Critical') {
    simulateSMSNotification(result);
  }

  return result;
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
  simulateSMSNotification,
  sendEmergencySms,
  generateAlertsFromRiskData
};


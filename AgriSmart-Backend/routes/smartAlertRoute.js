// routes/smartAlertRoute.js
import express from 'express';
import {
  generateSmartAlert,
  generateBatchAlerts,
  sendSmsAlert,
} from '../controllers/smartAlertController.js';

const router = express.Router();

/**
 * POST /api/smart-alert
 * Generate a single smart Bangla alert using LLM
 * 
 * Body: {
 *   cropType: string (required),
 *   storageType: string,
 *   division: string,
 *   district: string,
 *   riskLevel: string (required) - "Critical", "High", "Moderate", "Low",
 *   etcl: number (hours to critical loss),
 *   temperature: number,
 *   humidity: number,
 *   rainProb: number,
 *   moisture: number
 * }
 */
router.post('/', generateSmartAlert);

/**
 * POST /api/smart-alert/batch
 * Generate alerts for multiple crops at once
 * 
 * Body: {
 *   crops: Array of crop objects with riskLevel, weather data, etc.
 * }
 */
router.post('/batch', generateBatchAlerts);

/**
 * POST /api/smart-alert/sms
 * Send an emergency SMS via the configured gateway (or demo fallback).
 *
 * Body: {
 *   to: string (required) - phone number (01XXXXXXXXX or +8801XXXXXXXXX),
 *   message: string (required)
 * }
 */
router.post('/sms', sendSmsAlert);

export default router;


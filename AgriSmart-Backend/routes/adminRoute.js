import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/adminController.js";
import { getAllFarmers, getFarmerById, deleteFarmer, suspendFarmer, unsuspendFarmer } from "../controllers/adminFarmerController.js";
import { getAllCropBatches, getCropBatchesByFarmer, getCropBatchById, updateCropBatch, deleteCropBatch } from "../controllers/adminCropController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

// ==================== Admin Authentication ====================
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// ==================== Farmer Management (auth required) ====================
router.get("/farmers", isAuthenticated, getAllFarmers);
router.get("/farmers/:id", isAuthenticated, getFarmerById);
router.delete("/farmers/:id", isAuthenticated, deleteFarmer);
router.patch("/farmers/:id/suspend", isAuthenticated, suspendFarmer);
router.patch("/farmers/:id/unsuspend", isAuthenticated, unsuspendFarmer);

// ==================== Crop Batch Management (auth required) ====================
router.get("/crops", isAuthenticated, getAllCropBatches);
router.get("/crops/farmer/:farmerId", isAuthenticated, getCropBatchesByFarmer);  // Must come before :id route
router.get("/crops/:id", isAuthenticated, getCropBatchById);
router.patch("/crops/:id", isAuthenticated, updateCropBatch);
router.delete("/crops/:id", isAuthenticated, deleteCropBatch);

export default router;


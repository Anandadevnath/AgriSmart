import { Listing } from "../models/listingModel.js";
import { Farmer } from "../models/userModel.js";
import { isValidObjectId } from "mongoose";

// View all marketplace listings
export const getAllCropBatches = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("farmerId", "name email phone location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// View listings of a specific farmer
export const getCropBatchesByFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;

    if (!isValidObjectId(farmerId)) {
      return res.status(400).json({ success: false, message: "Invalid farmer ID" });
    }

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ success: false, message: "Farmer not found" });
    }

    const listings = await Listing.find({ farmerId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      farmer: { _id: farmer._id, name: farmer.name, email: farmer.email },
      count: listings.length,
      data: listings
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// View a single listing by ID
export const getCropBatchById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid listing ID" });
    }

    const listing = await Listing.findById(id).populate("farmerId", "name email phone location");
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    return res.status(200).json({ success: true, data: listing });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update listing (admin moderation)
export const updateCropBatch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid listing ID" });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    const allowed = ["cropType", "title", "quantityKg", "pricePerKg", "location", "harvestDate", "photo", "description", "status"];
    const updates = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No updatable fields provided" });
    }

    const updated = await Listing.findByIdAndUpdate(id, { $set: updates }, { new: true });
    return res.status(200).json({ success: true, message: "Listing updated successfully", data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a listing (admin moderation)
export const deleteCropBatch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid listing ID" });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    await Listing.deleteOne({ _id: id });
    return res.status(200).json({ success: true, message: "Listing deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

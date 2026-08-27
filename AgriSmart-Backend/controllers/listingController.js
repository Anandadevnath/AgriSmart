import { Listing } from "../models/listingModel.js";
import { Farmer } from "../models/userModel.js";
import { isValidObjectId } from 'mongoose';

// Public: browse marketplace listings with optional filters.
export const browseListings = async (req, res) => {
  try {
    const { cropType, division, district, q, minPrice, maxPrice, status } = req.query;

    const filter = {};
    // By default show only available listings to buyers
    filter.status = status || 'available';
    if (cropType) filter.cropType = cropType;
    if (division) filter['location.division'] = division;
    if (district) filter['location.district'] = district;
    if (minPrice || maxPrice) {
      filter.pricePerKg = {};
      if (minPrice) filter.pricePerKg.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerKg.$lte = Number(maxPrice);
    }
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { cropType: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .populate('farmerId', 'name phone location avatar preferredLanguage');

    return res.status(200).json({ success: true, data: listings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Public: single listing detail (includes farmer contact for direct connection).
export const getListing = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid listing id' });

    const listing = await Listing.findById(id)
      .populate('farmerId', 'name phone location avatar preferredLanguage');
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    return res.status(200).json({ success: true, data: listing });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Auth: listings owned by the logged-in farmer.
export const listMyListings = async (req, res) => {
  try {
    const farmerId = req.userId;
    if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const listings = await Listing.find({ farmerId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: listings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Auth: create a new marketplace listing.
export const createListing = async (req, res) => {
  try {
    const farmerId = req.userId;
    if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });

    const { cropType, title, quantityKg, pricePerKg, location, harvestDate, photo, description } = req.body;

    const listing = await Listing.create({
      farmerId,
      cropType,
      title,
      quantityKg,
      pricePerKg,
      location,
      harvestDate,
      photo,
      description,
    });

    const populated = await listing.populate('farmerId', 'name phone location avatar');
    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Auth (owner): update a listing.
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const farmerId = req.userId;
    if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid listing id' });

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    if (listing.farmerId.toString() !== farmerId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden: cannot edit another farmer's listing" });
    }

    const allowed = ['cropType', 'title', 'quantityKg', 'pricePerKg', 'location', 'harvestDate', 'photo', 'description', 'status'];
    const updates = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) updates[key] = req.body[key];
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No updatable fields provided' });
    }

    const updated = await Listing.findByIdAndUpdate(id, { $set: updates }, { new: true })
      .populate('farmerId', 'name phone location avatar');
    return res.status(200).json({ success: true, message: 'Listing updated', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Auth (owner): delete a listing.
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const farmerId = req.userId;
    if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid listing id' });

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    if (listing.farmerId.toString() !== farmerId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden: cannot delete another farmer's listing" });
    }

    await Listing.deleteOne({ _id: id });
    return res.status(200).json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

import mongoose from "mongoose";

// Crops commonly grown & traded in Bangladesh
export const CROP_TYPES = [
  // Grains & Cereals
  'Paddy', 'Rice', 'Wheat', 'Maize', 'Barley',
  // Cash Crops
  'Jute', 'Sugarcane', 'Cotton', 'Tobacco', 'Tea',
  // Vegetables
  'Potato', 'Onion', 'Garlic', 'Tomato', 'Chili', 'Brinjal', 'Cabbage',
  'Cauliflower', 'Carrot', 'Radish', 'Spinach', 'Pumpkin', 'Bottle Gourd',
  'Bitter Gourd', 'Cucumber', 'Okra', 'Beans', 'Ginger', 'Turmeric', 'Coriander',
  // Pulses
  'Lentils', 'Chickpea', 'Mung Bean', 'Black Gram', 'Peas',
  // Oilseeds
  'Mustard', 'Groundnut', 'Sesame', 'Sunflower',
  // Fruits
  'Mango', 'Banana', 'Jackfruit', 'Litchi', 'Papaya', 'Guava',
  'Watermelon', 'Pineapple', 'Coconut', 'Orange', 'Lemon',
  // Others
  'Betel Leaf', 'Betel Nut', 'Vegetables', 'Other'
];

// A marketplace listing: a farmer offering a crop for direct sale to buyers.
const listingSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  cropType: { type: String, enum: CROP_TYPES, required: true },
  title: { type: String, trim: true },
  quantityKg: { type: Number, required: true, min: 0 },
  pricePerKg: { type: Number, required: true, min: 0 }, // BDT per kg
  location: {
    division: { type: String, required: true },
    district: { type: String, required: true }
  },
  harvestDate: { type: Date },
  photo: { type: String }, // base64 data URL or image URL
  description: { type: String },
  status: {
    type: String,
    enum: ['available', 'reserved', 'sold'],
    default: 'available'
  }
}, { timestamps: true });

// Text index to support keyword search across crop/title/description
listingSchema.index({ cropType: 'text', title: 'text', description: 'text' });

export const Listing = mongoose.model('Listing', listingSchema);

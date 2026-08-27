import mongoose from "mongoose";

// A 1:1 conversation between two users (buyer & farmer), optionally about a listing.
const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true }],
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  lastMessage: { type: String, default: '' },
  lastMessageAt: { type: Date, default: Date.now },
}, { timestamps: true });

conversationSchema.index({ participants: 1, listingId: 1 });

export const Conversation = mongoose.model('Conversation', conversationSchema);

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  text: { type: String, required: true, trim: true },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' }],
}, { timestamps: true });

export const Message = mongoose.model('Message', messageSchema);

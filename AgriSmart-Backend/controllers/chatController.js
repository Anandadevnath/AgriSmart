import { Conversation, Message } from "../models/chatModel.js";
import { Farmer } from "../models/userModel.js";
import { isValidObjectId } from "mongoose";

// Find an existing 1:1 conversation between two users, or create one.
async function findOrCreateConversation(userA, userB, listingId) {
  let convo = await Conversation.findOne({
    participants: { $all: [userA, userB], $size: 2 },
    ...(listingId ? { listingId } : {}),
  });
  if (!convo) {
    convo = await Conversation.create({
      participants: [userA, userB],
      listingId: listingId || undefined,
    });
  }
  return convo;
}

// GET /chat/conversations — list my conversations with the other participant + listing.
export const getConversations = async (req, res) => {
  try {
    const me = req.userId;
    const convos = await Conversation.find({ participants: me })
      .sort({ lastMessageAt: -1 })
      .populate('participants', 'name avatar phone role')
      .populate('listingId', 'cropType title pricePerKg photo');

    // Shape each convo so the client easily sees "the other person"
    const data = convos.map((c) => {
      const other = c.participants.find((p) => p._id.toString() !== me.toString());
      return {
        _id: c._id,
        other,
        listing: c.listingId,
        lastMessage: c.lastMessage,
        lastMessageAt: c.lastMessageAt,
        updatedAt: c.updatedAt,
      };
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /chat/conversations — start (or fetch) a conversation with a recipient.
export const startConversation = async (req, res) => {
  try {
    const me = req.userId;
    const { recipientId, listingId } = req.body;

    if (!isValidObjectId(recipientId)) {
      return res.status(400).json({ success: false, message: 'Invalid recipientId' });
    }
    if (recipientId.toString() === me.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot start a conversation with yourself' });
    }
    const recipient = await Farmer.findById(recipientId);
    if (!recipient) return res.status(404).json({ success: false, message: 'Recipient not found' });

    const convo = await findOrCreateConversation(me, recipientId, listingId);
    const populated = await convo.populate([
      { path: 'participants', select: 'name avatar phone role' },
      { path: 'listingId', select: 'cropType title pricePerKg photo' },
    ]);

    const other = populated.participants.find((p) => p._id.toString() !== me.toString());
    return res.status(200).json({
      success: true,
      data: { _id: populated._id, other, listing: populated.listingId, lastMessage: populated.lastMessage, lastMessageAt: populated.lastMessageAt },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /chat/conversations/:id/messages — message history (only if I'm a participant).
export const getMessages = async (req, res) => {
  try {
    const me = req.userId;
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid conversation id' });

    const convo = await Conversation.findById(id);
    if (!convo) return res.status(404).json({ success: false, message: 'Conversation not found' });
    if (!convo.participants.some((p) => p.toString() === me.toString())) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const messages = await Message.find({ conversationId: id }).sort({ createdAt: 1 });
    // Mark unread messages (not sent by me) as read
    await Message.updateMany(
      { conversationId: id, senderId: { $ne: me }, readBy: { $ne: me } },
      { $addToSet: { readBy: me } }
    );

    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Shared helper used by both the REST endpoint and the socket handler.
export async function persistMessage({ conversationId, senderId, text }) {
  const convo = await Conversation.findById(conversationId);
  if (!convo) throw new Error('Conversation not found');
  if (!convo.participants.some((p) => p.toString() === senderId.toString())) {
    throw new Error('Forbidden');
  }

  const message = await Message.create({
    conversationId,
    senderId,
    text: text.trim(),
    readBy: [senderId],
  });

  convo.lastMessage = text.trim().slice(0, 200);
  convo.lastMessageAt = new Date();
  await convo.save();

  return { message, participants: convo.participants.map((p) => p.toString()) };
}

// POST /chat/conversations/:id/messages — REST fallback for sending a message.
export const sendMessage = async (req, res) => {
  try {
    const me = req.userId;
    const { id } = req.params;
    const { text } = req.body;
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid conversation id' });
    if (!text || !text.trim()) return res.status(400).json({ success: false, message: 'text is required' });

    const { message } = await persistMessage({ conversationId: id, senderId: me, text });
    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    const code = error.message === 'Forbidden' ? 403 : error.message === 'Conversation not found' ? 404 : 500;
    return res.status(code).json({ success: false, message: error.message });
  }
};

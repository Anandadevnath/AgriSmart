import express from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import {
  getConversations,
  startConversation,
  getMessages,
  sendMessage,
} from '../controllers/chatController.js';

const router = express.Router();

router.get('/conversations', isAuthenticated, getConversations);
router.post('/conversations', isAuthenticated, startConversation);
router.get('/conversations/:id/messages', isAuthenticated, getMessages);
router.post('/conversations/:id/messages', isAuthenticated, sendMessage);

export default router;

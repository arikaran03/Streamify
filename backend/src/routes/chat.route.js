import express from 'express'
import productRoute from '../middleware/auth.middleware.js';
import { getStreamToken } from '../controllers/chat.controller.js';

const router = express.Router();

router.get("/token", productRoute, getStreamToken); 
export default router
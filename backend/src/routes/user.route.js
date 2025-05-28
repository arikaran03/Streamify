import express from 'express';
import productRoute from '../middleware/auth.middleware.js';
import { getRecommendedUsers, getMyFriends } from '../controllers/user.controller.js';

const router = express.Router();

router.use(productRoute); 

router.get("/", getRecommendedUsers); 
router.get("/myFriends", getMyFriends);

export default router;

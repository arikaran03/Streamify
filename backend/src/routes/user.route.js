import express from 'express';
import productRoute from '../middleware/auth.middleware.js';
import { outGoingFriendRequest, getFriendRequests, acceptFriendRequest, sendFriendRequest, getRecommendedUsers, getMyFriends } from '../controllers/user.controller.js';

const router = express.Router();

router.use(productRoute); 

router.get("/", getRecommendedUsers); 
router.get("/myFriends", getMyFriends);

router.post("/friend-request/:Id", sendFriendRequest);
router.post("/friend-request/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests); 
router.get("/outgoing-friend-request", outGoingFriendRequest); 


export default router;
import express from 'express';
import { login, signup, logout, onboard } from '../controllers/auth.contoller.js';
import productRoute from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

router.post("/logout", logout);

router.post("/onboarding", productRoute, onboard);

export default router;
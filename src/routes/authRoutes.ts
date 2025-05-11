import express from 'express';
import { createAccount,logIn,getUser,logOut } from '../controllers/authController.js';
import { authenticateToken } from '../utils/validators.js';

const router = express.Router();

router.post("/sign-up",createAccount);
router.post("/log-in",logIn);
router.post("/log-out",logOut);
router.get("/get-user",authenticateToken, getUser);

export default router;
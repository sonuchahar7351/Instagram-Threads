import express from 'express'
import { signupUser,loginUser, logoutUser, followUnfollowUser, updateUserProfile, getUserProfile } from '../controllers/userController.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();


router.get('/profile/:query',getUserProfile)
router.post("/signup",signupUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put("/update/:id", protectRoute, updateUserProfile);






export default router;
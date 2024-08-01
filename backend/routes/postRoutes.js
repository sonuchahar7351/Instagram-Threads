import express from 'express';
import { createPost, deletePost, getPost, likeUnlikePost, replyToPost, getFeedPosts } from '../controllers/postControllers.js';
import protectRoute from '../middleware/protectRoute.js';


const router= express.Router();

router.get('/post/:id', getPost);
router.get('/feed' ,protectRoute, getFeedPosts)
router.post('/create', protectRoute, createPost);
router.delete('/:id',protectRoute, deletePost);
router.post('/like/:id',protectRoute, likeUnlikePost);
router.post('/reply/:id',protectRoute, replyToPost);




export default router;
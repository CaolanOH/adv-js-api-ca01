import { Router } from 'express';

import PostsController from '../controllers/posts.contoller.js'; 

const router = Router();

// GET Requests
router.get('/', PostsController.apiGetPosts);
router.get("/:id", PostsController.apiGetPostById);

// POST Requests
router.post('/', PostsController.apiCreatePost);

// PUT Requests
router.put('/:id', PostsController.apiUpdatePost);

// Delete Requests
router.delete('/:id', PostsController.apiDeletePost);

export default router;
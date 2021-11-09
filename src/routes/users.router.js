import { Router } from 'express';

import UsersController from '../controllers/users.controller.js';
//import PostsController from '../controllers/comments.controller.js';

const router = Router();

//POST Routes
router.post('/register', UsersController.register);
router.post('/login', UsersController.login);
router.post('/logout', UsersController.logout);
router.post('/make-admin', UsersController.createAdminUser);
//DELETE Routes
router.delete('/delete', UsersController.delete);

//router.put('/update-preferences', UsersController.save);
//router.get('/comment-report', PostsController.apiCommentReport);


export default router;  
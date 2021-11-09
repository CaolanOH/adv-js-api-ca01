import express from 'express';
import cors from 'cors';

import usersRouter from './routes/users.router.js';
import postsRouter from './routes/posts.router.js';
//import commentsRouter from './routes/comments.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//app.use('/Hello');

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
//app.use('/comments', commentsRouter);

export default app;
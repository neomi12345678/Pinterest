import express from 'express';
import cors from 'cors';

import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';

import boardRouters from './Routers/boardRouters.js';
import boardPinsRouters from './Routers/BoardPinsRouters.js';
import likesRouters from './Routers/likesRouters.js';
import pinsRouters from './Routers/pinsRouters.js';
import pinTagsRouters from './Routers/PinTagsRouters.js';
import userRouters from './Routers/userRouters.js';
import tagsRouters from './Routers/tagsRouters.js';

import { verifyToken } from './Middleware/auth.js';

dotenv.config();

const app = express();

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));

// Middlewares
app.use(cors());
app.use(express.json());

// ראוטים ללא verifyToken
app.use('/users', userRouters);
app.use('/likes', likesRouters);
app.use('/pins', pinsRouters);
app.use('/tags', tagsRouters);

// ראוטים עם הגנת טוקן
app.use('/boards', boardRouters);
app.use('/BoardPins', boardPinsRouters);
app.use('/pinTags', pinTagsRouters);

// מאזין
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;

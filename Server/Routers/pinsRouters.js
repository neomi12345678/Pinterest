import express from 'express';
import pinsController from '../Controller/pinsController.js';
import multer from 'multer';
import path from 'path';
import asyncHandler from 'express-async-handler'; // תתקין: npm i express-async-handler

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const pinsRouters = express.Router();


pinsRouters.get('/', pinsController.getAllPins);
pinsRouters.post('/ids', pinsController.getPinsByIds);

pinsRouters.post("/pins-by-tags", pinsController.getPinsByTags);

pinsRouters.get('/:pinId', pinsController.getPinById);
pinsRouters.get('/user/:userId', pinsController.getPinsByUserId);
pinsRouters.post('/', upload.single('image'), pinsController.addPin);
pinsRouters.put('/:pinId', pinsController.updatePin);
pinsRouters.delete('/:pinId', pinsController.deletePin);

export default pinsRouters;

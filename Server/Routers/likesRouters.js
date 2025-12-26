import express from 'express';
import likesController from '../Controller/likesController.js';

const likesRouters = express.Router();

likesRouters.post('/', likesController.addLike); // הוספת לייק
likesRouters.delete('/:user_id/:pin_id', likesController.removeLike); // הסרת לייק לפי user ו-pin
likesRouters.get('/count/:pin_id', likesController.getLikesCount);

export default likesRouters;

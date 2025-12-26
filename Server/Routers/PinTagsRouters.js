import express from 'express';
import pinTagsController from '../Controller/PinTagsController.js';

const pinTagsRouters = express.Router();

// 📥 מביא את כל הקשרים בין פין לתג
pinTagsRouters.get('/', pinTagsController.getAllPinTags);

// ➕ מוסיף קשר בין פין לתג
pinTagsRouters.post('/', pinTagsController.addPinTag);

// ❌ מוחק קשר בין פין לתג
pinTagsRouters.delete('/:pinId/:tagId', pinTagsController.deletePinTag);
pinTagsRouters.post('/bulk', pinTagsController.addMultiplePinTags);

export default pinTagsRouters;

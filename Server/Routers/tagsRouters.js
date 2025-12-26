import express from 'express';
import tagsController from '../Controller/tagsController.js';

const tagsRouters = express.Router();

tagsRouters.get('/', tagsController.getAllTags);            // GET /tags
tagsRouters.get('/:tagId', tagsController.getTagById);      // GET /tags/123
tagsRouters.post('/', tagsController.addTag);               // POST /tags
tagsRouters.put('/:tagId', tagsController.updateTag);       // PUT /tags/123
tagsRouters.delete('/:tagId', tagsController.deleteTag);    // DELETE /tags/123

export default tagsRouters;




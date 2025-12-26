import tagModel from '../Models/tagModel.js';

const tagsController = {
 // Controller - קבל limit ו-offset מה-query
getAllTags: async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;  // ברירת מחדל 20
    const offset = parseInt(req.query.offset) || 0;

    const tags = await tagModel.getAllTags(limit, offset);
    if (!tags || tags.length === 0) return res.status(404).json({ error: "No tags found" });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
},

  getTagById: async (req, res) => {
    try {
      const { tagId } = req.params;
      const tag = await tagModel.getTagById(tagId);
      if (!tag) return res.status(404).json({ error: "Tag not found" });
      res.json(tag);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },

  addTag: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: "Name is required" });

      const result = await tagModel.addTag({ name });
      res.status(201).json({ message: "Tag added successfully", id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: "Error adding the tag" });
    }
  },

  deleteTag: async (req, res) => {
    try {
      const { tagId } = req.params;
      const existingTag = await tagModel.getTagById(tagId);
      if (!existingTag) return res.status(404).json({ error: "Tag not found" });

      await tagModel.deleteTag(tagId);
      res.json({ message: "Tag deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete tag" });
    }
  },

  updateTag: async (req, res) => {
    try {
      const { tagId } = req.params;
      const updateFields = req.body;

      const existingTag = await tagModel.getTagById(tagId);
      if (!existingTag) return res.status(404).json({ error: "Tag not found" });

      const filteredFields = Object.fromEntries(
        Object.entries(updateFields).filter(([_, value]) => value !== undefined)
      );

      if (Object.keys(filteredFields).length === 0) {
        return res.status(400).json({ error: "No fields provided to update" });
      }

      await tagModel.updateTag(tagId, filteredFields);
      res.json({ message: "Tag updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update tag" });
    }
  }
};

export default tagsController;

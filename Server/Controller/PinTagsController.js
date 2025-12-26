import pinTagModel from '../Models/PinTagsModel.js';

const pinTagsController = {

  addMultiplePinTags: async (req, res) => {
    try {
      const { pin_id, tags } = req.body;
      if (!pin_id || !Array.isArray(tags) || tags.length === 0) {
        return res.status(400).json({ error: "pin_id ו־tags חובה לספק" });
      }

      await pinTagModel.addMultiplePinTags(pin_id, tags);
      res.status(201).json({ message: "כל הטאגים נוספו בהצלחה" });
    } catch (err) {
      res.status(500).json({ error: "שגיאה בהוספת הטאגים לפין" });
    }
  },

  getAllPinTags: async (req, res) => {
    try {
      const pinTags = await pinTagModel.getAllPinTags();
      if (!pinTags || pinTags.length === 0) return res.status(404).json({ error: "No Pin-Tag relations found" });
      res.json(pinTags);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },

  addPinTag: async (req, res) => {
    try {
      const { pin_id, tag_id } = req.body;
      if (!pin_id || !tag_id) {
        return res.status(400).json({ error: "pinId and tagId are required" });
      }

      const result = await pinTagModel.addPinTag({ pin_id, tag_id });
      res.status(201).json({ message: "Pin-Tag relation added successfully", id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: "Error adding the pin-tag relation" });
    }
  },

  deletePinTag: async (req, res) => {
    try {
      const { pin_id, tag_id } = req.params;
      await pinTagModel.deletePinTag(pin_id, tag_id);
      res.json({ message: "Pin-Tag relation deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete pin-tag relation" });
    }
  }
};

export default pinTagsController;

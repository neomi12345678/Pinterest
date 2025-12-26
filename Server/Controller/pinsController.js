import pinModel from '../Models/pinModel.js';

const pinsController = {
// Controller - קבל פרמטרים מה-query ושגר ל-model
getAllPins: async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;  // ברירת מחדל 20
    const offset = parseInt(req.query.offset) || 0; // התחלה מאפס

    const pins = await pinModel.getAllPins(limit, offset);
    if (!pins || pins.length === 0) return res.status(404).json({ error: "No pins found" });
    res.json(pins);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
}
,
  getPinsByIds: async (req, res) => {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "IDs array is required" });
      }
      const pins = await pinModel.getPinsByIds(ids);
      res.json(pins);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },

  getPinById: async (req, res) => {
    try {
      const { pinId } = req.params;
      const pin = await pinModel.getPinById(pinId);
      if (!pin) return res.status(404).json({ error: "Pin not found" });
      res.json(pin);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },

  getPinsByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      const pins = await pinModel.getPinsByUserId(userId);
      if (!pins || pins.length === 0) return res.status(404).json({ error: "No pins found for this user" });
      res.json(pins);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },

  addPin: async (req, res) => {
    try {
      const { title, description, user_id } = req.body;
      const imageFile = req.file;

      if (!title || !imageFile || !user_id) {
        console.log('Missing data:', { title, imageFile, user_id });
        return res.status(400).json({ error: "Title, Image and User ID are required" });
      }

      const image_url = `uploads/${imageFile.filename}`;//קריאה למולטר
      const pinToSave = {
        title,
        image_url,
        description,
        user_id,
        pin_status: 1 // ברירת מחדל לפין חדש
      };

      const result = await pinModel.addPin(pinToSave);
      res.status(201).json({ message: "Pin added successfully", id: result.insertId });
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: "Error adding the pin" });
    }
  },

  deletePin: async (req, res) => {
    try {
      const { pinId } = req.params;
      const existingPin = await pinModel.getPinById(pinId);
      if (!existingPin) return res.status(404).json({ error: "Pin not found" });

      await pinModel.deletePin(pinId);
      res.json({ message: "Pin deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete pin" });
    }
  },

  getPinsByTags: async (req, res) => {
  try {
    const { tags, limit = 20, offset = 0 } = req.body;

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ error: "Tags array is required" });
    }

    const pins = await pinModel.getPinsByTags(tags, limit, offset);
    res.json(pins);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
},


  updatePin: async (req, res) => {
    try {
      const { pinId } = req.params;
      const updateFields = req.body;

      const existingPin = await pinModel.getPinById(pinId);
      if (!existingPin) return res.status(404).json({ error: "Pin not found" });

      const filteredFields = Object.fromEntries(
        Object.entries(updateFields).filter(([_, value]) => value !== undefined)
      );

      if (Object.keys(filteredFields).length === 0) {
        return res.status(400).json({ error: "No fields provided to update" });
      }

      await pinModel.updatePin(pinId, filteredFields);
      res.json({ message: "Pin updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update pin" });
    }
  }
};

export default pinsController;

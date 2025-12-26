import likesModel from '../Models/likesModel.js';

const likesController = {
  addLike: async (req, res) => {
    try {
      const { user_id, pin_id } = req.body;

      if (!user_id || !pin_id) {
        return res.status(400).json({ error: "Both user_id and pin_id are required" });
      }

      await likesModel.addLike({ user_id, pin_id });
      res.status(201).json({ message: "Like added successfully" });

    } catch (err) {
      console.error("Error adding the like to the database:", err);
      res.status(500).json({ error: "Error adding the like" });
    }
  },

  getLikesCount: async (req, res) => {
    try {
      const { pin_id } = req.params;
      if (!pin_id) return res.status(400).json({ error: "pin_id required" });

      const results = await likesModel.getLikesCount(pin_id);
      const count = results[0]?.likeCount || 0;
      res.json({ pin_id, likeCount: count });

    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  },

  removeLike: async (req, res) => {
    try {
      const { user_id, pin_id } = req.params;

      if (!user_id || !pin_id) {
        return res.status(400).json({ error: "Both user_id and pin_id are required" });
      }

      await likesModel.removeLike(user_id, pin_id);
      res.json({ message: "Like removed successfully" });

    } catch (err) {
      res.status(500).json({ error: "Failed to remove like" });
    }
  },
};

export default likesController;

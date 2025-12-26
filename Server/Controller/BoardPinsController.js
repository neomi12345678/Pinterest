import boardPinModel from '../Models/boardPinModel.js';

const boardPinsController = {
  getAllBoardPins: async (req, res) => {
    try {
      const results = await boardPinModel.getAllBoardPins();
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },

  addBoardPin: async (req, res) => {
    try {
      const { board_id, pin_id } = req.body;
      const boardPinToSave = { boardId: board_id, pinId: pin_id };
      const result = await boardPinModel.addBoardPin(boardPinToSave);
      res.status(201).json({ message: "Board-Pin relation added successfully", id: result.insertId });
    } catch (err) {
      console.error("🔴 שגיאה בהוספת קשר בין לוח לפין:", err);
      res.status(500).json({ error: "Error adding the board pin" });
    }
  },

  deleteBoardPin: async (req, res) => {
    try {
      const { boardId, pinId } = req.params;
      await boardPinModel.deleteBoardPin(boardId, pinId);
      res.json({ message: "Board-Pin relation deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete board-pin relation" });
    }
  }
};

export default boardPinsController;

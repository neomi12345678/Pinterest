import boardModel from '../Models/boardModel.js';

const boardsController = {
  getBoardByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      const board = await boardModel.getBoardByUserId(userId);
      if (!board) return res.status(404).json({ error: "Board not found" });
      res.json(board);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },

  addBoardByUserId: async (req, res) => {
    try {
      const { name, description } = req.body;
      const userId = req.params.userId;

      if (!name) {
        return res.status(400).json({ error: "name is required" });
      }

      const boardToSave = { name, description, user_id: userId };
      const result = await boardModel.addBoard(boardToSave);
      res.status(201).json({ message: "Board added successfully", id: result.insertId });

    } catch (err) {
      res.status(500).json({ error: "Error adding the board" });
    }
  },

  deleteBoardByUserId: async (req, res) => {
    try {
      const { boardId, userId } = req.params;
      const existingBoard = await boardModel.getBoardById(boardId);

      if (!existingBoard) return res.status(404).json({ error: "Board not found" });
      if (parseInt(existingBoard.user_id) !== parseInt(userId))
        return res.status(403).json({ error: "Unauthorized" });

      await boardModel.deleteBoard(boardId);
      res.json({ message: "Board deleted successfully" });

    } catch (err) {
      res.status(500).json({ error: "Failed to delete board" });
    }
  },

  updateBoardByUserId: async (req, res) => {
    try {
      const { boardId, userId } = req.params;
      const updateFields = req.body;
      const existingBoard = await boardModel.getBoardById(boardId);

      if (!existingBoard) return res.status(404).json({ error: "Board not found" });
      if (parseInt(existingBoard.user_id) !== parseInt(userId))
        return res.status(403).json({ error: "Unauthorized" });

      const filteredFields = Object.fromEntries(
        Object.entries(updateFields).filter(([_, value]) => value !== undefined)
      );

      if (Object.keys(filteredFields).length === 0) {
        return res.status(400).json({ error: "No fields provided to update" });
      }

      await boardModel.updateBoard(boardId, filteredFields);
      res.json({ message: "Board updated successfully" });

    } catch (err) {
      res.status(500).json({ error: "Failed to update board" });
    }
  }
};

export default boardsController;

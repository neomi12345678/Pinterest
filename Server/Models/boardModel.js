import db from "../DB/db.js";

const boardModel = {
  getBoardByUserId: async (userId) => {
    const sql = `SELECT * FROM Boards WHERE user_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getBoardById: async (boardId) => {
    const sql = `SELECT * FROM Boards WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [boardId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  addBoard: async (boardData) => {
    const sql = `INSERT INTO Boards (name, description, user_id) VALUES (?, ?, ?)`;
    return new Promise((resolve, reject) => {
      db.query(sql, [boardData.name, boardData.description, boardData.user_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  deleteBoard: async (boardId) => {
    const sql = `UPDATE Boards SET us_status = false WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [boardId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  updateBoard: async (boardId, updateFields) => {
    const sql = `UPDATE Boards SET ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [updateFields, boardId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
};

export default boardModel;

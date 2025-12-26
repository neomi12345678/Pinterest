import db from "../DB/db.js";

const boardPinModel = {
  addBoardPin: ({ boardId, pinId }) => {
    const sql = 'INSERT INTO BoardPins (board_id, pin_id) VALUES (?, ?)';
    return new Promise((resolve, reject) => {
      db.query(sql, [boardId, pinId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  deleteBoardPin: (boardId, pinId) => {
    const sql = 'DELETE FROM BoardPins WHERE board_id = ? AND pin_id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [boardId, pinId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  getAllBoardPins: () => {
    const sql = 'SELECT * FROM BoardPins';
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }
};

export default boardPinModel;

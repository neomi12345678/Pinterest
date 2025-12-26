import db from "../DB/db.js";

const likesModel = {
  getLikesCount: (pin_id) => {
    const sql = `SELECT COUNT(*) AS likeCount FROM Likes WHERE pin_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [pin_id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  addLike: ({ user_id, pin_id }) => {
    const sql = `INSERT IGNORE INTO Likes (user_id, pin_id) VALUES (?, ?)`;
    return new Promise((resolve, reject) => {
      db.query(sql, [user_id, pin_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  removeLike: (user_id, pin_id) => {
    const sql = `DELETE FROM Likes WHERE user_id = ? AND pin_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [user_id, pin_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },
};

export default likesModel;

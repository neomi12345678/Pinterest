import db from "../DB/db.js";

const pinTagModel = {

  addMultiplePinTags: (pin_id, tags) => {
    if (!tags || tags.length === 0) return Promise.resolve([]);
    const values = tags.map(tag_id => [pin_id, tag_id]);
    const sql = 'INSERT INTO PinTags (pin_id, tag_id) VALUES ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [values], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  getAllPinTags: () => {
    const sql = 'SELECT * FROM PinTags';
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  addPinTag: ({ pin_id, tag_id }) => {
    const sql = 'INSERT INTO PinTags (pin_id, tag_id) VALUES (?, ?)';
    return new Promise((resolve, reject) => {
      db.query(sql, [pin_id, tag_id], (err, result) => {
        if (err) {
          console.error("❌ SQL ERROR:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  deletePinTag: (pin_id, tag_id) => {
    const sql = 'DELETE FROM PinTags WHERE pin_id = ? AND tag_id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [pin_id, tag_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
};

export default pinTagModel;

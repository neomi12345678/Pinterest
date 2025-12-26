import db from "../DB/db.js";

const tagModel = {
  // Model - הוסף limit ו-offset לשאילתה
getAllTags: (limit, offset) => {
  const sql = 'SELECT * FROM Tags LIMIT ? OFFSET ?';// הגבלת התוצאות עם limit ו-offset
  return new Promise((resolve, reject) => {
    db.query(sql, [limit, offset], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
},

  getTagById: (tagId) => {
    const sql = 'SELECT * FROM Tags WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [tagId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  addTag: (tagData) => {
    const sql = 'INSERT INTO Tags (name) VALUES (?)';
    return new Promise((resolve, reject) => {
      db.query(sql, [tagData.name], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  deleteTag: (tagId) => {
    const sql = 'DELETE FROM Tags WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [tagId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  updateTag: (tagId, updateFields) => {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updateFields)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) return Promise.resolve();

    const sql = `UPDATE Tags SET ${fields.join(', ')} WHERE id = ?`;
    values.push(tagId);

    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
};

export default tagModel;

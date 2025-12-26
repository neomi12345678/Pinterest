import db from "../DB/db.js";

const pinModel = {
  getPinsByTags: (tagNames, limit = 20, offset = 0) => {
  if (!Array.isArray(tagNames) || tagNames.length === 0) {
    return Promise.resolve([]);
  }

  const whereConditions = tagNames.map(() => `tags.name LIKE ?`).join(" OR ");
  const sql = `
    SELECT DISTINCT pins.*
    FROM pins
    JOIN PinTags ON pins.id = PinTags.pin_id
    JOIN tags ON tags.id = PinTags.tag_id
    WHERE (${whereConditions}) AND (pin_status IS NULL OR pin_status = true)
    LIMIT ? OFFSET ?
  `;

  const likeValues = tagNames.map(name => `%${name}%`);

  // מוסיפים את הערכים של limit ו-offset לסוף
  const params = [...likeValues, limit, offset];

  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        console.log("🔴 Error fetching pins by tags:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
},

// Model - הוסף limit ו-offset לשאילתה
getAllPins: (limit, offset) => {
  const sql = "SELECT * FROM pins WHERE (pin_status IS NULL OR pin_status = true) LIMIT ? OFFSET ?";
  return new Promise((resolve, reject) => {
    db.query(sql, [limit, offset], (err, results) => {
      if (err) {
        console.log("🔴 Database error:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}
,

  getPinById: (pinId) => {
    const sql = "SELECT * FROM pins WHERE id = ? AND (pin_status IS NULL OR pin_status = true)";
    return new Promise((resolve, reject) => {
      db.query(sql, [pinId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  getPinsByUserId: (userId) => {
    const sql = "SELECT * FROM pins WHERE user_id = ? AND (pin_status IS NULL OR pin_status = true)";
    return new Promise((resolve, reject) => {
      db.query(sql, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getPinsByIds: (ids) => {
    const placeholders = ids.map(() => "?").join(", ");
    const sql = `SELECT * FROM pins WHERE id IN (${placeholders}) AND (pin_status IS NULL OR pin_status = true)`;
    return new Promise((resolve, reject) => {
      db.query(sql, ids, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  addPin: (pinToSave) => {
    const sql = "INSERT INTO pins (title, image_url, description, user_id, pin_status) VALUES (?, ?, ?, ?, ?)";
    const params = [
      pinToSave.title,
      pinToSave.image_url,
      pinToSave.description || null,
      pinToSave.user_id,
      pinToSave.pin_status
    ];

    return new Promise((resolve, reject) => {
      db.query(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  deletePin: (pinId) => {
    const sql = "UPDATE pins SET pin_status = false WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.query(sql, [pinId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  updatePin: (pinId, updateFields) => {
    const fields = Object.keys(updateFields)
      .map(key => `${key} = ?`)
      .join(", ");
    const values = Object.values(updateFields);
    values.push(pinId);

    const sql = `UPDATE pins SET ${fields} WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, values, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};

export default pinModel;

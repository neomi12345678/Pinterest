import db from "../DB/db.js";

const userModel = {
  getAllUsers: (limit = 20, offset = 0) => {
  const sql = 'SELECT * FROM users LIMIT ? OFFSET ?';
  return new Promise((resolve, reject) => {
    db.query(sql, [limit, offset], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
},


  getUserById: (userId) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  login: (email) => {
    const sql = 'SELECT * FROM users WHERE email = ? AND us_status != 0';
    return new Promise((resolve, reject) => {
      db.query(sql, [email], (err, results) => {
        if (err) reject(err);
        else resolve(results.length === 0 ? null : results[0]);
      });
    });
  },

  Register: (user) => {
    const sql = 'INSERT INTO users (name, email, password_hash, us_status) VALUES (?, ?, ?, ?)';
    const { name, email, password_hash, us_status } = user;
    return new Promise((resolve, reject) => {
      db.query(sql, [name, email, password_hash, us_status], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  deleteUser: (userId) => {
    const sql = 'UPDATE users SET us_status = false WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [userId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

getUserByEmail: (email) => {
  const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  return new Promise((resolve, reject) => {
    db.query(sql, [email], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
  });
}
,
  updateUser: (userId, updateFields) => {
    const fields = Object.keys(updateFields);
    const values = Object.values(updateFields);

    if (fields.length === 0) return Promise.resolve();

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const sql = `UPDATE users SET ${setClause} WHERE id = ?`;

    return new Promise((resolve, reject) => {
      db.query(sql, [...values, userId], (err, result) => {
        if (err) reject(err);
        else if (result.affectedRows === 0) reject(new Error("No rows updated"));
        else resolve(result);
      });
    });
  }
  
};

export default userModel;

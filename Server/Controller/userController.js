import userModel from '../Models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET;

const usersController = {
  getAllUsers: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;
      const users = await userModel.getAllUsers(limit, offset);
      if (!users || users.length === 0) return res.status(404).json({ error: "No users found" });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },

  getUserById: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await userModel.getUserById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },

  Register: async (req, res) => {
    try {
      const { name, email, password_hash } = req.body;

      if (!name || !email || !password_hash) {
        return res.status(400).json({ error: "All required fields must be filled" });
      }

      const hashedPassword = await bcrypt.hash(password_hash, 10);

      const userToSave = {
        name,
        email,
        password_hash: hashedPassword,
        us_status: 1
      };

      const result = await userModel.Register(userToSave);
      const newUser = await userModel.getUserById(result.insertId);

      if (!newUser) {
        return res.status(201).json({ message: "User added", id: result.insertId });
      }

      res.status(201).json({
        message: "User added successfully",
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.created_at,
        us_status: newUser.us_status
      });
    } catch (err) {
      res.status(500).json({ error: "Error adding the user" });
    }
  },

 login: async (req, res) => {
  const { email, password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: 'סיסמה נדרשת' });
  }

  // התחברות מנהל — רק אם לא נשלח אימייל בכלל
  if (!email && password === process.env.PASSWORD_MANAGER) {
    const token = jwt.sign({ role: 'admin', email: 'admin' }, secretKey, { expiresIn: '1h' });// יצירת טוקן למנהל
    return res.json({ success: true, token, userId: 0, name: 'Admin' });
  }

  // משתמש רגיל חייב לשלוח אימייל
  if (!email) {
    return res.status(400).json({ success: false, message: 'אימייל נדרש למשתמש רגיל' });
  }

  try {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'אימייל או סיסמה שגויים' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);// השוואת סיסמה עם הסיסמה המאוחסנת
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'אימייל או סיסמה שגויים' });
    }

    const token = jwt.sign(// יצירת טוקן JWT
      { role: 'user', userId: user.id, email: user.email },
      secretKey,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      token,
      userId: user.id,
      name: user.name,
      email: user.email,
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
,

  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const existingUser = await userModel.getUserById(userId);
      if (!existingUser) return res.status(404).json({ error: "User not found" });

      await userModel.deleteUser(userId);
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const updateFields = req.body;

      const existingUser = await userModel.getUserById(userId);
      if (!existingUser) return res.status(404).json({ error: "User not found" });

      const filteredFields = Object.fromEntries(
        Object.entries(updateFields).filter(([_, value]) => value !== undefined)
      );

      if (Object.keys(filteredFields).length === 0) {
        return res.status(400).json({ error: "No fields provided to update" });
      }

      await userModel.updateUser(userId, filteredFields);
      res.json({ message: "User updated successfully" });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "האימייל כבר תפוס על ידי משתמש אחר" });
      }
      res.status(500).json({ error: "Error updating user: " + err.message });
    }
  }
};

export default usersController;

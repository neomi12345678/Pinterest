import express from 'express';
import usersController from '../Controller/userController.js';
import { verifyToken, isAdmin } from '../Middleware/auth.js';

const userRouters = express.Router();

userRouters.post('/login', usersController.login);
userRouters.post('/', usersController.Register);

userRouters.get('/',usersController.getAllUsers);
userRouters.get('/:userId', verifyToken, usersController.getUserById);
userRouters.put('/:userId', verifyToken, usersController.updateUser);
userRouters.delete('/:userId', verifyToken, isAdmin, usersController.deleteUser);

export default userRouters;

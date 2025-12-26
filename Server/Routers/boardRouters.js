import express from "express";
import boardsController from "../Controller/boardController.js";

const boardRouters = express.Router();

// קבלת לוחות לפי userId
boardRouters.get("/user/:userId", boardsController.getBoardByUserId);

// הוספת לוח למשתמש
boardRouters.post("/user/:userId", boardsController.addBoardByUserId);

// מחיקת לוח של משתמש לפי boardId
boardRouters.delete("/:boardId/user/:userId", boardsController.deleteBoardByUserId);

// עדכון לוח של משתמש
boardRouters.put("/:boardId/user/:userId", boardsController.updateBoardByUserId);

export default boardRouters;

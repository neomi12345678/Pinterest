import express from "express";
import boardPinsController from "../Controller/BoardPinsController.js";

const boardPinsRouters = express.Router();

boardPinsRouters.get("/getAllBoardPins", boardPinsController.getAllBoardPins); // המכה את כל הקשרים בין לוחות ל-pins
boardPinsRouters.post("/addBoardPin", boardPinsController.addBoardPin); // המוסיף קשר בין לוח ל-pin
boardPinsRouters.delete("/deleteBoardPin/:boardId/:pinId", boardPinsController.deleteBoardPin); // המוחק קשר בין לוח ל-pin

export default boardPinsRouters;

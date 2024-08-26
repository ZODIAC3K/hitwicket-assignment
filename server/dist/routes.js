"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
const rooms = {}; // { roomId: [[playerType, playerName], ...] }
// Handle creating a game
router.post("/api/create-game", (req, res) => {
    const { playerName } = req.body;
    console.log(req.body);
    if (!playerName) {
        return res.status(400).json({ error: "Player name is required." });
    }
    const roomId = (0, uuid_1.v4)();
    rooms[roomId] = [["p1", playerName]]; // Add player 1 (creator)
    console.log("Current ROOM (Routes):", rooms); // Log the state of rooms
    res.status(200).json({
        roomId,
        playerType: "p1",
        playerName: playerName,
    });
});
// Handle joining a game
router.post("/api/join-game", (req, res) => {
    const { roomId, playerName } = req.body;
    console.log(req.body);
    if (!roomId || !playerName || !rooms[roomId]) {
        return res
            .status(400)
            .json({ error: "Invalid Room ID or Player Name." });
    }
    if (rooms[roomId].length >= 2) {
        return res.status(400).json({ error: "Room is full." });
    }
    rooms[roomId].push(["p2", playerName]); // Add player 2
    console.log("Current ROOM (Routes):", rooms); // Log the state of rooms
    res.status(200).json({ roomId, playerType: "p2", playerName: playerName });
});
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
const rooms = {}; // { roomId: [player1, player2] }
// Handle creating a game
router.post("/api/create-game", (req, res) => {
    const roomId = (0, uuid_1.v4)();
    rooms[roomId] = [];
    rooms[roomId].push("p1"); // Add player 1 (creator)
    res.status(200).json({ roomId, playerType: "p1" });
});
// Handle joining a game
router.post("/api/join-game", (req, res) => {
    const { roomId } = req.body;
    if (!roomId || !rooms[roomId]) {
        return res.status(400).json({ error: "Invalid Room ID." });
    }
    if (rooms[roomId].length >= 2) {
        return res.status(400).json({ error: "Room is full." });
    }
    rooms[roomId].push("p2"); // Add player 2
    res.status(200).json({ roomId, playerType: "p2" });
});
exports.default = router;

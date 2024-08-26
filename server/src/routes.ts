import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const rooms: { [key: string]: string[] } = {}; // { roomId: [player1, player2] }

// Handle creating a game
router.post("/api/create-game", (req: Request, res: Response) => {
	const roomId = uuidv4();
	rooms[roomId] = [];
	rooms[roomId].push("p1"); // Add player 1 (creator)
	res.status(200).json({ roomId, playerType: "p1" });
});

// Handle joining a game
router.post("/api/join-game", (req: Request, res: Response) => {
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

export default router;

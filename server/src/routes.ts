import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const rooms: { [key: string]: [string, string][] } = {}; // { roomId: [[playerType, playerName], ...] }

// Handle creating a game
router.post("/api/create-game", (req: Request, res: Response) => {
	const { playerName } = req.body;
	console.log(req.body);

	if (!playerName) {
		return res.status(400).json({ error: "Player name is required." });
	}

	const roomId = uuidv4();
	rooms[roomId] = [["p1", playerName]]; // Add player 1 (creator)
	console.log("Current ROOM (Routes):", rooms); // Log the state of rooms
	res.status(200).json({
		roomId,
		playerType: "p1",
		playerName: playerName,
	});
});

// Handle joining a game
router.post("/api/join-game", (req: Request, res: Response) => {
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

export default router;

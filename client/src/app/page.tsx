"use client"; // Ensure this is present for client-side rendering

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const HomePage: React.FC = () => {
	const [roomId, setRoomId] = useState<string>("");
	const [playerName, setPlayerName] = useState<string>("");
	const [mode, setMode] = useState<"create" | "join" | null>(null);
	const router = useRouter();

	const createGame = async () => {
		try {
			const response = await fetch(
				"http://localhost:4000/api/create-game",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ playerName }),
				}
			);
			if (!response.ok) throw new Error("Failed to create game");

			const data = await response.json();
			const { roomId } = data;

			if (roomId) {
				router.push(`/game/${roomId}`);
			} else {
				throw new Error("Room ID not found in response");
			}
		} catch (error) {
			console.error(error);
			alert("Failed to create game.");
		}
	};

	const joinGame = async () => {
		if (!roomId || !playerName) return;

		try {
			const response = await fetch(
				"http://localhost:4000/api/join-game",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						roomId,
						playerName,
						socketId: "someSocketId",
					}), // Replace "someSocketId" with the actual socket ID
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to join game.");
			}

			const data = await response.json();
			const { roomId: responseRoomId } = data;

			if (responseRoomId) {
				router.push(`/game/${responseRoomId}`);
			} else {
				throw new Error("Room ID not found in response");
			}
		} catch (error: any) {
			console.error(error);
			alert(error.message);
		}
	};

	return (
		<div className="bg-black min-h-screen text-white flex flex-col items-center justify-center">
			<h1 className="text-4xl mb-8">HWicket Choice!</h1>
			{mode === null ? (
				<div>
					<button
						className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
						onClick={() => setMode("create")}
					>
						Create Game
					</button>
					<button
						className="bg-green-500 text-white px-4 py-2 rounded"
						onClick={() => setMode("join")}
					>
						Join Game
					</button>
				</div>
			) : mode === "create" ? (
				<div className="flex flex-col items-center">
					<h2 className="text-2xl mb-4">Create a New Game</h2>
					<input
						type="text"
						value={playerName}
						onChange={(e) => setPlayerName(e.target.value)}
						placeholder="Enter your name"
						className="mb-4 px-4 py-2 rounded border border-gray-600 text-black"
					/>
					<button
						className="bg-blue-500 text-white px-4 py-2 rounded"
						onClick={createGame}
					>
						Submit
					</button>
				</div>
			) : (
				<div className="flex flex-col items-center">
					<h2 className="text-2xl mb-4">Join an Existing Game</h2>
					<input
						type="text"
						value={playerName}
						onChange={(e) => setPlayerName(e.target.value)}
						placeholder="Enter your name"
						className="mb-4 px-4 py-2 rounded border border-gray-600 text-black"
					/>
					<input
						type="text"
						value={roomId}
						onChange={(e) => setRoomId(e.target.value)}
						placeholder="Enter Room ID"
						className="mb-4 px-4 py-2 rounded border border-gray-600 text-black"
					/>
					<button
						className="bg-green-500 text-white px-4 py-2 rounded"
						onClick={joinGame}
					>
						Submit
					</button>
				</div>
			)}
		</div>
	);
};

export default HomePage;

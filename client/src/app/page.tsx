"use client"; // Ensure this is present for client-side rendering

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { error } from "console";

const HomePage: React.FC = () => {
	const [roomId, setRoomId] = useState<string>("");
	const router = useRouter();

	const createGame = async () => {
		try {
			const response = await fetch(
				"http://localhost:4000/api/create-game",
				{
					method: "POST",
				}
			);
			if (!response.ok) throw new Error("Failed to create game");

			const data = await response.json(); // Ensure you're properly handling the response
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
		if (!roomId) return;

		try {
			const response: Response = await fetch(
				"http://localhost:4000/api/join-game",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ roomId }),
				}
			);

			if (!response.ok) {
				const errorData = await response.json(); // Extract the error message
				throw new Error(errorData.error || "Failed to join game.");
			}

			const data = await response.json();
			console.log("Response Data:", data);
			const { roomId: responseRoomId } = data;

			if (responseRoomId) {
				router.push(`/game/${responseRoomId}`);
			} else {
				throw new Error("Room ID not found in response");
			}
		} catch (error: any) {
			console.error(error);
			alert(error.message); // Display the actual error message
		}
	};

	return (
		<div>
			<h1>Welcome to the Game</h1>
			<button onClick={createGame}>Create Game</button>
			<div>
				<h2>Join Game</h2>
				<input
					type="text"
					value={roomId}
					onChange={(e) => setRoomId(e.target.value)}
					placeholder="Enter Room ID"
				/>
				<button onClick={joinGame}>Join</button>
			</div>
		</div>
	);
};

export default HomePage;

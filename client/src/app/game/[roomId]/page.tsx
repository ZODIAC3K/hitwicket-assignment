"use client"; // Ensure this is present for client-side rendering

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Correct import for useParams
import { io, Socket } from "socket.io-client";

const GamePage: React.FC = () => {
	const { roomId } = useParams(); // Use useParams to get roomId from URL
	const [socket, setSocket] = useState<Socket | null>(null);
	const [playerType, setPlayerType] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		if (typeof roomId === "string") {
			const newSocket = io("http://localhost:4000", {
				query: { roomId }, // Pass roomId and playerName
			});

			newSocket.on("connect", () => {
				console.log("Connected to the room:", roomId);

				setSocket(newSocket);

				// Emit event to inform the server of player joining
				newSocket.emit("joinRoom", { roomId });

				// Listen for player type assignment
				newSocket.on("playerType", (type: string) => {
					setPlayerType(type);
					console.log("Player type:", type);
					setLoading(false); // Stop loading once playerType is set
				});
			});

			newSocket.on("disconnect", () => {
				console.log("Disconnected from room");
			});

			newSocket.on("error", (error: string) => {
				console.error("Socket error:", error);
				setLoading(false); // Stop loading if there's an error
			});

			return () => {
				newSocket.disconnect();
			};
		}
	}, [roomId]); // Trigger useEffect when roomId changes

	return (
		<div>
			{loading ? (
				<p>Loading...</p> // Display a loading state while roomId is being fetched
			) : (
				<>
					<h1>Game Room: {roomId}</h1>
					<p>You are {playerType}</p>
					{/* Add game logic and Socket.IO interactions here */}
				</>
			)}
		</div>
	);
};

export default GamePage;

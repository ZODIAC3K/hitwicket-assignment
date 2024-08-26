"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Specify the frontend origin
        methods: ["GET", "POST"],
    },
});
app.use((0, cors_1.default)({
    origin: "*", // Allow requests from this origin
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(routes_1.default);
app.get("/", (req, res) => {
    res.send("Hello from Express server!");
});
const rooms = {};
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("joinRoom", ({ roomId }) => {
        // Log the current state of rooms
        console.log("Current rooms state:", rooms);
        if (rooms[roomId]) {
            // Check if the room exists
            if (rooms[roomId].length < 2) {
                // Check if the room is full
                rooms[roomId].push(socket.id); // Add the player to the room
                const playerType = rooms[roomId].length === 1 ? "p1" : "p2"; // Assign player type
                socket.join(roomId); // Join the socket to the room
                socket.emit("playerType", playerType); // Emit player type to the client
                console.log(`Socket ${socket.id} joined room ${roomId} as ${playerType}`);
            }
            else {
                socket.emit("error", "Room is full.");
                console.log(`Failed to join room ${roomId}: Room is full.`);
            }
        }
        else {
            // Create a new room if it doesn't exist
            rooms[roomId] = [socket.id];
            socket.join(roomId); // Join the socket to the room
            const playerType = "p1"; // First player in a new room
            socket.emit("playerType", playerType);
            console.log(`Socket ${socket.id} created and joined new room ${roomId} as ${playerType}`);
        }
        // Log the updated state of rooms
        console.log("Updated rooms state:", rooms);
    });
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        // Clean up room state when a user disconnects
        for (const roomId in rooms) {
            rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
            if (rooms[roomId].length === 0) {
                delete rooms[roomId]; // Remove empty rooms
            }
        }
    });
});
server.listen(4000, () => {
    console.log("Server is running on port 4000");
});

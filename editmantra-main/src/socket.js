import { io } from "socket.io-client";

const SOCKET_URL = "https://editmantra.onrender.com"; // Backend server URL

// Create a function to initialize the socket
const initSocket = () => {
  const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    reconnectionAttempts: 5,
    timeout: 10000, // 10 seconds timeout for connection
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.io server:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Connection error:", err.message);
  });

  return socket;
};

// Export the function
export { initSocket };
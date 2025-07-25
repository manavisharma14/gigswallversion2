import { Server as HTTPServer } from "http";
import { Server as IOServer } from "socket.io";

// Setup Socket.IO server on an HTTP server
export function createSocketServer(server: HTTPServer) {
    const io = new IOServer(server);

    io.on("connection", (socket) => {
        console.log("A user connected");

        // Join a room based on gigId for private chats
        socket.on("join_gig", (gigId: string) => {
            socket.join(gigId);
            console.log(`User joined gig room: ${gigId}`);
        });

        // Send message
        socket.on("send_message", (message: { gigId: string, sender: string, text: string }) => {
            if (!message.gigId || !message.sender || !message.text) {
                console.error("Invalid message structure");
                return;
            }

            console.log(`Message received from ${message.sender} for gig ${message.gigId}: ${message.text}`);

            io.to(message.gigId).emit("receive_message", {
                sender: message.sender,
                text: message.text,
                timestamp: new Date().toISOString(),
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
}
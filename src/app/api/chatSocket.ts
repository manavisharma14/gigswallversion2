import { Server } from "socket.io";

// Setup Socket.IO server on an HTTP server
export function createSocketServer(server: any) {
    const io = new Server(server);

    io.on("connection", (socket) => {
        console.log("A user connected");

        // Join a room based on gigId for private chats
        socket.on("join_gig", (gigId: string) => {
            socket.join(gigId);
            console.log(`User joined gig room: ${gigId}`);
        });

        // Send message
        socket.on("send_message", (message: { gigId: string, sender: string, text: string }) => {
            // Ensure the message structure is correct
            if (!message.gigId || !message.sender || !message.text) {
                console.error("Invalid message structure");
                return;
            }

            console.log(`Message received from ${message.sender} for gig ${message.gigId}: ${message.text}`);

            // Broadcast the message to the room (gigId)
            io.to(message.gigId).emit("receive_message", {
                sender: message.sender,
                text: message.text,
                timestamp: new Date().toISOString(),
            });
        }); 

        // Disconnect handler
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
}

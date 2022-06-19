const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const formatMessages = require("./utils/formatMessages");
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static("./public"));

io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit(
            "message",
            formatMessages("Cortana", "Welcome to the chat app!")
        );

        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                formatMessages(
                    "Cortana",
                    `${user.username} has joined the chat!`
                )
            );

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });

    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit(
            "message",
            formatMessages(`${user.username}`, msg)
        );
    });

    socket.on("disconnect", () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                "message",
                formatMessages("Cortana", `${user.username} left the chat!`)
            );

            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });
});

server.listen("5000", () => {
    console.log("localhost:5000");
});

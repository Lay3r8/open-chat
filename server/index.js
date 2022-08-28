/*
Open chat backend

This was made after this nice tutorial -> https://dev.to/novu/building-a-chat-app-with-socketio-and-react-2edj
*/
const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require("socket.io")(httpServer, { cors: { origin: "*" } });

const PORT = 4000;

let users = [];
let typingUsers = [];

io.on('connection', socket => {
    console.log(`🙋: user with id ${socket.id} just connected!`);

    // Listen for messages
    socket.on('message', (data) => {
        console.log('📨:', data);
        io.emit('messageResponse', data);
    });

    // Listens when a new user joins the server
    socket.on('newUser', (data) => {
        users.push(data);
        io.emit('newUserResponse', users);
    });

    // Listen when a user starts typing
    socket.on('typingStart', (data) => {
        if(!typingUsers.find(u => u.id === data.id)) typingUsers.push(data);
        socket.broadcast.emit('typingResponse', typingUsers)
    });

    // Listen when a user stops typing
    socket.on('typingEnd', (data) => {
        typingUsers = typingUsers.filter(u => u.id !== data.id);
        socket.broadcast.emit('typingResponse', typingUsers)
    });

    // Listen when a user left the server
    socket.on('userLeft', (data) => {
        users = users.filter(u => u.id !== data.id);
        io.emit('userLeftResponse', users);
    });

    // Listen when a user disconnects from the socket
    socket.on('disconnect', () => {
        console.log('💀: A user disconnected');
    });
});

httpServer.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

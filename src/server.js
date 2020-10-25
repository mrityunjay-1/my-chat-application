const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { getCurrentTimeWithMessage, generateLocationMessage } = require('./utils/return_time');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 8080;

// here socket for server is successfully configured
const io = socketio(server);

const publicDirectory = path.join(__dirname, '../public');
app.use(express.static(publicDirectory));

let totalConnections = 0;
io.on('connection', (socket) => {
    console.log(`total connections = ${++totalConnections}`);

    io.emit('welcome_message', getCurrentTimeWithMessage('welcome'));

    // message coming from the client

    // gets eveyone except sender
    socket.broadcast.emit("welcome_message", getCurrentTimeWithMessage("a user is just connected"));


    socket.on('sendMessage', (message, callback) => {

        // sending message to every single user who connected
        io.emit("message", getCurrentTimeWithMessage(message));
        //let's check  for others except sender -----  socket.broadcast.emit("message", message);
        callback("Delivered");
    })


    socket.on("share_location", (position, callback) => {
        io.emit("share_location_server", generateLocationMessage(`https://google.com/maps?q=${position.latitude},${position.longitude}`));
        callback();
    })



    // get notified everybody, about present user who left.
    socket.on('disconnect', () => {
        io.emit("welcome_message", 'a user is just disconnected.');
    })



    // socket.emit('updated_data', totalConnections);

    // socket.on('update_count', () => {
    //     totalConnections++;

    //     io.emit('updated_data', totalConnections);
    // })

    // socket.on('text_data', (data1) => {
    //     string1 += data1;
    //     //  console.log("incoming data = " + string1);
    //     io.emit('updated_string', string1);
    // })

})

server.listen(port, () => {
    console.log(`server is up on port:${port}`);
})
const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const socket = require('socket.io');

const io = socket(server);

let chats = [];
let clients = {};

io.on("connection", function(conn) {
    console.log("A client has connected" + conn.id);


    conn.emit("chatlog", chats);

    conn.on("signup", function (data) {
        clients[data] = conn.id;
        console.log(clients);
    });

    conn.on("send_msg", function (data) {
        if (data.msg.charAt(0) == "@") {
            let toUser = data.msg.split(" ", 1)[0].substring(1);
            let msg = data.msg.substring(data.msg.indexOf(" ") + 1);

            io.to(clients[toUser]).emit("rcv_msg", data.user + ": " + msg);
        } else {
            chats.push(data);
            io.emit("rcv_msg", data.user + ": " + data.msg)
        }
    });

    conn.on("disconnect", function (data) {
        console.log("A user disconnected");
    })

});


app.use('/', express.static(__dirname + "/public"));


server.listen(3456, function () {
    console.log('Server started');
});

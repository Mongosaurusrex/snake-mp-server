const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { initGame, gameLoop, getUpdatedVelocity } = require("./game");
const { FRAME_RATE } = require("./constants");
const { makeId } = require("./utils");

const state = {};
const clientRooms = {};

app.use(require("express").static("client"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/client/index.html");
});

io.on('connection', client => {
    console.log("Client connected with address: " + client.handshake.address);

    client.on("keydown", handleKeydown);
    client.on("newGame", handleNewGame);
    client.on("joinGame", handleJoinGame);

    function handleJoinGame(gameCode) {
        const room = io.sockets.adapter.rooms.get(gameCode)
        let allUsers;
        if (room) {
            allUsers = room.values();
        }

        let numClients = 0;
        if (allUsers) {
            numClients = allUsers.length;
        }

        if (numClients === 0) {
            client.emit("unknownGame");
            return;
        } else if (numClients > 1) {
            client.emit("tooManyPlayers");
            return;
        }

        clientRooms[client.id] = gameCode;

        client.join(gameCode);
        client.number = 2;
        client.emit("init", 2);

        startGameInterval(gameCode);
    }

    function handleNewGame() {
        let roomName = makeId(5);
        clientRooms[client.id] = roomName;
        client.emit("gameCode", roomName);

        state[roomName] = initGame();

        client.join(roomName);
        client.number = 1;
        client.emit("init", 1);
    }

    function handleKeydown(keyCode) {
        const roomName = clientRooms[client.id];

        if (!roomName) {
            return;
        }

        try {
            keyCode = parseInt(keyCode);
        } catch (e) {
            return;
        }

        const vel = getUpdatedVelocity(keyCode);

        if (vel) {
            state[roomName].players[client.number - 1].vel = vel;
        }
    }
});

function startGameInterval(roomName) {
    const intervalId = setInterval(() => {
        const winner = gameLoop(state[roomName]);

        if (!winner) {
            emitGameState(roomName, state[roomName]);
        } else {
            emitGameOver(roomName, winner);
            state[roomName] = null;
            clearInterval(intervalId);
        }
    }, 1000 / FRAME_RATE);
}

server.listen(process.env.PORT || 3000, () => {
    console.log("Listening on *:3000");
});

function emitGameState(roomName, state) {
    io.sockets.in(roomName).emit("gameState", JSON.stringify(state));
}

function emitGameOver(roomName, winner) {
    io.sockets.in(roomName).emit("gameOver", JSON.stringify({ winner }));
}

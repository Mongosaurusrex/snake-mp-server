const { createGameState } = require("../../game");
const { FRAME_RATE } = require("../constants");

function initHandler(client) {
    const state = createGameState();

    startGameInterval(client, state);
}

function startGameInterval(client, state) {
    const intervalId = setInterval(() => {
        const winner = gameLoop(state);
    }, 1000/ FRAME_RATE);
}

const { GRID_SIZE } = require("./constants");

module.exports = {
    initGame,
    gameLoop,
    getUpdatedVelocity,
}

function initGame() {
    const state = createGameState();
    randomFood(state);
    return state;
}

function createGameState() {
    return {
        players: [
            {
                pos: {
                    x: 3,
                    y: 10,
                },
                vel: {
                    x: 1,
                    y: 0,
                },
                snake: [
                    { x: 3, y: 10 },
                ]
            },
            {
                pos: {
                    x: 20,
                    y: 10,
                },
                vel: {
                    x: 1,
                    y: 0,
                },
                snake: [
                    { x: 20, y: 10 },
                ]
            }
        ],
        food: {},
        gridsize: GRID_SIZE,
    };
}

function gameLoop(state) {
    if (!state) {
        return;
    }

    const {
        players: {
            0: playerOne,
            1: playerTwo,
        },
        food,
    } = state;

    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;
    playerTwo.pos.x += playerTwo.vel.x;
    playerTwo.pos.y += playerTwo.vel.y;

    if (playerOne.pos.x < 0) {
        playerOne.pos.x = GRID_SIZE
    } else if (playerOne.pos.x > GRID_SIZE) {
        playerOne.pos.x = 0
    } else if (playerOne.pos.y < 0) {
        playerOne.pos.y = GRID_SIZE
    } else if (playerOne.pos.y > GRID_SIZE) {
        playerOne.pos.y = 0
    }

    if (playerTwo.pos.x < 0) {
        playerTwo.pos.x = GRID_SIZE
    } else if (playerTwo.pos.x > GRID_SIZE) {
        playerTwo.pos.x = 0
    } else if (playerTwo.pos.y < 0) {
        playerTwo.pos.y = GRID_SIZE
    } else if (playerTwo.pos.y > GRID_SIZE) {
        playerTwo.pos.y = 0
    }

    if (food.x === playerOne.pos.x && food.y === playerOne.pos.y) {
        playerOne.snake.push({ ...playerOne.pos });
        playerOne.pos.x += playerOne.vel.x;
        playerOne.pos.y += playerOne.vel.y;
        randomFood(state);
    }

    if (food.x === playerTwo.pos.x && food.y === playerTwo.pos.y) {
        playerTwo.snake.push({ ...playerTwo.pos });
        playerTwo.pos.x += playerTwo.vel.x;
        playerTwo.pos.y += playerTwo.vel.y;
        randomFood(state);
    }

    if (playerOne.vel.x || playerOne.vel.y) {
        for (let cell of playerOne.snake) {
            if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
                return 2;
            }
        }
    }

    if (playerTwo.vel.x || playerTwo.vel.y) {
        for (let cell of playerTwo.snake) {
            if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) {
                return 1;
            }
        }
    }

    playerOne.snake.push({ ...playerOne.pos });
    playerOne.snake.shift();
    playerTwo.snake.push({ ...playerTwo.pos });
    playerTwo.snake.shift();

    return false;
}

function randomFood(state) {
    const food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
    };
    -1
    for (let cell of state.players[0].snake) {
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state);
        }
    }

    for (let cell of state.players[1].snake) {
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state);
        }
    }

    state.food = food;
}

function getUpdatedVelocity(keyCode) {
    switch (keyCode) {
        case 37:
            return { x: -1, y: 0 }
        case 38:
            return { x: 0, y: -1 }
        case 39:
            return { x: 1, y: 0 }
        case 40:
            return { x: 0, y: 1 }
    }
}
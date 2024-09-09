let board = [];
let openedSquares = [];
let flaggedSquares = [];
let bombCount = 0;
let squaresLeft = 0;

let bombProbability = 3;
let maxProbability = 15;

document.getElementById("startGame").addEventListener("click", () => {
    let difficulty = document.getElementById("difficulty").value;
    bombProbability = parseInt(document.getElementById("bombProbability").value);
    maxProbability = parseInt(document.getElementById("maxProbability").value);

    let rowCount, colCount;

    switch (difficulty) {
        case "easy":
            rowCount = 9;
            colCount = 9;
            break;
        case "medium":
            rowCount = 16;
            colCount = 16;
            break;
        case "expert":
            rowCount = 24;
            colCount = 24;
            break;
    }

    minesweeperGameBootstrapper(rowCount, colCount);
});

function minesweeperGameBootstrapper(rowCount, colCount) {
    generateBoard({'rowCount': rowCount, 'colCount': colCount});
    renderBoard(rowCount, colCount);
}

function generateBoard(boardMetadata) {
    squaresLeft = boardMetadata.colCount * boardMetadata.rowCount;
    board = [];

    for (let i = 0; i < boardMetadata.colCount; i++) {
        board[i] = new Array(boardMetadata.rowCount);
    }

    for (let i = 0; i < boardMetadata.colCount; i++) {
        for (let j = 0; j < boardMetadata.rowCount; j++) {
            let hasBomb = Math.random() * maxProbability < bombProbability;
            board[i][j] = new BoardSquare(hasBomb, 0);
        }
    }

    for (let i = 0; i < boardMetadata.colCount; i++) {
        for (let j = 0; j < boardMetadata.rowCount; j++) {
            if (!board[i][j].hasBomb) {
                board[i][j].bombsAround = countBombsAround(i, j, boardMetadata);
            }
        }
    }

    console.log(board);
}

function countBombsAround(x, y, boardMetadata) {
    let bombs = 0;
    for (let i = Math.max(x - 1, 0); i <= Math.min(x + 1, boardMetadata.colCount - 1); i++) {
        for (let j = Math.max(y - 1, 0); j <= Math.min(y + 1, boardMetadata.rowCount - 1); j++) {
            if (board[i][j].hasBomb) {
                bombs++;
            }
        }
    }
    return bombs;
}

function renderBoard(rowCount, colCount) {
    const boardElement = document.getElementById("board");
    boardElement.style.gridTemplateColumns = `repeat(${colCount}, 40px)`;
    boardElement.innerHTML = '';

    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            const squareElement = document.createElement("div");
            squareElement.classList.add("board-square");
            squareElement.addEventListener("click", () => openSquare(i, j));
            squareElement.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                flagSquare(i, j);
            });
            boardElement.appendChild(squareElement);
        }
    }
}

function openSquare(x, y) {
    if (openedSquares.includes(`${x}-${y}`) || flaggedSquares.includes(`${x}-${y}`)) return;
    const square = board[x][y];
    const squareElement = document.getElementById("board").children[x * board[0].length + y];
    squareElement.classList.add("opened");
    openedSquares.push(`${x}-${y}`);
    squaresLeft--;

    if (square.hasBomb) {
        squareElement.classList.add("bomb");
        alert("Game Over!");
        revealBoard();
    } else {
        squareElement.textContent = square.bombsAround > 0 ? square.bombsAround : '';
        if (squaresLeft === bombCount) {
            alert("You Win!");
        }
    }
}

function flagSquare(x, y) {
    const squareKey = `${x}-${y}`;
    const squareElement = document.getElementById("board").children[x * board[0].length + y];
    
    if (flaggedSquares.includes(squareKey)) {
        flaggedSquares = flaggedSquares.filter(s => s !== squareKey);
        squareElement.classList.remove("flagged");
    } else {
        flaggedSquares.push(squareKey);
        squareElement.classList.add("flagged");
    }
}

function revealBoard() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const squareElement = document.getElementById("board").children[i * board[0].length + j];
            if (board[i][j].hasBomb) {
                squareElement.classList.add("bomb");
            } else {
                squareElement.textContent = board[i][j].bombsAround > 0 ? board[i][j].bombsAround : '';
            }
            squareElement.classList.add("opened");
        }
    }
}

class BoardSquare {
    constructor(hasBomb, bombsAround) {
        this.hasBomb = hasBomb;
        this.bombsAround = bombsAround;
    }
}
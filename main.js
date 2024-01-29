const boardSize = 10;
const winLength = 5;
const board = Array.from({ length: boardSize }, () =>
  Array(boardSize).fill("")
);
let currentPlayer = "X";
let gameActive = true;

const boardElement = document.getElementById("board");
const messageElement = document.querySelector(".message");

function initializeBoard() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", handleCellClick);
      boardElement.appendChild(cell);
    }
  }
}

function handleCellClick(event) {
  if (!gameActive) return;

  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);

  if (board[row][col] === "") {
    board[row][col] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWin()) {
      displayMessage(`${currentPlayer} WIN!`);
      gameActive = false;
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      if (currentPlayer === "O") {
        makeBotMove();
      }
    }
  }
}

function makeBotMove() {
  const winningMove = findWinningMove();
  const blockingMove = findBlockingMove();

  if (winningMove) {
    makeMove(winningMove);
  } else if (blockingMove) {
    makeMove(blockingMove);
  } else {
    makeSmartMove();
  }
}

function makeSmartMove() {
  const playerThreats = findPotentialThreats("X", 3);
  const botOpportunities = findPotentialThreats("O", 3);

  if (playerThreats.length > 0) {
    makeMove(playerThreats[0]);
  } else if (botOpportunities.length > 0) {
    makeMove(botOpportunities[0]);
  } else {
    makeDefensiveMove();
  }
}

function restartGame() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      board[i][j] = "";
      const cell = document.querySelector(
        `.cell[data-row="${i}"][data-col="${j}"]`
      );
      cell.textContent = "";
      cell.classList.remove("X", "O");
    }
  }

  currentPlayer = "X";
  gameActive = true;

  closeModal();
}

function makeDefensiveMove() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === "") {
        board[i][j] = "X";

        if (findPotentialThreats("X", 4).length > 0) {
          board[i][j] = "O";
          const defensiveCell = document.querySelector(
            `.cell[data-row="${i}"][data-col="${j}"]`
          );
          defensiveCell.textContent = "O";

          if (checkWin()) {
            displayMessage("BOT WIN!");
            gameActive = false;
          } else {
            currentPlayer = "X";
          }

          return;
        }

        board[i][j] = "";
      }
    }
  }
  makeRandomMove();
}

function findPotentialThreats(symbol, consecutiveCount) {
  const threats = [];

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === "") {
        board[i][j] = symbol;

        if (checkWin()) {
          threats.push({ row: i, col: j });
        }

        board[i][j] = "";
      }
    }
  }

  return threats;
}

function findWinningMove() {
  return findMove(currentPlayer, 5);
}

function findBlockingMove() {
  const opponentSymbol = currentPlayer === "X" ? "O" : "X";
  return findMove(opponentSymbol, 5);
}

function findMove(symbol, consecutiveCount) {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === "") {
        board[i][j] = symbol;
        if (checkWin()) {
          board[i][j] = "";
          return { row: i, col: j };
        }
        board[i][j] = "";
      }
    }
  }
  return null;
}

function makeRandomMove() {
  let emptyCells = getEmptyCells();

  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const botMove = emptyCells[randomIndex];
    makeMove(botMove);
  }
}

function getEmptyCells() {
  let emptyCells = [];
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === "") {
        emptyCells.push({ row: i, col: j });
      }
    }
  }
  return emptyCells;
}

function makeMove(move) {
  const { row, col } = move;
  board[row][col] = currentPlayer;
  const botCell = document.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`
  );
  botCell.textContent = currentPlayer;

  botCell.classList.add(currentPlayer);

  if (checkWin()) {
    displayMessage(`${currentPlayer} WIN!`);
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

function checkWin() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (
        j + 4 < boardSize &&
        board[i][j] !== "" &&
        board[i][j] === board[i][j + 1] &&
        board[i][j] === board[i][j + 2] &&
        board[i][j] === board[i][j + 3] &&
        board[i][j] === board[i][j + 4]
      ) {
        return true;
      }
      if (
        i + 4 < boardSize &&
        board[i][j] !== "" &&
        board[i][j] === board[i + 1][j] &&
        board[i][j] === board[i + 2][j] &&
        board[i][j] === board[i + 3][j] &&
        board[i][j] === board[i + 4][j]
      ) {
        return true;
      }
      if (
        i + 4 < boardSize &&
        j + 4 < boardSize &&
        board[i][j] !== "" &&
        board[i][j] === board[i + 1][j + 1] &&
        board[i][j] === board[i + 2][j + 2] &&
        board[i][j] === board[i + 3][j + 3] &&
        board[i][j] === board[i + 4][j + 4]
      ) {
        return true;
      }
      if (
        i - 4 >= 0 &&
        j + 4 < boardSize &&
        board[i][j] !== "" &&
        board[i][j] === board[i - 1][j + 1] &&
        board[i][j] === board[i - 2][j + 2] &&
        board[i][j] === board[i - 3][j + 3] &&
        board[i][j] === board[i - 4][j + 4]
      ) {
        return true;
      }
    }
  }
  return false;
}

function displayMessage(msg) {
  if (msg === "X WIN!" && currentPlayer === "X") {
    msg = "USER WIN!";
  }

  if (msg === "O WIN!" && currentPlayer === "O") {
    msg = "BOT WIN!";
  }

  openModal(msg);
}

function openModal(message) {
  const modal = document.getElementById("myModal");
  const modalMessage = document.getElementById("modalMessage");
  modalMessage.textContent = message;
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

initializeBoard();

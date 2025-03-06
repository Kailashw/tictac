// Constants
const GRID_LENGTH = 3;
const PLAYER_X = "X";
const PLAYER_O = "O";

// Game state
let grid = [];
let turn = PLAYER_X;
let gameOver = false;
let player1Name = "";
let player2Name = "";
const indexes = {};

// HTML Elements (Consider fetching these in `startGame` or `renderBoard`)
const changePlayerText = document.getElementById("changePlayerText");
const resultModal = document.getElementById("resultModal");
const gridElement = document.getElementById("grid"); // Added this

/**
 * Generates a 2D array (n x n) representing the winning combinations.
 * @param {number} n The size of the grid.
 * @returns {number[][]} A 2D array representing the grid.
 */
const generateWinningCombinationsMatrix = (n) => {
  const matrix = [];
  let count = 1;
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      row.push(count++);
    }
    matrix.push(row);
  }
  return matrix;
};

/**
 * Extracts diagonal winning combinations from a square matrix.
 * @param {number[][]} matrix The square matrix.
 * @returns {number[][]} An array containing two arrays: the main diagonal and the anti-diagonal.
 */
const extractDiagonals = (matrix) => {
  const n = matrix.length;
  const mainDiagonal = [];
  const antiDiagonal = [];

  for (let i = 0; i < n; i++) {
    mainDiagonal.push(matrix[i][i]);
    antiDiagonal.push(matrix[i][n - 1 - i]);
  }

  return [mainDiagonal, antiDiagonal];
};

/**
 * Extracts columns from a 2D array.
 * @param {any[][]} arr The 2D array.
 * @returns {any[][]} An array of columns.
 */
const extractColumns = (arr) => {
  const numCols = arr[0].length;
  const columns = [];

  for (let i = 0; i < numCols; i++) {
    const column = arr.map((row) => row[i]);
    columns.push(column);
  }
  return columns;
};

// Generate winning combinations outside functions for efficiency
let winningCombinationsMatrix = generateWinningCombinationsMatrix(GRID_LENGTH);
let columns = extractColumns(winningCombinationsMatrix);
let diagonals = extractDiagonals(winningCombinationsMatrix);

// Combine all winning combinations
let winningCombinations = winningCombinationsMatrix.concat(columns, diagonals);

/**
 * Generates unique indexes for each cell in the grid (e.g., "0_0", "0_1", etc.).
 */
function generateIndexes() {
  let count = 1;
  for (let xIndex = 0; xIndex < GRID_LENGTH; xIndex++) {
    for (let yIndex = 0; yIndex < GRID_LENGTH; yIndex++) {
      const key = `${xIndex}_${yIndex}`; // Use template literals for readability
      indexes[key] = count;
      count++;
    }
  }
}

/**
 * Initializes the game grid with default values (0).
 */
function initializeGrid() {
  grid = Array(GRID_LENGTH)
    .fill(null)
    .map(() => Array(GRID_LENGTH).fill(0)); // More concise way to create the grid
}

/**
 * Switches the current player's turn.
 */
function changePlayer() {
  if (checkWinner(turn)) {
    const winningPlayerName = turn === PLAYER_X ? player1Name : player2Name;
    const message = `${winningPlayerName} won!`;
    gameOver = true;
    renderMainGrid();
    declareResult(message);
    return; // Exit early if game is won
  }

  turn = turn === PLAYER_X ? PLAYER_O : PLAYER_X; //Ternary operator for conciseness
  changePlayerText.innerHTML = `<h4 class='displayText'> It's ${turn}'s Turn.</h4>`;
}

/**
 * Creates the HTML for a single cell in the grid.
 * @param {number} colIdx The column index.
 * @param {number} rowIdx The row index.
 * @returns {string} The HTML for the cell.
 */
function createRowBox(colIdx, rowIdx) {
  const sum = colIdx + rowIdx;
  const backgroundClass = sum % 2 === 0 ? "lightBackground" : "darkBackground";
  const gridValue = grid[colIdx][rowIdx];
  let content = "";

  if (gridValue === 1) {
    content = PLAYER_X;
  } else if (gridValue === 2) {
    content = PLAYER_O;
  }

  const index = indexes[`${colIdx}_${rowIdx}`];
  return `<div id="${index}" colIdx="${colIdx}" rowIdx="${rowIdx}" class="box ${backgroundClass}">${content}</div>`;
}

/**
 * Creates the HTML for a row of cells.
 * @param {number} colIdx The column index for the row.
 * @returns {string} The HTML for the row.
 */
function createRow(colIdx) {
  let rowDivs = "";
  for (let rowIdx = 0; rowIdx < GRID_LENGTH; rowIdx++) {
    rowDivs += createRowBox(colIdx, rowIdx);
  }
  return `<div class="rowStyle">${rowDivs}</div>`;
}

/**
 * Generates the HTML for the entire game grid.
 */
function getColumns() {
  let columnDivs = "";
  for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
    columnDivs += createRow(colIdx);
  }
  return `<div class="columnsStyle">${columnDivs}</div>`;
}

/**
 * Renders the game grid in the HTML.
 */
function renderMainGrid() {
  gridElement.innerHTML = getColumns();
}

/**
 * Handles a cell click event.
 */
function onBoxClick() {
  const rowIdx = parseInt(this.getAttribute("rowIdx"), 10);
  const colIdx = parseInt(this.getAttribute("colIdx"), 10);

  if (grid[colIdx][rowIdx] !== 0) {
    return; // Prevent re-clicking
  }

  const newValue = turn === PLAYER_O ? 2 : 1;
  grid[colIdx][rowIdx] = newValue;
  handleSeriesofEvents(rowIdx, colIdx);
}

/**
 * Handles the series of events after a player makes a move.
 * @param {number} rowIdx The row index of the clicked cell.
 * @param {number} colIdx The column index of the clicked cell.
 */
function handleSeriesofEvents(rowIdx, colIdx) {
  if (checkTie()) {
    gameOver = true;
    renderMainGrid();
    declareResult("It's a tie!");
    return; // Exit early if it's a tie
  }

  renderMainGrid();
  addClickHandlers();
  changePlayer();
}

/**
 * Checks if the game is tied.
 * @returns {boolean} True if the game is tied, false otherwise.
 */
function checkTie() {
  for (let i = 0; i < GRID_LENGTH; i++) {
    for (let j = 0; j < GRID_LENGTH; j++) {
      if (grid[i][j] === 0) {
        return false; // If any cell is empty, it's not a tie
      }
    }
  }
  return true;
}


/**
 * Checks if the current player has won the game.
 * @param {string} player The current player ('X' or 'O').
 * @returns {boolean} True if the player has won, false otherwise.
 */
function checkWinner(player) {
  const playerValue = player === PLAYER_X ? 1 : 2;

  for (const combination of winningCombinations) {
    if (
      combination.every((cellIndex) => {
        const row = Math.floor((cellIndex - 1) / GRID_LENGTH);
        const col = (cellIndex - 1) % GRID_LENGTH;
        return grid[row][col] === playerValue;
      })
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Displays the game result in the result modal.
 * @param {string} message The message to display.
 */
function declareResult(message) {
  resultModal.innerHTML = `<h1 class='displayText'>${message}</h1>`;
}

/**
 * Adds click handlers to all empty cells in the grid.
 */
function addClickHandlers() {
  const boxes = document.getElementsByClassName("box");
  for (let i = 0; i < boxes.length; i++) {
    if (!boxes[i].innerText) {
      boxes[i].addEventListener("click", onBoxClick, false);
    }
  }
}

/**
 * Resets the game board to its initial state.
 */
function renderBoard() {
  initializeGrid();
  renderMainGrid();
  addClickHandlers();
  changePlayerText.innerHTML = "";
  resultModal.innerHTML = "";
  gameOver = false; // Reset game state
  turn = PLAYER_X; // Reset to Player X's turn
}

/**
 * Starts a new game, prompting for player names.
 */
function startGame() {
  const confirmNewGame = confirm(
    "You will be redirected to the game. Player 1 is 'X' and Player 2 is 'O'"
  );

  if (confirmNewGame) {
    player1Name = prompt("What's Player 1's Name?") || "Player 1";
    player2Name = prompt("What's Player 2's Name?") || "Player 2";
  }
}

// Initial setup
generateIndexes();
renderBoard();
startGame();

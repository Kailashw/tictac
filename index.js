
//initalizing global parameters.
var grid = [];
const GRID_LENGTH = 3;
let turn = 'X';
let gameOver = false;

var player1 = '';
var player2 = '';

// used for identifying unique id's.
const indexes = {
    '0_0': 1,
    '0_1': 2,
    '0_2': 3,
    '1_0': 4,
    '1_1': 5,
    '1_2': 6,
    '2_0': 7,
    '2_1': 8,
    '2_2': 9
}

/**
 * initalize grid of 3*3 matrix with 
 * default value '0' (zero) in it.
 */
function initializeGrid() {
    for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
        const tempArray = [];
        for (let rowidx = 0; rowidx < GRID_LENGTH; rowidx++) {
            tempArray.push(0);
        }
        grid.push(tempArray);
    }
}

/**
 * @description alternate player by switching 'turn' value.
 * 
 */
function changePlayer() {
    let displayText = document.getElementById("changePlayerText")
    let player = turn == 'X' ? player1 : player2 + "( Computer )"
    let nextPlayer = turn == 'O' ? player1 : player2 + "( Computer )"

    // check if the game is tied. set 'game over' to true. 
    if (checkTie()) {
        let msg = "It's a tie."
        gameOver = true
        renderMainGrid();
        declareResult(msg)
    }
    // check if the game is won by someone. set 'game over' to true. 
    else if (checkWinner()) {
        let msg = player + " won !!"
        gameOver = true
        renderMainGrid();
        declareResult(msg)
    }
    // else if (turn === 'X') {
    //     turn = 'O';
    //     displayText.innerHTML = "<h4 class='displayText'> Its " + nextPlayer + "'s Turn.</h4>"
    //     return;
    // } else {
    //     turn = 'X';
    //     displayText.innerHTML = "<h4 class='displayText'> Its " + nextPlayer + "'s Turn.</h4>"
    // }
    else if (turn === 'X') {
        turn = 'O'
        skipaStep()
        renderMainGrid();
        addClickHandlers();
        changePlayer();
        displayText.innerHTML = "<h4 class='displayText'> Its " + nextPlayer + "'s Turn.</h4>"
        return
    }
    else {
        turn = 'X';
        displayText.innerHTML = "<h4 class='displayText'> Its " + nextPlayer + "'s Turn.</h4>"
    }

}


function filterEmptyCells(beforeFilter) {
    return Object.keys(beforeFilter).filter(key => indexes[key] === 3)
}

function skipaStep() {
    // check for empty cells.
    // pick random number
    // assign 'O' value
    // re-render the table.
    let emptyCells = []
    for (let index = 1; index <= 9; index++) {
        if (!getCellValue(index)) {
            emptyCells.push(index)
        }
    }
    // get unique identifiers for empty cels 
    let res = Object.keys(indexes).filter(key => indexes[key])
    for (let index = 0; index < emptyCells.length; index++) {
        res = Object.keys(indexes).filter(key => indexes[key] !== index)
    }

    let index = res[Math.floor(Math.random() * res.length)]
    let i = index.split("_")[0]
    let j = index.split("_")[1]
    //re-rendreing the table with new value.
    grid[i][j] = 2;
}
/**
 * @description - lists styled div elements (and also, content if any during subsiquent render)   
 * @param {int} colIdx - column id
 * @returns - HTML div tags to be rendered.
 */
function getRowBoxes(colIdx) {
    let rowDivs = '';

    for (let rowIdx = 0; rowIdx < GRID_LENGTH; rowIdx++) {
        let additionalClass = 'darkBackground';
        let content = '';
        const sum = colIdx + rowIdx;
        if (sum % 2 === 0) {
            additionalClass = 'lightBackground'
        }
        const gridValue = grid[colIdx][rowIdx];
        if (gridValue === 1) {
            content = 'X';
        }
        else if (gridValue === 2) {
            content = 'O';
        }
        index = indexes[colIdx + "_" + rowIdx]
        rowDivs = rowDivs + '<div id="' + index + '" colIdx="' + colIdx + '" rowIdx="' + rowIdx + '" class="box ' +
            additionalClass + '">' + content + '</div>';
    }
    return rowDivs;
}

/**
 * @description - lists HTML tags with matrix format.
 * @returns - HTML tags to render.
 */
function getColumns() {
    let columnDivs = '';
    for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
        let coldiv = getRowBoxes(colIdx);
        coldiv = '<div class="rowStyle">' + coldiv + '</div>';
        columnDivs = columnDivs + coldiv;
    }
    return columnDivs;
}

/**
 * @description - renders matrix into HTML page by looking up for 'static' element id.
 */
function renderMainGrid() {
    const parent = document.getElementById("grid");
    const columnDivs = getColumns();
    parent.innerHTML = '<div class="columnsStyle">' + columnDivs + '</div>';
}

/**
 * @description - render the content 'X' or 'O' in to clicked cell.
 */
function onBoxClick() {
    var rowIdx = this.getAttribute("rowIdx");
    var colIdx = this.getAttribute("colIdx");
    let newValue = turn == 'O' ? 2 : 1;
    grid[colIdx][rowIdx] = newValue;
    renderMainGrid();
    addClickHandlers();
    changePlayer();
}

/**
 * @description - check tie condition by looking for values in each cells.
 */
function checkTie() {
    // need to check if all the cells are > 0
    let count = 0
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] == 0) {
                count += 1
            }
        }
    }
    return count > 0 ? false : true
}

/**
 * 
 * @param {string} turn - character 'X or 'O' 
 * 1-9 are cell index in 1D array.
 * this function checks for all possible winning combination. 
 */
function checkWinner() {
    let result = false;
    if (checkRow(1, 2, 3, turn) ||
        checkRow(4, 5, 6, turn) ||
        checkRow(7, 8, 9, turn) ||
        checkRow(1, 4, 7, turn) ||
        checkRow(2, 5, 8, turn) ||
        checkRow(3, 6, 9, turn) ||
        checkRow(1, 5, 9, turn) ||
        checkRow(3, 5, 7, turn)) {
        result = true
    }
    return result
}

// return true if winning 'X|0' is present in all of them, false otherwise.
function checkRow(a, b, c, turn) {
    var result = false
    if (getCellValue(a) == turn && getCellValue(b) == turn && getCellValue(c) == turn) {
        result = true;
    }
    return result
}

/**
 * 
 * @param {int} id - pass row id to get the value. 
 */
function getCellValue(id) {
    return document.getElementById(id).innerText
}

/**
 * @param {string} msg - message to be displayed after the "gameover". 
 */
function declareResult(msg) {
    let gameOverMsg = document.getElementById("resultModal")
    gameOverMsg.innerHTML = "<h1 class='displayText'>" + msg + "</h1>"
}

/**
 * @description add click handler to cell if unmarked, spare otherwise. 
 */
function addClickHandlers() {
    var boxes = document.getElementsByClassName("box");
    // add click handlers to only unselected boxes.
    for (var idx = 0; idx < boxes.length; idx++) {
        if (!boxes[idx].innerText) {
            boxes[idx].addEventListener('click', onBoxClick, false);
        }
    }
}

/**
 * @description - re-renders the board empty when called.
 * call 'initializeGrid' - method to render 2d array.
 * followed by 'renderMainGrid' - method to render the content filled and styled matrix in HTML.
 * call 'addClickHandler' to add click handler to each cell if it's not checked already. 
 */
function renderBoard() {
    grid = []
    turn = 'X'
    initializeGrid();
    renderMainGrid();
    addClickHandlers();
    document.getElementById("changePlayerText").innerHTML = ''
    document.getElementById("resultModal").innerHTML = ''
}

// call it for the first time when HTML loads.
renderBoard()

// Could do nicer with UI.
function startGame() {
    confirm("You will be redirect to game. Player 1 is 'X' and Player 2 (Computer) id 'O'")
    player1 = prompt("What's Player 1 Name ?") || 'X'
    player2 = prompt("What's Player 2 ( Computer ) Name ?") || 'O'
}

startGame()
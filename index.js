
//initalizing global parameters.
var grid = [];
const GRID_LENGTH = 3;          // configurable grid size.
let turn = 'X';
let gameOver = false;

// for player names.
var player1 = '';
var player2 = '';

const indexes = {}

/**
 * Generate 'n*n' one dimensional array.
 * @param {int} n 
 */
const GenerateMatrix = (n) => {
    let act_arr = []
    let count = 1
    let temp_arr = []
    for (let index = 1; index <= n * n; index++) {
        temp_arr.push(count)
        count++
        if (index % n == 0) {
            act_arr.push(temp_arr)
            temp_arr = []
        }
    }
    return act_arr
}

/**
 * fetch first element from each row
 * @param {Array} arr 
 */
const FetchDiagonals = (arr) => {
    let retArr = []
    let tempLeft = []
    let tempRight = []
    // fetch R2L
    for (let index = 1; index <= arr.length * arr.length; index += arr.length + 1) {
        tempLeft.push(index)
    }
    // fetch L2R
    for (let index = arr.length; index < arr.length * arr.length; index += arr.length - 1) {
        tempRight.push(index)
    }

    //push diagonals
    retArr.push(tempLeft)
    retArr.push(tempRight)

    return retArr
}


const arrayColumn = (arr, n) => arr.map(x => x[n]);

const FetchColumns = (arr) => {
    let retArr = []
    for (let index = 0; index < arr.length; index++) {
        const element = arrayColumn(arr, index)
        retArr.push(element)
    }
    return retArr
}

let WinningComb = GenerateMatrix(GRID_LENGTH)
let columns = FetchColumns(WinningComb)
let diagonals = FetchDiagonals(WinningComb)
WinningComb = WinningComb.concat(columns)
WinningComb = WinningComb.concat(diagonals)

/**
 * generate uniqueindexes for n * n matrix.
 */
function generateIndexes() {
    let count = 1;
    for (let xIndex = 0; xIndex < GRID_LENGTH; xIndex++) {
        for (let yIndex = 0; yIndex < GRID_LENGTH; yIndex++) {
            let key = xIndex + "_" + yIndex
            indexes[key] = count
            count++
        }
    }

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
    // check if the game is won by someone. set 'game over' to true. 
    if (checkWinner(GRID_LENGTH, turn)) {
        let player = turn == 'X' ? player1 : player2
        let msg = player + " won !!"
        gameOver = true
        renderMainGrid();
        declareResult(msg)
    }
    else if (turn === 'X') {
        turn = 'O';
        displayText.innerHTML = "<h4 class='displayText'> Its " + turn + "'s Turn.</h4>"
        return;
    } else {
        turn = 'X';
        displayText.innerHTML = "<h4 class='displayText'> Its " + turn + "'s Turn.</h4>"
    }

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
    handleSeriesofEvents(rowIdx, colIdx);    // handle series of events once action is dispatched.
}

/**
 * 
 * @param {int} rowIdx - row index of clicked cell.
 * @param {int} colIdx - columnd index of click cell.
 * @returns - conditional 
 */
function handleSeriesofEvents(rowIdx, colIdx) {
    // check if the game is tied. set 'game over' to true. 
    if (checkTie()) {
        let msg = "It's a tie."
        gameOver = true
        renderMainGrid();
        declareResult(msg)
    }
    else {
        renderMainGrid();
        addClickHandlers();
    }
    // change the player 
    changePlayer(rowIdx, colIdx);
}

/**
 * @description - check tie condition by looking for values in each cells.
 */
function checkTie() {
    // need to check if all the cell values are > 0
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
 * check if all the elements in an object have value true.
 * @param {Object} obj 
 */
function allValuesTrue(obj) {
    for (let el in obj)
        if (!obj[el]) return false;
    return true;
}

/**
 * function to check the winning condition irrespective of grid length.
 * @param {string} turn 
 * @param {int} GRID_LENGTH 
 */
function checkWinner(GRID_LENGTH, turn) {
    let result = false
    let arr = WinningComb // fetch winningcombination based on grid_length
    let obj = {}
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            let key = [i] + "_" + [j]
            obj[key] = getCellValue(arr[i][j]) === turn
        }
        if (allValuesTrue(obj)) {
            result = true
            return result
        } else {
            obj = {}
        }
    }
    return result
}

// get cell value in matrix by unique id.
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
    initializeGrid();
    renderMainGrid();
    addClickHandlers();
    document.getElementById("changePlayerText").innerHTML = ''
    document.getElementById("resultModal").innerHTML = ''
}

// call it for the first time when HTML loads.
renderBoard()
generateIndexes()

// Could do nicer with UI.
function startGame() {
    confirm("You will be redirect to game. Player 1 is 'X' and Player 2 id 'O'")
    player1 = prompt("What's Player 1 Name ?") || 'X'
    player2 = prompt("What's Player 2 Name ?") || 'O'

}

startGame()
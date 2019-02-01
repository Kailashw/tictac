
// initalize the global paramters
var grid = [];
const GRID_LENGTH = 3;
let turn = 'X';

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
            content = '<span class="cross">X</span>';
        }
        else if (gridValue === 2) {
            content = '<span class="cross">O</span>';
        }
        rowDivs = rowDivs + '<div colIdx="' + colIdx + '" rowIdx="' + rowIdx + '" class="box ' +
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
    let newValue = 1;                   // this value is determining the 'X'/'O' value.
    grid[colIdx][rowIdx] = newValue;
    renderMainGrid();
    addClickHandlers();
}


/**
 * @description add click handler to cells. 
 */
function addClickHandlers() {
    var boxes = document.getElementsByClassName("box");
    for (var idx = 0; idx < boxes.length; idx++) {
        boxes[idx].addEventListener('click', onBoxClick, false);
    }
}

/**
 * @description - re-renders the board empty when called.
 * call 'initializeGrid' - method to render 2d array.
 * followed by 'renderMainGrid' - method to render the content filled and styled matrix in HTML.
 * call 'addClickHandler' to add click handler to each cell. 
 */
function renderBoard() {
    grid = []
    initializeGrid();
    renderMainGrid();
    addClickHandlers();
}

// call it for the first to load HTML.
renderBoard()

'use strict'


function createBoard(rows, cols) {
    var board = []
    for (var i = 0; i < rows; i++) {
        board.push([])
        for (var j = 0; j < cols; j++) {
            var cell = {
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    return board
}

function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            var cellClass = getClassName({ i: i, j: j })
            strHTML += `<td class="cell ${cellClass}" onclick="cellClicked(${i},${j})" onmouseup="cellMarked(${i},${j})"">`

            strHTML += '</td>'
        }
        strHTML += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function renderCell(locationObject, background, value, remove) {
    var cellSelector = '.' + getClassName(locationObject)
    var elCell = document.querySelector(cellSelector)
    if (remove === true) elCell.classList.remove(background)
    else elCell.classList.add(background)
    if(value === 1) elCell.style.color = 'salmon'
    if(value === 2) elCell.style.color = 'blue'
    if(value === 3) elCell.style.color = 'purple'
    if(value === 4) elCell.style.color = 'chocolate'
    if(value === 5) elCell.style.color = 'magenta'
    if(value === 6) elCell.style.color = 'gold'
    if(value === 7) elCell.style.color = 'maroon'
    if(value === 8) elCell.style.color = 'red'
    elCell.innerHTML = value
}

function checkAllNegs(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {

            for (var smallI = i - 1; smallI <= i + 1; smallI++) {
                if (smallI < 0 || smallI >= board.length) continue
                for (var smallJ = j - 1; smallJ <= j + 1; smallJ++) {
                    if (j === smallJ && i === smallI) continue
                    if (smallJ < 0 || smallJ >= board[smallI].length) continue
                    if (board[i][j].isMine) board[smallI][smallJ].minesAroundCount++
                    var minesNum = board[i][j].minesAroundCount
                }
            }
        }
    }
    return minesNum
}

function randomizeMines(minesNum, board, currCell) {
    for (var i = 0; i < minesNum; i++) {
        var randomI = getRandomIntInclusive(0, board.length - 1)
        var randomJ = getRandomIntInclusive(0, board.length - 1)
        if (board[randomI][randomJ] === currCell ||
            board[randomI][randomJ].isMine) {
            i--
            continue
        }
        else board[randomI][randomJ].isMine = true
    }
}


function manuallyPlace() {
    if (!gFirstTurn) return

    var manualStatus = document.querySelector('.manual-mode')

    if (!gMinePlaced) !gManualMode ? gManualMode = true : gManualMode = false

    if (gManualMode) manualStatus.innerHTML = MANUAL_ON
    else manualStatus.innerHTML = MANUAL_OFF
    for (var i = 0; i < difficulty().length; i++) {
        if (gLevel.mines === difficulty()[i].mines) gCurrMines = difficulty()[i].mines
    }
    if (gManualMode && !gMinePlaced) gLevel.mines = 0
    if (gManualMode && gMinePlaced) {
        manualStatus.innerHTML = MANUAL_OFF
        renderBoard(gBoard)
        gManualMode = false
    }
}

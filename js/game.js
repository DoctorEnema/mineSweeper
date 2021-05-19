'use strict'



const MINE = '<div class="mine"></div>'
const FLAG = '&'
const MARKED = '<div class="marked"></div>'

var gBoard;
var gLevel = {
    size: 6,
    mines: 2
}
var gGame = {
    isOn: false,
    state: '',
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gTimer



function init() {
    gGame.state = '😊'
    document.querySelector('.game-state').innerHTML = gGame.state
    gGame.isOn = true
    gBoard = createBoard(gLevel.size, gLevel.size)
    randomizeMines(gLevel.mines, gBoard)
    checkAllNegs(gBoard)
    renderBoard(gBoard)

    gGame.secsPassed = 0
    gGame.shownCount = 0
    gGame.markedCount = 0

    clearInterval(gTimer)
    gTimer = 0
    document.querySelector('.timer').innerHTML = gTimer


}

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
            // var currCell = board[i][j];
            var cellClass = getClassName({ i: i, j: j })
            strHTML += `<td class="cell ${cellClass}" onclick="cellClicked(${i},${j})" onmouseup="cellMarked(${i},${j})"">`


            strHTML += '</td>'
        }
        strHTML += '</tr>'
    }

    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML


}

function getClassName(locationObject) {
    var cellClass = `cell-${locationObject.i}-${locationObject.j}`
    return cellClass
}

function cellClicked(i, j) {
    if (!gGame.isOn) return
    if (!gGame.secsPassed) {
        gameTimer()
    }
    var targetCell = gBoard[i][j]
    var renderedCell = { i: i, j: j }
    if (targetCell.isShown) return
    if (targetCell.isMarked) return

    targetCell.isShown = true
    gGame.shownCount++
    setMinesNegsCount(i, j, gBoard)
    var minesNum = targetCell.minesAroundCount


    if (!targetCell.isMine) renderCell(renderedCell, 'revealed', minesNum)

    if (!minesNum) renderCell(renderedCell, 'revealed', null)

    if (targetCell.isMine) {
        renderCell(renderedCell, 'revealed', MINE)
        checkGameOver(false)
    }
    // console.log(gBoard.length ** 2, 'cells total');
    // console.log(gGame.shownCount, 'amount marked');
    // console.log(gLevel.mines);

    if (gGame.markedCount === gLevel.mines &&
        gGame.shownCount === (gBoard.length ** 2) - gLevel.mines) {
        checkGameOver(true)
    }
}

function cellMarked(i, j) {
    if (!gGame.isOn) return
    var targetCell = gBoard[i][j]
    var renderedCell = { i: i, j: j }
    if (event.which === 3) {
        if (targetCell.isShown) return
        targetCell.isMarked ? targetCell.isMarked = false : targetCell.isMarked = true
        if (targetCell.isMarked) renderCell(renderedCell, null, MARKED)
        else renderCell(renderedCell, null, null)
        if (targetCell.isMine && targetCell.isMarked) gGame.markedCount++
        if (targetCell.isMine && !targetCell.isMarked) gGame.markedCount--

        if (gGame.markedCount === gLevel.mines &&
            gGame.shownCount === (gBoard.length ** 2) - gLevel.mines) {
            checkGameOver(true)

        }
    }

}

function setMinesNegsCount(cellI, cellJ, board) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (cellJ === j && cellI === i) continue
            if (j < 0 || j >= board[i].length) continue
            var minesNum = board[cellI][cellJ].minesAroundCount
            if (!board[cellI][cellJ].minesAroundCount) {
                if (board[i][j].isMarked === true) continue
                if (!board[i][j].isShown) gGame.shownCount++
                renderCell({ i: i, j: j }, 'revealed', gBoard[i][j].minesAroundCount)
                board[i][j].isShown = true
            }
        }
    }
    return minesNum
}

function renderCell(locationObject, background, value) {
    var cellSelector = '.' + getClassName(locationObject)
    var elCell = document.querySelector(cellSelector)
    elCell.classList.add(background)
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
                    if (board[smallI][smallJ].isMine) board[j][i].minesAroundCount++
                    var minesNum = board[j][i].minesAroundCount
                }
            }
        }
    }
    return minesNum
}

function checkGameOver(victory) {
    gGame.isOn = false
    if (victory) gGame.state = '😎'
    else gGame.state = '🤯'
    document.querySelector('.game-state').innerHTML = gGame.state
}

function gameTimer() {
    gTimer = setInterval(function () {
        gGame.secsPassed++, document.querySelector('.timer').innerHTML = gGame.secsPassed
    }, 1000)
}

function randomizeMines(minesNum, board) {
    for (var i = 0; i < minesNum; i++) {
        var randomI = getRandomIntInclusive(0, board.length - 1)
        var randomJ = getRandomIntInclusive(0, board.length - 1)
        board[randomI][randomJ].isMine = true
    
    }
}


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

// function setMinesNegsCount(cellI, cellJ, board) {


//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= board.length) continue
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (cellJ === j && cellI === i) continue
//             if (j < 0 || j >= board[i].length) continue
//             if (board[i][j].isMine) board[cellI][cellJ].minesAroundCount++
//         }
//     }
//     var minesNum = board[cellI][cellJ].minesAroundCount
//     return minesNum
// }




// revealAll(gBoard)

// function revealAll(board) {
    // like setMinesNegsCount but bigger
//     for (var i = 0; i < board.length; i++) {
//         for (var j = 0; j < board.length; j++) {
//             if (board[i][j].minesAroundCount) continue

//             else renderCell({ i: i, j: j }, 'revealed', gBoard[i][j].minesAroundCount)
//         }

//     }
// }

// createBoard(matrix)
// function createBoard(mat) {
//     var cell = {
//         minesAroundCount: 0,
//         isShown: true,
//         isMine: false,
//         isMarked: true
//     }

//     for (var i = 0; i < mat.length; i++) {
//         for (var j = 0; j < mat.length[0]; j++) {

//             mat[i][j] = cell

//         }
//     }
//     console.table(mat)
// }
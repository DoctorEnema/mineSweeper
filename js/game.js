'use strict'



const MINE = '<div class="mine"></div>'
const FLAG = '&'
const EMPTY = ''
const MARKED = '<div class="marked"></div>'

var gBoard;
var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

init()
function init() {

    gBoard = createBoard(4, 4)
    renderBoard(gBoard)



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
            if (i === 2 && j === 2 || i === 3 && j === 3) cell.isMine = true
            board[i][j] = cell
        }
    }
    console.table(board)
    return board
}


function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j];
            var cellClass = getClassName({ i: i, j: j })

            // if (currCell.isShown) {
            //     strHTML += `<td class="cell ${cellClass} revealed" onclick="cellClicked(${i},${j})">`
            // } else
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

    var targetCell = gBoard[i][j]
    var renderedCell = { i: i, j: j }
    if (targetCell.isShown) return
    if (targetCell.isMarked) return

    targetCell.isShown = true

    setMinesNegsCount(i, j, gBoard)
    var minesNum = targetCell.minesAroundCount


    if (!targetCell.isMine) renderCell(renderedCell, 'revealed', minesNum)

    if (!minesNum) renderCell(renderedCell, 'revealed', null)

    if (targetCell.isMine) renderCell(renderedCell, 'revealed', MINE)
}



function cellMarked(i, j) {
    var targetCell = gBoard[i][j]
    var renderedCell = { i: i, j: j }
    if (event.which === 3) {
        if (targetCell.isShown) return
        var toggle = targetCell.isMarked ? targetCell.isMarked = false : targetCell.isMarked = true
        if (targetCell.isMarked) renderCell(renderedCell, null, MARKED)
        else renderCell(renderedCell, null, null)
    }

}
// if (event.which === 3) {
//     targetCell.isMarked = true
//     renderCell(renderedCell, 'revealed', MARKED)
// }
// if (event.which === 3) {
//     if (targetCell.isMarked) {
//         targetCell.isMarked = false
//         renderCell(renderedCell, 'revealed', null)
//     }
// }


function setMinesNegsCount(cellI, cellJ, board) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (cellJ === j && cellI === i) continue
            if (j < 0 || j >= board[i].length) continue
            var minesNum = board[cellI][cellJ].minesAroundCount
            if (!board[cellI][cellJ].minesAroundCount) {
                if (board[i][j].isMarked === true) continue
                renderCell({ i: i, j: j }, 'revealed', gBoard[i][j].minesAroundCount)
                board[i][j].isShown = true
            }
        }
    }
    return minesNum
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

function renderCell(locationObject, background, value) {
    var cellSelector = '.' + getClassName(locationObject)
    var elCell = document.querySelector(cellSelector)
    elCell.classList.add(background)
    elCell.innerHTML = value
}

checkAllNegs(gBoard)
function checkAllNegs(board) {
    for (var q = 0; q < board.length; q++) {
        for (var k = 0; k < board.length; k++) {

            for (var i = q - 1; i <= q + 1; i++) {
                if (i < 0 || i >= board.length) continue
                for (var j = k - 1; j <= k + 1; j++) {
                    if (k === j && q === i) continue
                    if (j < 0 || j >= board[i].length) continue
                    if (board[i][j].isMine) board[k][q].minesAroundCount++
                    var minesNum = board[k][q].minesAroundCount
                }
            }
        }
    }

    console.table(gBoard)
    return minesNum
}



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
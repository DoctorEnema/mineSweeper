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
        if (board[randomI][randomJ] === currCell) {
            i--
            continue
        }
        else board[randomI][randomJ].isMine = true
    }
}


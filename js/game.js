'use strict'

const MINE = '<img src="img/ms_mine2.png" />'
const MARKED = '<img src="img/ms_flag.png" />'

var gBoard;
var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: false,
    state: '',
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    hints: 3,
    safeClick: 3,
    score: 0,
}
var gSettingsState
var gTimer
var gFirstTurn = true
var gHintActive = false
var gHighScore = 0

function init() {
    gLevel.size
    gLevel.mines
    gFirstTurn = true
    gGame.state = '<img src="img/ms_3hp.png" />'
    document.querySelector('.game-state').innerHTML = gGame.state
    gGame.isOn = true
    gBoard = createBoard(gLevel.size, gLevel.size)
    renderBoard(gBoard)
    gGame.secsPassed = 0
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.lives = 3
    gGame.hints = 3
    gGame.score = 0
    gHintActive = false
    document.querySelector('.hint').innerHTML = '<img src="img/ms_hintoff.png" />' + gGame.hints
    gGame.safeClick = 3
    document.querySelector('.safe-click').innerHTML = '<img src="img/ms_halo.png" />' + gGame.safeClick
    document.querySelector('.high-score').innerText = localStorage.getItem('highScore')

    clearInterval(gTimer)
    gTimer = 0
    document.querySelector('.timer').innerHTML = gTimer
}

function cellClicked(i, j) {
    if (!gGame.isOn) return
    var targetCell = gBoard[i][j]

    if (gFirstTurn === true) {
        randomizeMines(gLevel.mines, gBoard, targetCell)
        checkAllNegs(gBoard)
        gameTimer()
    }
    gFirstTurn = false

    if (gHintActive) {
        displayHint(i, j, gBoard)
        return
    }

    var renderedCell = { i: i, j: j }
    if (targetCell.isShown) return
    if (targetCell.isMarked) return

    targetCell.isShown = true
    gGame.shownCount++
    gGame.score += 10

    setMinesNegsCount(i, j, gBoard)

    var minesNum = targetCell.minesAroundCount

    if (!targetCell.isMine) renderCell(renderedCell, 'revealed', minesNum)
    if (!minesNum) renderCell(renderedCell, 'revealed', null)
    if (targetCell.isMine) {
        renderCell(renderedCell, 'revealed', MINE)
        gGame.lives--
        setTimeout(function () {
            targetCell.isShown = false
            renderCell(renderedCell, 'revealed', null, true)
            gGame.shownCount--
            gGame.score -= 10
        }, 1000)
        if (gGame.lives === 2) gGame.state = '<img src="img/ms_2hp.png" />'
        if (gGame.lives === 1) gGame.state = '<img src="img/ms_1hp.png" />'
        document.querySelector('.game-state').innerHTML = gGame.state
        if (gGame.lives === 0) checkGameOver(false)
    }
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
        if (gFirstTurn) {
            gameTimer()
            randomizeMines(gLevel.mines, gBoard)
            checkAllNegs(gBoard)
        }
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
        gFirstTurn = false
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
                if (!board[i][j].isShown) {
                    gGame.shownCount++
                    gGame.score += 10
                }
                renderCell({ i: i, j: j }, 'revealed', gBoard[i][j].minesAroundCount)
                board[i][j].isShown = true
            }
        }
    }
    return minesNum
}

function checkGameOver(victory) {
    gGame.isOn = false
    clearInterval(gTimer)
    if (!victory) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                if (gBoard[i][j].isMine) renderCell({ i: i, j: j }, 'revealed', MINE)
            }
        }
        gGame.state = '<img src="img/ms_dead.png" />'
    }
    else gGame.state = '<img src="img/ms_win.png" />'
    document.querySelector('.game-state').innerHTML = gGame.state
    gGame.score += 100
    if (gGame.score >= gHighScore) gHighScore = gGame.score
    localStorage.setItem('highScore', gHighScore)

}

function gameTimer() {
    gTimer = setInterval(function () {
        gGame.secsPassed++, document.querySelector('.timer').innerHTML = gGame.secsPassed
    }, 1000)
}

function activateHint() {
    if (gGame.hints === 0) return
    !gHintActive ? gHintActive = true : gHintActive = false
    if (gHintActive) {
        document.querySelector('.hint').innerHTML = '<img src="img/ms_hinton.png" />' + gGame.hints
    } else {
        document.querySelector('.hint').innerHTML = '<img src="img/ms_hintoff.png" />' + gGame.hints
    }
}

function displayHint(cellI, cellJ, board) {
    if (gGame.hints === 0) {
        gHintActive = false
        return
    }
    gGame.hints--
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue

            var minesNum = board[i][j].minesAroundCount

            if (!minesNum) renderCell({ i: cellI, j: cellJ }, 'revealed', null)
            renderCell({ i: i, j: j }, 'revealed', minesNum)
            if (board[i][j].isMine) renderCell({ i: i, j: j }, 'revealed', MINE)
        }
    }
    gHintActive = false

    setTimeout(function () {
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= board.length) continue
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (j < 0 || j >= board[i].length) continue

                if (board[i][j].isShown === false) renderCell({ i: i, j: j }, 'revealed', null, true)
                if (board[i][j].isMarked) renderCell({ i: i, j: j }, 'revealed', MARKED, true)
            }
        }
        document.querySelector('.hint').innerHTML = '<img src="img/ms_hintoff.png" />' + gGame.hints
    }, 1000)
}

function safeClick() {
    if (gGame.safeClick === 0) return
    var safeCellsI = []
    var safeCellsJ = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].isMarked && !gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                safeCellsI.push(i)
                safeCellsJ.push(j)
            }
        }
    }
    var safeIdx = getRandomIntInclusive(0, safeCellsI.length)
    renderCell({ i: safeCellsI[safeIdx], j: safeCellsJ[safeIdx] }, 'safe-cell', '<img src="img/ms_halo.png" />')
    setTimeout(function () {
        renderCell({ i: safeCellsI[safeIdx], j: safeCellsJ[safeIdx] }, 'safe-cell', null, true)
        gGame.safeClick--
        document.querySelector('.safe-click').innerHTML = '<img src="img/ms_halo.png" />' + gGame.safeClick
    }, 1500)
}



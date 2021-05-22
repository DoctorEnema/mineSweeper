'use strict'

const MINE = '<img src="img/ms_mine2.png" />'
const MARKED = '<img src="img/ms_flag.png" />'
const HINT_ON = '<img src="img/ms_hinton.png" />'
const HINT_OFF = '<img src="img/ms_hintoff.png" />'
const SAFE_CLICK = '<img src="img/ms_halo.png" />'
const MANUAL_OFF = '<img src="img/ms_bp1.png" />'
const MANUAL_ON = '<img src="img/ms_bp2.png" />'
const MANUAL_CONFIRM = '<img src="img/ms_v.png" />'

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
var gSettings
var gManualMode
var gTimer
var gFirstTurn = true
var gHintActive = false
var gHighScore = 0
var gMinePlaced = false
var gCurrMines

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
    gGame.safeClick = 3
    gGame.score = 0
    gHintActive = false
    gManualMode = false
    gMinePlaced = false
    gSettings = false
    document.querySelector('.difficulty').style.display = 'none'
    document.querySelector('.manual-mode').innerHTML = MANUAL_OFF
    document.querySelector('.hint').innerHTML = HINT_OFF + gGame.hints
    document.querySelector('.safe-click').innerHTML = SAFE_CLICK + gGame.safeClick
    document.querySelector('.high-score').innerText = localStorage.getItem('highScore')

    clearInterval(gTimer)
    gTimer = 0
    document.querySelector('.timer').innerHTML = gTimer
}

function cellClicked(i, j) {
    if (!gGame.isOn) return
    var targetCell = gBoard[i][j]
    var shownCell = { i: i, j: j }

    if (gManualMode) {
        targetCell.isMine = true
        renderCell(shownCell, 'revealed', MINE)
        gMinePlaced = true
        gLevel.mines++
        document.querySelector('.manual-mode').innerHTML = MANUAL_CONFIRM
        return
    }

    if (gFirstTurn && !gMinePlaced) {
        if (!gLevel.mines) gLevel.mines = gCurrMines
        randomizeMines(gLevel.mines, gBoard, targetCell)
        checkAllNegs(gBoard)
        gameTimer()
        gFirstTurn = false
    }
    if (gFirstTurn && gMinePlaced) {
        checkAllNegs(gBoard)
        gameTimer()
        gFirstTurn = false
    }

    if (gHintActive) {
        displayHint(i, j, gBoard)
        return
    }

    if (targetCell.isShown) return
    if (targetCell.isMarked) return

    targetCell.isShown = true
    gGame.shownCount++
    gGame.score += 10

    if (!targetCell.isMine && targetCell.minesAroundCount === null) setMinesNegsCount(i, j, gBoard)

    var minesNum = targetCell.minesAroundCount

    if (!targetCell.isMine) renderCell(shownCell, 'revealed', minesNum)
    if (!minesNum) renderCell(shownCell, 'revealed', null)
    if (targetCell.isMine) {
        renderCell(shownCell, 'revealed', MINE)
        gGame.lives--
        setTimeout(function () {
            targetCell.isShown = false
            renderCell(shownCell, 'revealed', null, true)
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
        if (gFirstTurn && !gMinePlaced) {
            randomizeMines(gLevel.mines, gBoard, targetCell)
            checkAllNegs(gBoard)
            gameTimer()
            gFirstTurn = false
        }
        if (gFirstTurn && gMinePlaced) {
            checkAllNegs(gBoard)
            gameTimer()
            gFirstTurn = false
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

            if (board[i][j].isMarked) {
                !board[i][j].isMarked
                gGame.mark--
            }

            if (board[i][j].isMine || board[i][j].isShown) continue
            else {
                renderCell({ i: i, j: j }, 'revealed', gBoard[i][j].minesAroundCount)
                board[i][j].isShown = true
                gGame.shownCount++
                gGame.score += 10
            }
            if (board[i][j].minesAroundCount === null) setMinesNegsCount(i, j, board)

        }
    }
}

function activateHint() {
    if (gGame.hints === 0) return
    !gHintActive ? gHintActive = true : gHintActive = false
    if (gHintActive) {
        document.querySelector('.hint').innerHTML = HINT_ON + gGame.hints
    } else {
        document.querySelector('.hint').innerHTML = HINT_OFF + gGame.hints
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
        document.querySelector('.hint').innerHTML = HINT_OFF + gGame.hints
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
    var safeCellI = safeCellsI[safeIdx]
    var safeCellJ = safeCellsJ[safeIdx]
    if(safeCellsI.length === 0) return
    renderCell({ i: safeCellI, j: safeCellJ }, 'safe-cell', SAFE_CLICK)
    gGame.safeClick--
    document.querySelector('.safe-click').innerHTML = SAFE_CLICK + gGame.safeClick
    setTimeout(function () {
        renderCell({ i: safeCellI, j: safeCellJ }, 'safe-cell', null, true)
        if (gBoard[safeCellI][safeCellJ].isShown) {
            renderCell({ i: safeCellI, j: safeCellJ }, 'safe-cell', gBoard[safeCellI][safeCellJ].minesAroundCount, true)
        }
    }, 1500)
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


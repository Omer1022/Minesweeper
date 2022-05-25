'use strict'

function findEmptyCells() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isMine && !currCell.isFirstClick) {
                emptyCells.push({ i, j })
            }
        }
    }
    return emptyCells
}


function minesAroundCount(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (i === pos.i && j === pos.j) continue;
            gBoard[i][j].minesAround++
        }
    }
}


function randMine() {
    var emptyCells = findEmptyCells()
    var randIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randIdx]
}


function randMines(num) {
    for (var i = 0; i < num; i++) {
        var mine = randMine()
        gBoard[mine.i][mine.j].isMine = true
    }
}


function setMines() {
    randMines(gLevel.mines)
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) minesAroundCount({ i, j })
        }
    }
}


function revealMines() {
    var mines = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine && !currCell.isShown) {
                mines.push({ i, j })
            }
        }
    }
    return mines
}
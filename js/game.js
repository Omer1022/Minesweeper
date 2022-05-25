"use strict";

const MINE = "💣";
const FLAG = "🚩";

var gBoard;
var gLevel = {
    size: 4,
    mines: 2,
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    minesShown: 0,
};
var gLives = 3;
var gTimerIntervalId;
var gClickCount = 0;


function init() {
    gBoard = createBoard(gLevel.size);
    renderBoard(gBoard);
    clearInterval(gTimerIntervalId);
    gGame.isOn = true;
    gGame.minesShown = 0;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gLives = 3;
    gClickCount = 0;
    updateLives();
    gameStatus("start");
}


function rightButtonClicked(rbc) {
    var rightClick = false;
    if (rbc.which) {
        rightClick = rbc.which === 3;
    } else if (rbc.button) {
        rightClick = rbc.button === 2;
    }
    return rightClick;
}


function leftButtonClicked(elCell, i, j) {
    if (gBoard[i][j].isMarked) return;
    elCell.style.backgroundColor = "white";
    gBoard[i][j].isShown = true;
    if (!gBoard[i][j].isMine) {
        displayNumCell(elCell, i, j);
    } else {
        mineClicked(elCell);
    }
}


function mouseDown(rbc, elCell, i, j) {
    if (gBoard[i][j].isShown) return;
    if (!gGame.isOn) return;
    gClickCount++;

    if (gClickCount === 1) {
        gGame.isOn = true;
        gTimerIntervalId = setInterval(timer, 1000);
        gBoard[i][j].isFirstClick = true;
        setMines();
    }

    if (rightButtonClicked(rbc)) {
        if (!gBoard[i][j].isMarked) {
            cellMarked(elCell, i, j);
            return;
        } else {
            unCellMarked(elCell, i, j);
            return;
        }
    } else {
        leftButtonClicked(elCell, i, j);
    }
    checkGameOver();
}


function mineClicked(elCell) {
    elCell.innerText = MINE;
    gLives--;
    elCell.style.backgroundColor = "red";
    updateLives();
    gGame.minesShown++;
    if (gLives === 0) {
        var allMines = revealMines();
        for (var i = 0; i < allMines.length; i++) {
            var elMine = document.getElementById(
                `cell-${allMines[i].i}-${allMines[i].j}`
            );
            elMine.style.backgroundColor = "white";
            elMine.innerText = MINE;
        }
        clearInterval(gTimerIntervalId);
        gameStatus("lose");
        gGame.isOn = false;
    }
}


function cellMarked(elCell, i, j) {
    var elSpan = elCell.querySelector("span");
    gBoard[i][j].isMarked = true;
    elSpan.innerText = FLAG;
    elCell.classList.add("marked");
    gGame.markedCount++;
    if (gBoard[i][j].isMine) gGame.minesShown++;
    checkGameOver();
}


function unCellMarked(elCell, i, j) {
    var elSpan = elCell.querySelector("span");
    if (gBoard[i][j].isMine) {
        elSpan.innerText = MINE;
        gGame.minesShown--;
    } else {
        elSpan.innerText = gBoard[i][j].minesAround;
    }
    elSpan.style.display = "none";
    gBoard[i][j].isMarked = false;
    elCell.classList.remove("marked");
}


function updateLives() {
    var numLives = document.querySelector(".lives span");
    if (gLives === 3) numLives.innerText = "❤️❤️❤️";
    if (gLives === 2) numLives.innerText = "❤️❤️";
    if (gLives === 1) numLives.innerText = "❤️";
    if (gLives === 0) numLives.innerText = "";
}


function gameStatus(status) {
    var elStatus = document.querySelector(".status");
    if (status === "start") elStatus.innerText = "Play Again 😃";
    if (status === "lose") elStatus.innerText = "Play Again 🤯";
    if (status === "win") elStatus.innerText = "Play Again 😎";
}


function setLevel(size, mines) {
    gLevel.size = size;
    gLevel.mines = mines;
    init();
}


function checkGameOver() {
    var cells = gLevel.size ** 2;
    if (gGame.shownCount + gGame.minesShown === cells) {
        gameWon();
    }
}


function gameWon() {
    gGame.isOn = false;
    clearInterval(gTimerIntervalId);
    var score = gGame.secsPassed;
    var elTimer = document.querySelector(".timer");
    elTimer.innerText = `Score: ${score}`;
    gameStatus("win");
}


function displayNumCell(elCell, i, j) {
    var numCell = gBoard[i][j].minesAround;
    elCell.innerText = numCell ? numCell : "";
    if (numCell === 1) elCell.style.color = "blue";
    if (numCell === 2) elCell.style.color = "green";
    if (numCell === 3) elCell.style.color = "red";
    gGame.shownCount++;

    var neighbors = checkNeighbors({ i, j });
    if (neighbors) {
        for (var x = 0; x < neighbors.length; x++) {
            var elCurrCell = document.getElementById(
                `cell-${neighbors[x].i}-${neighbors[x].j}`
            );
            elCurrCell.style.backgroundColor = "white";
            gBoard[neighbors[x].i][neighbors[x].j].isShown = true;
            var numCell2 = gBoard[neighbors[x].i][neighbors[x].j].minesAround;
            elCurrCell.innerText = numCell2 ? numCell2 : "";
            if (numCell2 === 1) elCurrCell.style.color = "blue";
            if (numCell2 === 2) elCurrCell.style.color = "green";
            if (numCell2 === 3) elCurrCell.style.color = "red";
            gGame.shownCount++;
        }
    }
}


function checkNeighbors(pos) {
    var neighbors = [];
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            var currCell = gBoard[i][j];
            if (j < 0 || j >= gBoard[0].length) continue;
            if (i === pos.i && j === pos.j) continue;
            if (currCell.isMine) return null;
            if (currCell.isShown) continue;
            neighbors.push({ i, j });
        }
    }
    return neighbors;
}


function timer() {
    gGame.secsPassed++;
    var elTimer = document.querySelector(".timer");
    elTimer.innerText = "Timer: " + gGame.secsPassed;
}
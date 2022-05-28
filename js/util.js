"use strict";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function safeClick(elBtn) {
  if (!gClickCount) return;
  if (!gSafeClicks) return;
  gSafeClicks--;
  displaySafeClicksNum();
  var emptyCells = findSafeCells();
  var randIdx = getRandomInt(0, emptyCells.length);
  var safeCell = emptyCells[randIdx];
  var elCell = document.getElementById(`cell-${safeCell.i}-${safeCell.j}`);
  displayNumCell(elCell, safeCell.i, safeCell.j);
  elCell.style.backgroundColor = "white";
}

function displaySafeClicksNum() {
  var clicksLeft = document.querySelector(".num-safe");
  clicksLeft.innerText = gSafeClicks;
}

function findSafeCells() {
  var emptyCells = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      var currCell = gBoard[i][j];
      if (!currCell.isMine && !currCell.isShown) {
        emptyCells.push({ i, j });
      }
    }
  }
  return emptyCells;
}

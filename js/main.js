'use strict';

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cells = document.querySelectorAll('[data-cell]');
const statusText = document.querySelector('.status');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const scoreDraw = document.getElementById('score-draw');
const resetRoundButton = document.getElementById('reset-round');
const newGameButton = document.getElementById('new-game');

let board = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;
const scores = {
  X: 0,
  O: 0,
  draw: 0,
};

function updateStatus(message) {
  statusText.textContent = message;
}

function updateScores() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreDraw.textContent = scores.draw;
}

function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus(`Player ${currentPlayer}'s turn`);
}

function setBoardDisabled(disabled) {
  cells.forEach(cell => {
    cell.disabled = disabled || cell.textContent !== '';
  });
}

function checkWinner() {
  return winPatterns.some(pattern =>
    pattern.every(index => board[index] === currentPlayer)
  );
}

function resetBoard() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.disabled = false;
  });

  updateStatus(`Player ${currentPlayer}'s turn`);
}

function resetGame() {
  scores.X = 0;
  scores.O = 0;
  scores.draw = 0;
  updateScores();
  resetBoard();
}

function handleCellClick(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);

  if (!gameActive || board[index] !== '') {
    return;
  }

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.disabled = true;

  if (checkWinner()) {
    scores[currentPlayer] += 1;
    updateScores();
    updateStatus(`Player ${currentPlayer} wins!`);
    gameActive = false;
    setBoardDisabled(true);
    return;
  }

  if (board.every(value => value !== '')) {
    scores.draw += 1;
    updateScores();
    updateStatus('Round ended in a draw.');
    gameActive = false;
    setBoardDisabled(true);
    return;
  }

  switchPlayer();
}

cells.forEach((cell, index) => {
  cell.dataset.index = String(index);
  cell.addEventListener('click', handleCellClick);
});

resetRoundButton.addEventListener('click', resetBoard);
newGameButton.addEventListener('click', resetGame);

updateScores();
resetBoard();

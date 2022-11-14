'use strict';

const winList = [
  ['aa', 'bb', 'cc'],
  ['ac', 'bb', 'ca'],
  ['aa', 'ab', 'ac'],
  ['ba', 'bb', 'bc'],
  ['ca', 'cb', 'cc'],
  ['aa', 'ba', 'ca'],
  ['ab', 'bb', 'cb'],
  ['ac', 'bc', 'cc'],
];

const players = document.querySelectorAll('.player');
const cubes = document.querySelectorAll('.cube');
const scoures = document.querySelectorAll('.player-scoure');
const round = document.querySelector('.round-number');
const btnNew = document.querySelector('.btn');

btnNew.addEventListener('click', newSetGame);

let player1Selections = [];
let player2Selections = [];
let scoureCounter = [0, 0];

cubes.forEach(cube => {
  cube.addEventListener('click', e => {
    e.preventDefault();
    e.srcElement.textContent = '.';
    putTheSign(e.srcElement);
    selectedPlayerValue(e.srcElement);
    switchPlayer(players);
    round.textContent = `Round ${
      player1Selections.length + player2Selections.length + 1
    }`;

    // console.log(e.srcElement);
  });
});

function newSetGame() {
  player1Selections = [];
  player2Selections = [];

  cubes.forEach(cube => {
    if (cube.firstChild.textContent !== '.') {
      cube.innerHTML = `<span>.</span>`;
    }
  });

  round.textContent = `Round ${
    player1Selections.length + player2Selections.length + 1
  }`;

  players[0].classList.contains('winner')
    ? players[0].classList.remove('winner')
    : players[1].classList.remove('winner');

  btnNew.classList.add('hidden');
}

function switchPlayer(players) {
  players.forEach(player => {
    player.classList.contains('active-player')
      ? player.classList.remove('active-player')
      : player.classList.add('active-player');
  });
}

function putTheSign(srcElement) {
  srcElement.textContent = players[0].classList.contains('active-player')
    ? 'X'
    : 'O';
}

function selectedPlayerValue(srcElement) {
  players[0].classList.contains('active-player')
    ? player1Selections.push(srcElement.value)
    : player2Selections.push(srcElement.value);

  if (player1Selections.length + player2Selections.length + 1 > 5)
    checkEndGame(player1Selections, player2Selections);
}

function winnerWinnerchikenDinner(win, Selections1, Selections2) {
  if (
    Selections1.includes(win[0]) &&
    Selections1.includes(win[1]) &&
    Selections1.includes(win[2])
  ) {
    switchPlayer(players);
    players[0].classList.add('winner');
    scoureCounter[0]++;
    scoures[0].textContent = scoureCounter[0];
    btnNew.classList.remove('hidden');
  }

  if (
    Selections2.includes(win[0]) &&
    Selections2.includes(win[1]) &&
    Selections2.includes(win[2])
  ) {
    switchPlayer(players);

    players[1].classList.add('winner');
    scoureCounter[1]++;
    scoures[1].textContent = scoureCounter[1];
    btnNew.classList.remove('hidden');
  }
}

function checkEndGame(Selections1, Selections2) {
  [...winList].forEach(win =>
    winnerWinnerchikenDinner(win, Selections1, Selections2)
  );
}

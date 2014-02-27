/* global document, alert, setTimeout, localStorage */
'use strict';

var mines, width, height;
var game, guesses, initGame, nodes;

function saveGame() {
  localStorage.minesweeper = JSON.stringify({options: {width: width, height: height, mines: mines}, game: game});
}

function loadGame() {
  try {
    var load = JSON.parse(localStorage.minesweeper);
    if (load.game) {
      document.getElementById('width').value = load.options.width;
      document.getElementById('height').value = load.options.height;
      document.getElementById('mines').value = load.options.mines;
    }
    return load.game;
  } catch (e) {
    return undefined;
  }
}

function superman() {
  var opacity = document.getElementById('superman').checked ? 0.5: 1;
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].style.opacity = opacity;
  }
}

function updateFlagsLeft() {
  document.getElementById('flags-left').innerHTML = 'Flags left: ' + (mines - guesses.good - guesses.bad);
}

function invokeNeighbors(i, callback) {
  function callbackCheckBoundaries(x) {
    if (x >= 0 && x < game.length) {
      callback(x);
    }
  }

  if (i % width !== 0) {
    callbackCheckBoundaries(i - 1);
    callbackCheckBoundaries(i - width - 1);
    callbackCheckBoundaries(i + width - 1);
  }
  if (i % width !== width - 1) {
    callbackCheckBoundaries(i + 1);
    callbackCheckBoundaries(i - width + 1);
    callbackCheckBoundaries(i + width + 1);
  }
  callbackCheckBoundaries(i - width);
  callbackCheckBoundaries(i + width);
}

function revealBlocks(i) {
  if (!game[i].revealed && !game[i].flagged) {
    nodes[i].style.display = 'none';
    if (game[i].value === '*') {
      setTimeout(function () {
        alert('You lose!!!');
        initGame();
      }, 10);
    } else {
      game[i].revealed = true;
      if (game[i].value === 0) {
        invokeNeighbors(i, revealBlocks);
      }
    }
  }
}

function handleDblClick(i) {
  var flags = 0;
  invokeNeighbors(i, function (x) {
    flags += (game[x].flagged ? 1 : 0);
  });
  if (flags >= game[i].value) {
    invokeNeighbors(i, revealBlocks);
  }
  saveGame();
}

function handleClick(i, e) {
  if (e.shiftKey) {
    if (guesses.good + guesses.bad === mines) {
      alert('No more flags left!!!');
    } else {
      game[i].flagged = !game[i].flagged;
      nodes[i].innerHTML = (game[i].flagged ? 'Flag' : '');
      guesses[game[i].value === '*' ? 'good' : 'bad'] += (game[i].flagged ? 1 : -1);
      if (guesses.good === mines) {
        setTimeout(function () {
          alert('You win!!!');
          initGame();
        }, 10);
      }
      updateFlagsLeft();
    }
  } else {
    revealBlocks(i);
  }
  saveGame();
}

function createRow() {
  var str = '';
  for (var i = 0; i < width; i++) {
    str += '<td><span></span><div></div></td>';
  }
  return str;
}

function createBoard() {
  var str = '';
  for (var i = 0; i < height; i++) {
    str += '<tr>' + createRow() + '</tr>';
  }
  return str;
}

function newGame() {
  var game = [];

  function updateCell(i) {
    if (game[i].value !== '*') {
      game[i].value++;
    }
  }

  for (var i = 0; i < width * height; i++) {
    game[i] = {value: 0, revealed: false, flagged: false};
  }

  for (i = 0; i < mines; i++) {
    var x = Math.floor(Math.random() * game.length);
    if (game[x].value !== '*') {
      game[x].value = '*';
      invokeNeighbors(x, updateCell);
    } else {
      i--;
    }
  }

  return game;
}

initGame = function (loadedGame) {
  document.getElementById('width').value = width = parseInt(document.getElementById('width').value) || 0;
  document.getElementById('height').value = height = parseInt(document.getElementById('height').value) || 0;
  document.getElementById('mines').value = mines = Math.min(width * height, parseInt(document.getElementById('mines').value) || 0);
  game = loadedGame || newGame();
  saveGame();

  document.getElementById('game').innerHTML = createBoard();
  var cells = document.getElementsByTagName('span');
  guesses = {good: 0, bad: 0};
  mines = 0;
  nodes = [];

  for (var i = 0; i < cells.length; i++) {
    if (game[i].flagged) {
      guesses[game[i].value === '*' ? 'good' : 'bad']++;
    }
    if (game[i].value === '*') {
      mines++;
    }
    cells[i].innerHTML = game[i].value || '';
    nodes[i] = cells[i].parentNode.children[1];
    nodes[i].style.display = game[i].revealed ? 'none' : 'block';
    nodes[i].innerHTML = game[i].flagged ? 'Flag' : '';
    nodes[i].parentNode.onclick = handleClick.bind(undefined, i);
    nodes[i].parentNode.ondblclick = handleDblClick.bind(undefined, i);
  }
  superman();
  updateFlagsLeft();
};

initGame(loadGame());

/* global document, alert, setTimeout */
'use strict';

var mines = 6, width = 10, height = 8;
var game, goodGuesses, badGuesses, initGame;

function updateFlagsLeft() {
  document.getElementById('flags-left').innerHTML = 'Flags left: ' + (mines - goodGuesses - badGuesses);
}

function revealBlocks(i) {
  if (i >= 0 && i < width * height) {
    if (game[i].value === 0 && game[i].node.style.display !== 'none') {
      var x = i;
      game[i].node.style.display = 'none';
      if (x % width !== 0) {
        revealBlocks(x - 1);
        revealBlocks(x - width - 1);
        revealBlocks(x + width - 1);
      }
      if (x % width !== width - 1) {
        revealBlocks(x + 1);
        revealBlocks(x - width + 1);
        revealBlocks(x + width + 1);
      }
      revealBlocks(x - width);
      revealBlocks(x + width);
    } else if (game[i].value !== '*') {
      game[i].node.style.display = 'none';
    }
  }
}

function handleClick(i, e) {
  if (e.shiftKey) {
    if (goodGuesses + badGuesses === mines) {
      alert('No more flags left!!!');
    } else {
      game[i].node.innerHTML = (game[i].node.innerHTML ? '' : 'Flag');
      if (game[i].value === '*') {
        goodGuesses += (game[i].node.innerHTML ? 1 : -1);
      } else {
        badGuesses += (game[i].node.innerHTML ? 1 : -1);
      }
      if (goodGuesses === mines) {
        setTimeout(function () {
          alert('You win!!!');
          initGame();
        }, 10);
      }
      updateFlagsLeft();
    }
  } else {
    if (game[i].value === '*') {
      game[i].node.style.display = 'none';
      setTimeout(function () {
        alert('You lose!!!');
        initGame();
      }, 10);
    } else {
      revealBlocks(i);
    }
  }
}

function updateCell(i) {
  if (i >= 0 && i < width * height && game[i].value !== '*') {
    game[i].value = game[i].value || 0;
    game[i].value++;
  }
}

initGame = function () {
  game = [];
  goodGuesses = 0;
  badGuesses = 0;

  for (var i = 0; i < width * height; i++) {
    game[i] = {value: 0};
  }

  for (var generate = mines; generate > 0; generate--) {
    var x = Math.floor(Math.random() * width * height);
    if (game[x].value !== '*') {
      game[x] = {value: '*'};
      if (x % width !== 0) {
        updateCell(x - 1);
        updateCell(x - width - 1);
        updateCell(x + width - 1);
      }
      if (x % width !== width - 1) {
        updateCell(x + 1);
        updateCell(x - width + 1);
        updateCell(x + width + 1);
      }
      updateCell(x - width);
      updateCell(x + width);
    } else {
      generate++;
    }
  }

  var cells = document.getElementsByTagName('span');
  for (i = 0; i < cells.length; i++) {
    cells[i].innerHTML = game[i].value || '';
    game[i].node = cells[i].parentNode.children[1];
    game[i].node.style.display = 'block';
    game[i].node.innerHTML = '';
    cells[i].parentNode.onclick = handleClick.bind(undefined, i);
  }

  updateFlagsLeft();
};

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

document.getElementById('game').innerHTML = createBoard();
initGame();

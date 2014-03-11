'use strict';

var readline = require('readline');
var width, winningPositions;

function newGame() {
  var game = [];
  for (var i = 0; i < width * width; i++) {
    game[i] = ' ';
  }
  return game;
}

function gameToInt(game, player) {
  return parseInt(game.map(function (cell) {
    return cell === player ? '1' : '0';
  }).join(''), 2);
}

function generateWinningPositions() {
  var winningPositions = [];

  var gameD1 = newGame(), gameD2 = newGame();
  for (var i = 0; i < width; i++) {
    var gameH = newGame(), gameV = newGame();
    gameD1[i + (i * width)] = 'X';
    gameD2[width - i - 1 + (i * width)] = 'X';
    for (var j = 0; j < width; j++) {
      gameH[(i * width) + j] = 'X';
      gameV[i + (j * width)] = 'X';
    }
    winningPositions.push(gameToInt(gameH, 'X'));
    winningPositions.push(gameToInt(gameV, 'X'));
  }
  winningPositions.push(gameToInt(gameD1, 'X'));
  winningPositions.push(gameToInt(gameD2, 'X'));

  return winningPositions;
}

function isWinner(game, player) {
  var gameInt = gameToInt(game, player);
  return winningPositions.some(function (position) {
    return ((position & gameInt) === position);
  });
}

function opponent(player) {
  return (player === 'X' ? 'O' : 'X');
}

function getNextMove(game, me, player, depth) {
  var bestMove;
  depth = depth || 0;
  player = player || me;

  if (isWinner(game, me)) {
    return {score: (width * width + 1) - depth};
  } else if (isWinner(game, opponent(me))) {
    return {score: depth - (width * width + 1)};
  } else if (game.indexOf(' ') === -1) {
    return {score: 0};
  }

  for (var i = 0; i < width * width; i++) {
    if (game[i] === ' ') {
      var move = game.slice(0);
      move[i] = player;
      var score = getNextMove(move, me, opponent(player), depth + 1).score;
      if (player === me) {
        if (!bestMove || score > bestMove.score) {
          bestMove = {score: score, move: move};
        }
      } else {
        if (!bestMove || score < bestMove.score) {
          bestMove = {score: score, move: move};
        }
      }
    }
  }
  return bestMove;
}

function printGame(game) {
  for (var i = 0; i < width; i++) {
    console.log('| ' + game.slice(i * width, (i * width) + width).join(' | ') + ' |');
  }
  console.log('');
  console.log('"' + game.join('') + '"');
  console.log('');
}

var rl = readline.createInterface({input: process.stdin, output: process.stdout});
rl.question('Please enter string (OO XX OOX)\n', function (answer) {
  try {
    width = Math.sqrt(answer.length);
    if (width !== Math.floor(width)) {
      throw 'invalid game size (sqrt is not an int)';
    }
    if (answer.match(/[^ OX]/)) {
      throw 'invalid characters in game...';
    }
    winningPositions = generateWinningPositions();

    var xs = answer.match(/X/g), os = answer.match(/O/g);
    xs = (xs && xs.length) || 0;
    os = (os && os.length) || 0;

    var player = (xs === os ? 'X' : 'O');
    if (xs !== os && xs !== os + 1) {
      throw 'invalid state (XO mismatch)';
    }

    var nextMove = getNextMove(answer.split(''), player).move;
    if (nextMove) {
      printGame(nextMove);
    } else {
      throw 'game over!';
    }
  } catch (e) {
    console.log('bad input man... ', e);
  }
  rl.close();
});

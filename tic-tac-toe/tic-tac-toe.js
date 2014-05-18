'use strict';

var width, winningPositions, debug;

function newGame() {
  var game = [];
  for (var i = 0; i < width * width; i++) {
    game[i] = '#';
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
    return {score: (width * width + 1) - depth, status: 'WIN'};
  } else if (isWinner(game, opponent(me))) {
    return {score: depth - (width * width + 1), status: 'LOOSE'};
  } else if (game.indexOf('#') === -1) {
    return {score: 0, status: 'DRAW'};
  }

  for (var i = 0; i < width * width; i++) {
    if (game[i] === '#') {
      var move = game.slice(0);
      move[i] = player;
      var next = getNextMove(move, me, opponent(player), depth + 1);
      next = {score: next.score, move: move, status: (depth === 0 ? next.status : 'CONTINUE')};
      if (player === me) {
        if (!bestMove || next.score > bestMove.score) {
          bestMove = next;
        }
      } else {
        if (!bestMove || next.score < bestMove.score) {
          bestMove = next;
        }
      }
    }
  }
  return bestMove;
}

function printGame(game, status) {
  if (debug) {
    for (var i = 0; i < width; i++) {
      console.log('| ' + game.slice(i * width, (i * width) + width).join(' | ') + ' |');
    }
  }
  console.log(game.join(''));
  console.log(status);
}

try {
  var current = process.argv[2];
  debug = (process.argv[3] === 'debug');

  width = Math.sqrt(current.length);
  if (width !== Math.floor(width)) {
    throw 'invalid game size (sqrt is not an int)';
  }
  if (current.match(/[^#OX]/)) {
    throw 'invalid characters in game...';
  }

  if (debug) {
    winningPositions = generateWinningPositions();
  } else {
    winningPositions = [448, 292, 56, 146, 7, 73, 273, 84];
  }

  var xs = current.match(/X/g), os = current.match(/O/g);
  xs = (xs && xs.length) || 0;
  os = (os && os.length) || 0;

  var player = (xs === os ? 'X' : 'O');
  if (xs !== os && xs !== os + 1) {
    throw 'invalid state (XO mismatch)';
  }

  if (os === 0) {
    current = current.split('');
    if (xs === 0) {
      current[0] = 'X';
    } else {
      current[current[4] === '#' ? 4 : 0] = 'O';
    }
    printGame(current, 'CONTINUE');
  } else {
    var nextMove = getNextMove(current.split(''), player);
    if (nextMove.move) {
      printGame(nextMove.move, nextMove.status);
    } else {
      throw 'game over!';
    }
  }
} catch (e) {
  console.log('bad input man... ', e);
}

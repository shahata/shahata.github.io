'use strict';

var width, winningPositions;

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
  // for (var i = 0; i < width; i++) {
  //   console.log('| ' + game.slice(i * width, (i * width) + width).join(' | ') + ' |');
  // }
  // console.log('');
  console.log(game.join(''));
  console.log(status);
}

var solution = {};
function generateAllGames(game, player) {
  var key;
  game = game || '#########'.split('');
  player = player || 'X';

  key = game.join('');
  if (!solution[key] && !solution[key.split('').reverse().join('')]) {
    solution[key] = getNextMove(game, player);
    if (solution[key].move) {
      solution[key] = [solution[key].move.join(''), solution[key].status];
      for (var i = 0; i < width * width; i++) {
        if (game[i] === '#') {
          game[i] = player;
          generateAllGames(game, opponent(player));
          game[i] = '#';
        }
      }
    } else {
      delete solution[key];
    }
  }
}

try {
  var current = process.argv[2];

  if (current === 'solution') {
    var jsBeautify = 'js_beautify';
    var beautify = require('js-beautify')[jsBeautify];
    var code = 'var solution = {};\n' +
               'var result = solution[process.argv[2]];\n' +
               'if (!result) {\n' +
               '  result = solution[process.argv[2].split(\'\').reverse().join(\'\')]\n;' +
               '  result[0] = result[0].split(\'\').reverse().join(\'\')\n;' +
               '}\n' +
               'console.log(result.join(\'\\n\'));\n';
    width = 3;
    winningPositions = generateWinningPositions();
    generateAllGames();
    console.log(beautify(code.replace('{}', JSON.stringify(solution)).replace(/"/g, '\''), {'indent_size': 2}));
  } else {
    width = Math.sqrt(current.length);
    if (width !== Math.floor(width)) {
      throw 'invalid game size (sqrt is not an int)';
    }
    if (current.match(/[^#OX]/)) {
      throw 'invalid characters in game...';
    }

    winningPositions = generateWinningPositions();

    var xs = current.match(/X/g), os = current.match(/O/g);
    xs = (xs && xs.length) || 0;
    os = (os && os.length) || 0;

    var player = (xs === os ? 'X' : 'O');
    if (xs !== os && xs !== os + 1) {
      throw 'invalid state (XO mismatch)';
    }

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

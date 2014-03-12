'use strict';
var _ = require('lodash');

function addMove(moves, game, opponent, x, y) {
  if (x >= 0 && x < 8 && y >= 0 & y < 8) {
    if (!game[x][y].pawn || game[x][y].pawn.opponent !== opponent) {
      moves.push({x: x, y: y});
    }
    return (game[x][y].pawn ? false : true);
  } else {
    return false;
  }
}

function kingRoute(pawn, game) {
  var moves = [];
  var add = addMove.bind(undefined, moves, game, pawn.opponent);
  for (var i = pawn.x - 1; i <= pawn.x + 1; i++) {
    for (var j = pawn.y - 1; j <= pawn.y + 1; j++) {
      add(i, j);
    }
  }
  return moves;
}

function rookRoute(pawn, game) {
  var i, moves = [];
  var add = addMove.bind(undefined, moves, game, pawn.opponent);
  for (i = 1; add(pawn.x + i, pawn.y); i++) {}
  for (i = 1; add(pawn.x - i, pawn.y); i++) {}
  for (i = 1; add(pawn.x, pawn.y + i); i++) {}
  for (i = 1; add(pawn.x, pawn.y - i); i++) {}
  return moves;
}

function bishopRoute(pawn, game) {
  var i, moves = [];
  var add = addMove.bind(undefined, moves, game, pawn.opponent);
  for (i = 1; add(pawn.x + i, pawn.y - i); i++) {}
  for (i = 1; add(pawn.x + i, pawn.y + i); i++) {}
  for (i = 1; add(pawn.x - i, pawn.y - i); i++) {}
  for (i = 1; add(pawn.x - i, pawn.y + i); i++) {}
  return moves;
}

function queenRoute(pawn, game) {
  return rookRoute(pawn, game).concat(bishopRoute(pawn, game));
}

function knightRoute(pawn, game) {
  var moves = [];
  var add = addMove.bind(undefined, moves, game, pawn.opponent);
  add(pawn.x - 1, pawn.y - 2);
  add(pawn.x - 2, pawn.y - 1);
  add(pawn.x + 1, pawn.y - 2);
  add(pawn.x + 2, pawn.y - 1);
  add(pawn.x - 1, pawn.y + 2);
  add(pawn.x - 2, pawn.y + 1);
  add(pawn.x + 1, pawn.y + 2);
  add(pawn.x + 2, pawn.y + 1);
  return moves;
}

function pawnRoute(pawn, game) {
  var moves = [];
  var add = addMove.bind(undefined, moves, game, pawn.opponent);
  if (pawn.opponent) {
    add(pawn.x - 1, pawn.y + 1);
    add(pawn.x + 1, pawn.y + 1);
  } else {
    if (game[pawn.x - 1][pawn.y - 1].pawn && game[pawn.x - 1][pawn.y - 1].pawn.opponent) {
      add(pawn.x - 1, pawn.y - 1);
    }
    if (game[pawn.x + 1][pawn.y - 1].pawn && game[pawn.x + 1][pawn.y - 1].pawn.opponent) {
      add(pawn.x + 1, pawn.y - 1);
    }
    add(pawn.x, pawn.y - 1);
    if (pawn.y === 6) {
      add(pawn.x, pawn.y - 2);
    }
  }
  return moves;
}

var routeProviders = {
  K: kingRoute,
  Q: queenRoute,
  R: rookRoute,
  B: bishopRoute,
  N: knightRoute,
  P: pawnRoute
};

function createBoard(pawns) {
  var game = [];
  for (var i = 0; i < 8; i++) {
    var row = [];
    for (var j = 0; j < 8; j++) {
      row.push({});
    }
    game.push(row);
  }

  pawns.forEach(function (pawn, id) {
    game[pawn.x][pawn.y].pawn = pawn;
    pawn.id = id;
  });

  return game;
}

function isCheck(game, pawns) {
  console.log('.');
  var king = _.findWhere(pawns, {type: 'K', opponent: false});
  return pawns.some(function (pawn) {
    return (pawn.opponent && routeProviders[pawn.type](pawn, game).some(function (move) {
      return (move.x === king.x && move.y === king.y);
    }));
  });
}

function isMate(pawns) {
  var game = createBoard(pawns);
  if (!isCheck(game, pawns)) {
    return false;
  }
  return pawns.every(function (pawn) {
    return (pawn.opponent || routeProviders[pawn.type](pawn, game).every(function (move) {
      var dupPawns = _.clone(pawns);
      dupPawns[pawn.id] = _.extend({}, pawn, {x: move.x, y: move.y});
      if (game[move.x][move.y].pawn) {
        dupPawns.splice(game[move.x][move.y].pawn.id, 1);
      }
      return isCheck(createBoard(dupPawns), dupPawns);
    }));
  });
}

var pawns = [
  {type: 'K', opponent: false, x: 0, y: 0},
  {type: 'R', opponent: true, x: 0, y: 7},
  {type: 'R', opponent: true, x: 1, y: 6},
  {type: 'B', opponent: false, x: 5, y: 6}
];

console.log(isMate(pawns));

'use strict';
var _ = require('lodash');

function addMove(moves, game, opponent, x, y, direction) {
  if (x >= 0 && x < 8 && y >= 0 & y < 8) {
    if (!game[x][y].pawn || game[x][y].pawn.opponent !== opponent || opponent) {
      moves.push({x: x, y: y, direction: direction});
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
  for (i = 1; add(pawn.x + i, pawn.y, 1); i++) {}
  for (i = 1; add(pawn.x - i, pawn.y, 2); i++) {}
  for (i = 1; add(pawn.x, pawn.y + i, 3); i++) {}
  for (i = 1; add(pawn.x, pawn.y - i, 4); i++) {}
  return moves;
}

function bishopRoute(pawn, game) {
  var i, moves = [];
  var add = addMove.bind(undefined, moves, game, pawn.opponent);
  for (i = 1; add(pawn.x + i, pawn.y - i, 5); i++) {}
  for (i = 1; add(pawn.x + i, pawn.y + i, 6); i++) {}
  for (i = 1; add(pawn.x - i, pawn.y - i, 7); i++) {}
  for (i = 1; add(pawn.x - i, pawn.y + i, 8); i++) {}
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
      row.push({threats: []});
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
  var king;
  console.log('.');

  pawns.forEach(function (pawn) {
    if (pawn.opponent) {
      routeProviders[pawn.type](pawn, game).forEach(function (move) {
        game[move.x][move.y].threats.push({id: pawn.id, direction: move.direction});
      });
    } else if (pawn.type === 'K') {
      king = pawn;
    }
  });

  return game[king.x][king.y].threats.length > 0;
}

function isMate(pawns) {
  var game = createBoard(pawns);
  var king = _.findWhere(pawns, {type: 'K', opponent: false});
  var threats = game[king.x][king.y].threats;
  if (!isCheck(game, pawns) ||
      routeProviders.K(king, game).some(function (move) { return (game[move.x][move.y].threats.length === 0); })) {
    return false;
  }
  if (threats.length > 1) {
    return true;
  }

  return pawns.every(function (pawn) {
    return (pawn.opponent || pawn.type === 'K' || routeProviders[pawn.type](pawn, game).every(function (move) {
      if ((threats[0].direction && _.findWhere(game[move.x][move.y].threats, threats[0])) ||
          (game[move.x][move.y].pawn && game[move.x][move.y].pawn.id === threats[0].id)) {
        var dupPawns = _.clone(pawns);
        dupPawns[pawn.id] = _.extend({}, pawn, {x: move.x, y: move.y});
        if (game[move.x][move.y].pawn) {
          dupPawns.splice(game[move.x][move.y].pawn.id, 1);
        }
        return isCheck(createBoard(dupPawns), dupPawns);
      }
      return false;
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

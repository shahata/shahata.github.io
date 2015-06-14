/// <reference path="reference.ts" />
'use strict';
//add services, directives, controllers, filters, etc. in this module
//avoid adding module dependencies for this module
angular
    .module('sodukuAppInternal', []);
//add module dependencies & config and run blocks in this module
//load only the internal module in tests and mock any module dependency
//the only exception to load this module in tests in to test the config & run blocks
angular
    .module('sodukuApp', ['sodukuAppInternal', 'sodukuTranslations', 'sodukuPreload', 'wixAngular', 'wix.common.bi'])
    .config(function () {
    return;
});

'use strict';

try {
  angular.module('sodukuPreload');
} catch (e) {
  angular.module('sodukuPreload', []);
}

angular.module('sodukuPreload').run(['$templateCache', function ($templateCache) {
  'use strict';

  $templateCache.put('views/main.html',
    "<div class='main' ng-controller='MainController as main'>\n" +
    "  <button ng-click='main.solve(true)'>solve!</button>\n" +
    "  <input id='showPossibilities' ng-model='main.showPossibilities' type='checkbox'>\n" +
    "  <label for='showPossibilities'>show possibilities</label>\n" +
    "  <input id='showCode' ng-model='main.showCode' type='checkbox'>\n" +
    "  <label for='showCode'>show code</label>\n" +
    "  <table>\n" +
    "    <tr ng-init='rowScope = this' ng-repeat='row in main.cells'>\n" +
    "      <td ng-repeat='cell in row' style='{{main.getStyle(rowScope.$index, $index)}}'>\n" +
    "        <input ng-model='cell.value' style='width: 30px' type='number'>\n" +
    "        {{main.showPossibilities ? cell.possibilities : ''}}\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "  <pre>{{main.showCode ? main.code : ''}}</pre>\n" +
    "</div>\n"
  );
}]);
/// <reference path="../reference.ts" />
'use strict';
var TABLE_WIDTH = 16;
var BOX_WIDTH = 4;
var BOX_HEIGHT = 4;
var Cell = (function () {
    function Cell(value) {
        this.value = value;
    }
    Object.defineProperty(Cell.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value;
            this.possibilities = [];
        },
        enumerable: true,
        configurable: true
    });
    return Cell;
})();
function hasPossibility(value) {
    return function (cell) { return cell.possibilities.indexOf(value) > -1; };
}
function hasValue(value) {
    return function (cell) { return cell.value === value; };
}
var MainController = (function () {
    /* @ngInject */
    function MainController($timeout) {
        function c(v) {
            return new Cell(v);
        }
        this.$timeout = $timeout;
        this.code = 'code is generated when you click the solve button';
        this.cells = [];
        for (var i = 0; i < TABLE_WIDTH; i++) {
            var row = [];
            for (var j = 0; j < TABLE_WIDTH; j++) {
                row.push(c());
            }
            this.cells.push(row);
        }
        // this.cells = [
        //   [c( ), c(8), c(1), /**/ c( ), c(5), c( ), /**/ c( ), c(6), c( )],
        //   [c( ), c(3), c( ), /**/ c( ), c( ), c(1), /**/ c(5), c(4), c( )],
        //   [c( ), c( ), c( ), /**/ c( ), c(2), c( ), /**/ c( ), c( ), c( )],
        //   [c( ), c( ), c( ), /**/ c(5), c(9), c( ), /**/ c( ), c( ), c(6)],
        //   [c(9), c(4), c( ), /**/ c( ), c( ), c( ), /**/ c( ), c(8), c(3)],
        //   [c(2), c( ), c( ), /**/ c( ), c(1), c(3), /**/ c( ), c( ), c(4)],
        //   [c( ), c( ), c( ), /**/ c( ), c(6), c( ), /**/ c( ), c( ), c( )],
        //   [c( ), c( ), c(9), /**/ c(1), c( ), c( ), /**/ c( ), c(7), c( )],
        //   [c( ), c(5), c( ), /**/ c( ), c(3), c( ), /**/ c(8), c(9), c( )]
        // ];
        this.cells = [
            [c(13), c(5), c(), c(), c(10), c(), c(11), c(3), c(), c(15), c(), c(8), c(), c(), c(), c()],
            [c(16), c(), c(), c(), c(), c(), c(), c(9), c(), c(), c(13), c(), c(), c(6), c(), c()],
            [c(8), c(11), c(3), c(2), c(), c(), c(), c(), c(), c(5), c(), c(), c(13), c(), c(4), c(14)],
            [c(), c(), c(6), c(10), c(), c(15), c(), c(), c(), c(), c(), c(14), c(), c(2), c(), c()],
            [c(), c(), c(), c(12), c(6), c(), c(1), c(), c(13), c(), c(), c(11), c(7), c(), c(), c(9)],
            [c(6), c(2), c(16), c(1), c(), c(), c(5), c(), c(), c(), c(), c(9), c(3), c(), c(), c(15)],
            [c(3), c(), c(), c(), c(), c(12), c(2), c(14), c(), c(6), c(), c(), c(), c(), c(16), c()],
            [c(7), c(), c(), c(), c(11), c(3), c(), c(8), c(), c(), c(), c(), c(14), c(10), c(), c(2)],
            [c(15), c(), c(2), c(5), c(), c(), c(), c(), c(9), c(), c(7), c(13), c(), c(), c(), c(10)],
            [c(), c(4), c(), c(), c(), c(), c(6), c(), c(12), c(1), c(14), c(), c(), c(), c(), c(13)],
            [c(1), c(), c(), c(7), c(16), c(), c(), c(), c(), c(8), c(), c(), c(6), c(4), c(5), c(12)],
            [c(9), c(), c(), c(13), c(2), c(), c(), c(7), c(), c(11), c(), c(4), c(16), c(), c(), c()],
            [c(), c(), c(1), c(), c(5), c(), c(), c(), c(), c(), c(12), c(), c(11), c(8), c(), c()],
            [c(2), c(12), c(), c(11), c(), c(), c(14), c(), c(), c(), c(), c(), c(15), c(1), c(13), c(6)],
            [c(), c(), c(9), c(), c(), c(8), c(), c(), c(6), c(), c(), c(), c(), c(), c(), c(16)],
            [c(), c(), c(), c(), c(15), c(), c(4), c(), c(8), c(14), c(), c(7), c(), c(), c(9), c(5)]
        ];
    }
    MainController.$inject = ["$timeout"];
    MainController.prototype.generateCode = function () {
        function border(index, size, value) {
            return index > 0 && index % size === 0 ? value : '';
        }
        function pad(value, max, fill) {
            var s = (value || '') + '';
            return (max + '').replace(/./g, fill).slice(s.length) + s;
        }
        return 'this.cells = [\n' + this.cells.map(function (row, rowIndex) {
            return border(rowIndex, BOX_HEIGHT, '\n') +
                '  [' + row.map(function (cell, colIndex) {
                return border(colIndex, BOX_WIDTH, '/**/ ') + "c(" + pad(cell.value, TABLE_WIDTH, ' ') + ")";
            }).join(', ') + ']';
        }).join(',\n') + '\n];\n\n';
    };
    MainController.prototype.getStyle = function (rowIndex, colIndex) {
        function border(side) {
            return "border-" + side + ": solid black 1px; ";
        }
        return (rowIndex % BOX_HEIGHT === 0 ? border('top') : '') +
            (rowIndex % BOX_HEIGHT === BOX_HEIGHT - 1 ? border('bottom') : '') +
            (colIndex % BOX_WIDTH === 0 ? border('left') : '') +
            (colIndex % BOX_WIDTH === BOX_WIDTH - 1 ? border('right') : '');
    };
    MainController.prototype.getBox = function (rowIndex, colIndex) {
        var arr = [];
        rowIndex -= rowIndex % BOX_HEIGHT;
        colIndex -= colIndex % BOX_WIDTH;
        for (var i = 0; i < BOX_HEIGHT; i++) {
            arr = arr.concat(this.cells[rowIndex + i].slice(colIndex, colIndex + BOX_WIDTH));
        }
        return arr;
    };
    MainController.prototype.getRow = function (rowIndex) {
        return this.cells[rowIndex];
    };
    MainController.prototype.getCol = function (colIndex) {
        return this.cells.map(function (row) { return row[colIndex]; });
    };
    MainController.prototype.getAll = function () {
        return this.cells.reduce(function (prev, curr) {
            return prev.concat(curr);
        }, []);
    };
    MainController.prototype.someUnsolvedCell = function (f) {
        return this.cells.some(function (row, rowIndex) {
            return row.some(function (cell, colIndex) {
                return !cell.value && f(cell, rowIndex, colIndex);
            });
        });
    };
    MainController.prototype.forEachUnsolvedCell = function (f) {
        this.cells.forEach(function (row, rowIndex) {
            row.forEach(function (cell, colIndex) {
                if (!cell.value) {
                    f(cell, rowIndex, colIndex);
                }
            });
        });
    };
    MainController.prototype.isInRow = function (rowIndex, value) {
        return this.getRow(rowIndex).filter(hasValue(value)).length > 0;
    };
    MainController.prototype.isInCol = function (colIndex, value) {
        return this.getCol(colIndex).filter(hasValue(value)).length > 0;
    };
    MainController.prototype.isInBox = function (rowIndex, colIndex, value) {
        return this.getBox(rowIndex, colIndex).filter(hasValue(value)).length > 0;
    };
    MainController.prototype.otherOptionInRow = function (rowIndex, value) {
        return this.getRow(rowIndex).filter(hasPossibility(value)).length > 1;
    };
    MainController.prototype.otherOptionInCol = function (colIndex, value) {
        return this.getCol(colIndex).filter(hasPossibility(value)).length > 1;
    };
    MainController.prototype.otherOptionInBox = function (rowIndex, colIndex, value) {
        return this.getBox(rowIndex, colIndex).filter(hasPossibility(value)).length > 1;
    };
    MainController.prototype.getPossibleValues = function (rowIndex, colIndex) {
        var arr = [];
        for (var i = 1; i <= TABLE_WIDTH; i++) {
            if (!this.isInRow(rowIndex, i) &&
                !this.isInCol(colIndex, i) &&
                !this.isInBox(rowIndex, colIndex, i)) {
                arr.push(i);
            }
        }
        return arr;
    };
    MainController.prototype.otherOptionInTable = function (rowIndex, colIndex, value) {
        return this.otherOptionInRow(rowIndex, value) &&
            this.otherOptionInCol(colIndex, value) &&
            this.otherOptionInBox(rowIndex, colIndex, value);
    };
    MainController.prototype.solveByOnlyPossibility = function () {
        return this.someUnsolvedCell(function (cell, rowIndex, colIndex) {
            if (cell.possibilities.length === 1) {
                cell.value = cell.possibilities[0];
                return true;
            }
        });
    };
    MainController.prototype.solveByNoOtherOptionInTable = function () {
        var _this = this;
        return this.someUnsolvedCell(function (cell, rowIndex, colIndex) {
            var values = cell.possibilities.filter(function (value) {
                return !_this.otherOptionInTable(rowIndex, colIndex, value);
            });
            if (values.length === 1) {
                cell.value = values[0];
                return true;
            }
        });
    };
    MainController.prototype.solve = function (generateCode) {
        var _this = this;
        if (generateCode) {
            this.code = this.generateCode();
        }
        this.forEachUnsolvedCell(function (cell, rowIndex, colIndex) {
            cell.possibilities = _this.getPossibleValues(rowIndex, colIndex);
        });
        if (this.solveByOnlyPossibility() || this.solveByNoOtherOptionInTable()) {
            this.$timeout(function () { return _this.solve(); }, 10);
        }
        else if (this.getAll().filter(function (cell) { return !cell.value; }).length > 0) {
            this.$timeout(function () { return alert('stuck!!!'); }, 0);
        }
        else {
            this.$timeout(function () { return alert('done!!!'); }, 0);
        }
    };
    return MainController;
})();
angular
    .module('sodukuAppInternal')
    .controller('MainController', MainController);



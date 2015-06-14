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
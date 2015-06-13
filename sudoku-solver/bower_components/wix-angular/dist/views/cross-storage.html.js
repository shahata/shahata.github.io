'use strict';

try {
  angular.module('angularApp');
} catch (e) {
  angular.module('angularApp', []);
}

angular.module('angularApp').run(['$templateCache', function ($templateCache) {
  'use strict';

  $templateCache.put('views/cross-storage.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "  <head></head>\n" +
    "  <body ng-app=\"wixAngularStorageHub\">\n" +
    "    <script src=\"../bower_components/cross-storage/dist/hub.min.js\"></script>\n" +
    "    <script src=\"../bower_components/angular/angular.min.js\"></script>\n" +
    "    <script src=\"../wix-angular.js\"></script>\n" +
    "  </body>\n" +
    "</html>\n"
  );
}]);
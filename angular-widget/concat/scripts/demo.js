'use strict';
angular.module('angularWidgetApp', ['angularWidget']).config([
  'widgetsProvider',
  function (widgetsProvider) {
    widgetsProvider.setManifestGenerator(function (name) {
      var fileName = name === 'bad' ? 'main' : name;
      return {
        module: name + 'Widget',
        html: 'views/' + fileName + '.html',
        files: [
          'scripts/controllers/' + fileName + '.js',
          'bower_components/angular-cookies/angular-cookies.js',
          'styles/' + fileName + '.css'
        ]
      };
    });
  }
]);
'use strict';
angular.module('angularWidgetApp').controller('widgetContainer', [
  '$scope',
  function ($scope) {
    $scope.isLoading = true;
    $scope.$on('exportPropertiesUpdated', function (event, props) {
      $scope.title = props.title;
    });
    $scope.$on('widgetLoaded', function () {
      $scope.isLoading = false;
      $scope.isError = false;
    });
    $scope.$on('widgetError', function () {
      $scope.isLoading = false;
      $scope.isError = true;
    });
    $scope.reload = function () {
      $scope.isLoading = true;
      $scope.isError = false;
      $scope.$broadcast('reloadWidget');
    };
  }
]);
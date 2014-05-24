'use strict';
angular.module('angularWidgetApp', ['angularWidget']).config([
  'widgetsProvider',
  function (widgetsProvider) {
    widgetsProvider.setManifestGenerator(function (name) {
      return {
        module: name + 'Widget',
        html: 'views/' + name + '.html',
        files: [
          'scripts/controllers/' + name + '.js',
          'styles/' + name + '.css'
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
    // $scope.$watch('options', function (options) {
    //   $scope.containerOptions = angular.extend({hasContainer: true}, options);
    // });
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
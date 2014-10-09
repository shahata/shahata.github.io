'use strict';

angular.module('angularWidgetApp', ['ngRoute', 'angularWidget'])
  .config(["$locationProvider", function setHtml5Mode($locationProvider) {
    $locationProvider.html5Mode(true);
  }])
  .config(["$routeProvider", function initializeRouteProvider($routeProvider) {
    ['app1', 'app2', 'app3'].forEach(function (applicationName) {
      $routeProvider.when('/' + applicationName + ':eatall*?', {
        template: '<ng-widget src="src" delay="0"></ng-widget>',
        controller: ["appName", "$scope", function AppContainerController(appName, $scope) {
          $scope.src = appName;
        }],
        resolve: {
          appName: function () { return applicationName; }
        },
        widgetId: applicationName,
        reloadOnSearch: false
      });
    });

    $routeProvider.otherwise({
      redirectTo: '/app1'
    });
  }])
  .config(["widgetsProvider", function initializemanifestGenerator(widgetsProvider) {
    widgetsProvider.setManifestGenerator(function () {
      return function (name) {
        return {
          module: name,
          html: 'views/' + name + '.html',
          files: [
            'scripts/controllers/' + name + '.js',
            'styles/' + name + '.css'
          ]
        };
      };
    });
  }]);

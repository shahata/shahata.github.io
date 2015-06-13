'use strict';

angular.module('sodukuAppMocks', ['ngMockE2E'])
  .run(["$httpBackend", function ($httpBackend) {
    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();
  }]);

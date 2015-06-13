'use strict';

try {
  angular.module('sodukuTranslations');
} catch (e) {
  angular.module('sodukuTranslations', ['pascalprecht.translate']);
}

angular.module('sodukuTranslations').config(['$translateProvider',
  function ($translateProvider) {
    var translations = {
      'general': {
        'YO': '안녕하세요'
      }
    };
    $translateProvider.translations('ko', translations);
    $translateProvider.translations(translations);
  }
]);

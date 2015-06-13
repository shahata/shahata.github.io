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
        'YO': 'Olá'
      }
    };
    $translateProvider.translations('pt', translations);
    $translateProvider.translations(translations);
  }
]);

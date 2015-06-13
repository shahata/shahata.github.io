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
        'YO': '¡Hola'
      }
    };
    $translateProvider.translations('es', translations);
    $translateProvider.translations(translations);
  }
]);

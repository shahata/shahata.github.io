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
        'YO': 'Bonjour'
      }
    };
    $translateProvider.translations('fr', translations);
    $translateProvider.translations(translations);
  }
]);

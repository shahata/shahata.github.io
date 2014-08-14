'use strict';

try {
  angular.module('angularMemoryGameTranslations');
} catch (e) {
  angular.module('angularMemoryGameTranslations', ['pascalprecht.translate']);
}

angular.module('angularMemoryGameTranslations').config(function ($translateProvider) {
  $translateProvider.translations({
    'general': {
      'YO': 'こんにちは'
    }
  });
});

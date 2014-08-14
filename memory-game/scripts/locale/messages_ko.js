'use strict';

try {
  angular.module('angularMemoryGameTranslations');
} catch (e) {
  angular.module('angularMemoryGameTranslations', ['pascalprecht.translate']);
}

angular.module('angularMemoryGameTranslations').config(function ($translateProvider) {
  $translateProvider.translations({
    'general': {
      'YO': '안녕하세요'
    }
  });
});

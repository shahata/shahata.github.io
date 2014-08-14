'use strict';

try {
  angular.module('angularMemoryGameTranslations');
} catch (e) {
  angular.module('angularMemoryGameTranslations', ['pascalprecht.translate']);
}

angular.module('angularMemoryGameTranslations').config(function ($translateProvider) {
  $translateProvider.translations({
    'MESSAGE_CLICK': 'Click on a tile.',
    'MESSAGE_ONE_MORE': 'Pick one more card.',
    'MESSAGE_MISS': 'Try again.',
    'MESSAGE_MATCH': 'Good job! Keep going.',
    'MESSAGE_WON': 'You win!',
    'PAIRS_LEFT': 'Pairs left to match: {{num}}'
  });
});

'use strict';

if (typeof require !== 'undefined' && typeof module !== 'undefined') {
  require('./matchers.js');

  beforeEach(function () {
    browser.addMockModule('biLoggerDecorator', function () {
      angular.module('biLoggerDecorator', []).config(function ($provide) {
        $provide.decorator('biLogger', function ($delegate) {
          ['log', 'error', 'reportOnReady', 'reportRouteChange'].forEach(function (fn) {
            var hooked = $delegate[fn];
            $delegate[fn] = function () {
              hooked.apply($delegate, arguments);
              angular.element('#bi-logger-e2e-container').append('<img src="' + $delegate.getLastBiUrl().url + '" class="bi-img-mock-for-test"/>');
            };
          });

          return $delegate;
        });
      }).run(function () {
        angular.element('body').append(angular.element('<div style="display: none" id="bi-logger-e2e-container"></div>'));
      });
    });
  });

  var remove = function (selector) {
    browser.executeScript(function () {
      $(arguments[0]).remove();
    }, selector);
  };

  var getSrc = function (selector) {
    return $(selector).isPresent().then(function (present) {
      if (present) {
        var src = $(selector).getAttribute('src');
        remove(selector);
        return src.then(function (url) {
          return {url: url};
        });
      } else {
        throw 'no more bi events!!!';
      }
    });
  };

  var selector = '#bi-logger-e2e-container img.bi-img-mock-for-test';

  module.exports = {
    clear: function () {
      remove(selector);
    },
    shift: function () {
      return getSrc(selector + ':first-child');
    },
    pop: function () {
      return getSrc(selector + ':last-child');
    },
    assertEmpty: function () {
      $$(selector).count().then(function (count) {
        if (count > 0) {
          throw 'you still have unhandled bi events!!!';
        }
      });
    }
  };
}

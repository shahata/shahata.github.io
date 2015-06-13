'use strict';

beforeEach(function () {

  function getDomainFromUrl(url) {
    var index = url.indexOf('?');
    return url.slice(0, index === -1 ? url.length : index);
  }

  this.addMatchers({
    toMatchBiAdapter: function (expectedUrl) {
      return getDomainFromUrl(this.actual.url) === getDomainFromUrl(expectedUrl);
    },
    toMatchBiUrl: function (expectedUrl) {
      //remove msid and metaSiteId when solving CE-2337
      var ignoredKeys = ['_', 'ts', 'msid', 'metaSiteId', 'cat', 'sev', 'iss', 'ver'];

      function getUrlParams(url) {
        if (typeof url !== 'string') {
          return url;
        }

        var params = {};
        var paramsString = url.slice(url.indexOf('?'));

        paramsString.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
          params[key] = decodeURIComponent(value);
        });

        return params;
      }

      function isIgnoredKey(key, ignoredKeys) {
        return ignoredKeys.indexOf(key) !== -1;
      }

      function isMatch(a, b) {
        if (a instanceof RegExp) {
          return a.test(b);
        } else if (b instanceof RegExp) {
          return true;
        } else {
          return a + '' === b + '';
        }
      }

      function compareFlatObjects(a, b, ignoredKeys) {
        return Object.keys(a).every(function (key) {
          return (isIgnoredKey(key, ignoredKeys) || isMatch(a[key], b[key]));
        });
      }

      var actualUrlParams = getUrlParams(this.actual.url);
      var expectedUrlParams = getUrlParams(expectedUrl);

      if (typeof expectedUrl === 'string' &&
        getDomainFromUrl(this.actual.url) !== getDomainFromUrl(expectedUrl)) {
        return false;
      }

      return (compareFlatObjects(actualUrlParams, expectedUrlParams, ignoredKeys) &&
      compareFlatObjects(expectedUrlParams, actualUrlParams, []));
    }
  });
});

'use strict';

if (typeof browser !== 'undefined') {
  afterEach(function () {
    browser.removeMockModule('permissionsManagersMock');
  });
}

module.exports = {
  setPermissions: function (permissions) {
    browser.addMockModule('permissionsManagersMock', function (permissions) {
      try { angular.module('permissionsManagersMock', []);} catch (e) {}
      angular.module('permissionsManagersMock').config(function (permissionsManagerProvider) {
        console.log('setting permissions to: ', JSON.parse(permissions));
        permissionsManagerProvider.setPermissions(JSON.parse(permissions));
      });
    }, JSON.stringify(permissions));
  },
  clearPermissions: function () {
    browser.addMockModule('permissionsManagersMock', function () {
      try { angular.module('permissionsManagersMock', []);} catch (e) {}
      angular.module('permissionsManagersMock').config(function (permissionsManagerProvider) {
        permissionsManagerProvider.clearPermissions();
      });
    });
  }
};

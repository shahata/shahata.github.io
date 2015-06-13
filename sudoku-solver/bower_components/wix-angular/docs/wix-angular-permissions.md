## Wix Angular Permissions
==========================

1. [Overview](#overview)
2. [Installation](#installation)
3. [API](#api)
4. [Directives](#directives)
4. [Usage](#usage)
5. [Test-Kit](#test-kit)

## Overview

Manage Your Permissions!
`wixAngularPermissions` module consists of:
* `permissionsManagerProvider` + `permissionsManager`
* `wixPermissionIf`: “ngIf based” directive to show/hide elements in according to whether or not the have the right permission.
* `wixExperimentDisabled`: “ngDisabled based” directive to enable/disable elements in according to permission.
* `wixPermissionClass`: add classes to your choice by permissions values.

## Installation

```html
<script>
  angular.module('myApp').config(function (permissionsManagerProvider) {
    permissionsManagerProvider.setPermissions(${permissions});
  });
</script>
```

## API

* `permissionsManager.get(value:string):string`:
        Returns a string
* `permissionsManager.contains(value:string):boolean`:
        Returns true/false if the user has the permission or not
* `permissionsManager.loadScope(scope)`:
        Not implemented yet

## Directives

```html
<div wix-permission-if=”NAME-OF-PERMISSION”></div>
<button wix-permission-disabled=”NAME-OF-PERMISSION”></button>
<div wix-permission-class="permissionUserHave" permission-values="{true: \'small\', false: \'big\'}"></div>
```  

`wix-permission-if` && `wix-permission-disabled` supports negation:  
```html
<div wix-permission-if=”!NAME-OF-PERMISSION”></div>
<div wix-permission-disabled=”!NAME-OF-PERMISSION”></div>
```
Inner div data is shown when `NAME-OF-PERMISSION` is false or does not exists (undefined). Similar to javascript negation.
You can use as many of negation sign you'd like
## Usage

## Test-Kit

#### E2E

```haml
%button.rename-btn(wix-permission-if="rename") This button will be visible in case the user has 'rename' permission
%button.edit-btn(wix-permission-if="edit") This button will be visible in case the user has 'edit' permission
%button.copy-btn(wix-permission-disabled="copy" wix-permission-disabled="copy") This button will be disabled in case the user doesn't have 'copy' permission
.permissions-classes(wix-permission-class="rename" permission-values="{true: 'rename-class', false:'some-other-class'}") rename
.permissions-classes(wix-permission-class="somePermissionUserDontHave" permission-values="{false: 'yoba'}") rename
```js
  var permissionsManager = require('../../../app/bower_components/wix-angular/test/lib/permissions-manager-test-kit');

  beforeEach(function () {
    permissionsManager.clearPermissions();
  });

  it('should hide/show elements with wix-permission-if', function () {
    permissionsManager.setPermissions(['rename']);
    page.navigate();

    expect(page.renameButton.isDisplayed()).toBe(true);
    expect(page.editButton.isPresent()).toBe(false);
  });
  
  it('should disable links / buttons with wix-permission-disable', function () {
    permissionsManager.setPermissions(['copy', 'rename']);
    page.navigate();

    expect(page.renameButton.getAttribute('disabled')).toBe(null);
    expect(page.copyButton.getAttribute('disabled')).toBe('true');
  });

  it('should add class with wix-permission-class', function () {
    permissionsManager.setPermissions(['rename']);
    page.navigate();

    expect(page.permissionsClasses).toHaveClass('rename-class');
    expect(page.permissionsClasses).not.toHaveClass('edit-class');
  });
```

## Wix Angular Storage: Getting Started

### Overview
Wix Angular Storage is the part of wixAngular utility belt that goes with every new wix-angular application. 
It is used for temporary storing data (caching) using browser's `local storage` or wix's `user preferences` service.
Due to multiple subdomains nature of wix, the local storage also supports the write and read operation through out different origins, e.g. `http://www.wix.com` and `http://shoutout.wix.com`.

### Structure
`wixAngularStorage` module consists of 3 services:
* `wixCache` is intended for operations with local storage
* `wixStorage` is intended for operation with user preferences services with optional caching to local storage
* `wixAngularStorageErrors` contains the `enum` of possible reject errors.

### Usage
#### Preparation
Before using the lib there are some preparation steps that need to be done.

 * Include `wixAngularStorage` dependency  - `cross-storage` that enables cross-origin writing into local storage. It's a bower component that is already installed, so just add the following line to your `index.html` or `index.vm`

```html
<script src="bower_components/cross-storage/dist/client.js"></script>
```

 * Add `cross-storage` dependency to the `files` array in `karma.conf.js` file.
 * Add the `${staticsUrl}` variable to `replace.private.conf.js` file

```js
'${staticsUrl}': 'http://local.pizza.wixpress.com:9000/'
```


#### API
This utility is intended for storing for a short period of time relatively small chunks of data, not bigger than 4KB, under provided key, which no longer than 100 chars. It provides the following capabilities:

* `wixCache.set(key, data, [options])`: returns a promise resolved with key
* `wixCache.setWithGUID(data)`: returns a promise that gets resolved with key
* `wixCache.get(key, [options])`: returns a promise that gets resolved with data
* `wixCache.remove(key, [options])`: returns a promise

* `wixStorage.set(key, data, [options])`: returns promise
* `wixStorage.get(key, [options])`: returns promise that gets resolved with data
* `wixStorage.remove(key, [options])`

Available options are:

* `noCache [bool]`: defaults to false - allows to get/set remote key without using local cache
* `expiration [number]`: provides TTL of the data in seconds (default for local - 1h, no more than 2 days)
* `siteId [guid]`: allows to save stuff for specific site

In case any promise is rejected, it provides on the following reasons that are defined as constants in `wixAngularStorageErrors`:

* `wixAngularStorageErrors.LOGGED_OUT`: request is performed without logged in user (missing wixSession cookie)
* `wixAngularStorageErrors.NOT_FOUND`: requested record with the given key is not found
* `wixAngularStorageErrors.RUNTIME_EXCEPTION`: thrown error, e.g. exception at `JSON.stringify` on invalid object
* `wixAngularStorageErrors.SERVER_ERROR`: server returned error
* `wixAngularStorageErrors.QUOTA_EXCEEDED`: no available space at local storage

#### Example
```js
function myFactory(wixCache, wixAngularStorageErrors) {
  var data, message;
  // example of set
  wixCache.set('myKey', { test: 'mytestdata' }, { 
    expiration: 3, 
    siteId: '1234-1234' 
  });
  
  // example of get
  wixCache.get('myAwesomeKey')
    .then(function (res) {
      data = res;
    })
    .catch(function (reason) {
      // check the reason
      if (reason === wixAngularStorageErrors.NOT_FOUND) {
        message = 'The record is not found';
      } else {
        message = 'WTF?';
      }
    });
}
```

# wix-angular

Helper library for wix-angular apps

1. [Installation](#installation)
2. [Usage](#usage)
3. [What you get?](#what-you-get)
4. [Bonus: WixResult handling](#bonus-wixresult-handling)

## Installation

No installation needed in case you scaffold using `yo wix-angular`

Otherwise - `bower install --save wix-angular`

## Usage

**Note:** If you generated your project using wix-angular generator, you already have all of this.

In your .html file add the following script tags:

```html
<script src="bower_components/uri.js/src/URI.js"></script>
<script src="bower_components/wix-angular/dist/wix-angular.js"></script>
```

Add `wixAngular` as module dependency for your app:

```js
angular.module('myApp', [..., 'wixAngular']);
```

Add configuration block for `wixAngular` (optional - by default it will be the URL in your base tag):

```html
<script>
  angular.module('myApp').config(function (wixAngularProvider) {
    wixAngularProvider.setStaticsUrl('${staticsUrl}');
    wixAngularProvider.setExperiments(${experiments});
  });
</script>
```

## What you get?

Well, mainly you get stuff to work around CORS issues and the fact static files are downloaded from CDN. Although all scripts and styles are downloaded from the CDN, we still want to download HTML partials from an /_partials mapping on the same origin. On the other hand, we want IMG tags to download from the CDN while not having to use an absolute URL.

So, the following cool things will solve most of those issues:

## Navigation Utils:

 1. If you set `templateUrl` or use `ngInclude` or whatever using `views/my-view.html`, the wix-angular interceptor will make sure the request goes to the partials url (calculated from the statics url you set) so you can keep using `views/my-view.html` and it will just work.
 2. Have an image you want you want to be downloaded from the static url you defined? Instead of `ngSrc` use the `relativeSrc` directive. You can use `<img relative-src="images/my-image.png">` and it will be downloaded from the statics url you set.

## Experiment Utils:

In your index.vm make sure you `setExperiments` as described above. (already included by wix-angular generator)

Then you can test anywhere in your application if an experiment is enabled (equals `'true'`):
```js
wixAngular.isExperimentEnabled('specs.cx.SomeNewWidget');
```

Or access experiments directly in order to work with non-boolean experiments:
```js
var someVar = wixAngular.experiments['specs.cx.SomeExperimentValue'];
```

All of this is also available on `wixAngularProvider` in case you need to see if an experiment is enabled during config, but make sure you `setExperiments` in a dependant module in order to ensure it happens first.

## Translations Utils:

 1. Have a translation key that contain directive that you want to compile in it? Use `wixTranslateCompile` directive (see tests for more documentation)

## WixResult handling:

When Wix servers return a response to some api call, the HTTP status code is 200 even if the response is an error. This is the source of really ugly code that needs to handle a communication error and an application error differently. Since `WixResult` is a wrapper, the actual response is instead stored inside the `payload` field of the response.

The wix-angular interceptor detects errors in `WixResult` and makes sure they will be treated as errors by `$http` and that you won't ever need to handle errors in a `success` callback again :). Also, if the `WixResult` is successful, only the `payload` field contents will be sent to your callback so you won't need to repeat the pattern of stripping it away everywhere.

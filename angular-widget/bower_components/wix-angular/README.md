# wix-angular

Helper library for wix-angular apps

## Installation

No installtion needed in case you scaffold using `yo wix-angular`

Otherwise - `bower install --save wix-angular`

## Usage

In your .html file add the following script tags:

```html
<script src="bower_components/uri.js/src/URI.js"></script>
<script src="bower_components/wix-angular/dist/wix-angular.js"></script>
```

Add `wixAngular` as module dependancy for your app:

```js
angular.module('myApp', [..., 'wixAngular']);
```

## What you get?

Well, mainly you get stuff to work around the fact wix-angular uses a base tag to make the browser fetch relative URL's from the CDN. This makes it easy to work with static resources like scripts, style sheets and images, but views (aka partials), api calls and some links still need to be retrieved relatively to the origin URL.

So, the following cool things will solve most of those issues:
 1. If you set `templateUrl` or use `ngInclude` or whatever using `views/my-view.html`, the wix-angular interceptor will make sure the request goes to the partials url (calculated from the statics url you set)
 2. If you send an api call to `/_api/my-webapp/my-endpoint`, the wix-angular interceptor will make sure the api call will be sent to the same origin as the current location.
 3. Have a link that you want to work relatively to the current location? Instead of `ngHref` use the `relativeHref` directive.
 4. Adds the statics url to `$sce` whitelist so that it won't block loading of of relative templates (this is important for the interceptor to work, but also solves the problem of loading resources with relative url from `$templateCache`)

### Bonus: WixResult handling

When Wix servers return a response to some api call, the HTTP status code is 200 even if the response is an error. This is the source of really ugly code that needs to handle a communication error and an application error differently. Since `WixResult` is a wrapper, the actual response is instead stored inside the `payload` field of the response.

The wix-angular interceptor detects errors in `WixResult` and makes sure they will be treated as errors by `$http` and that you won't ever need to handle errors in a `success` callback again :). Also, if the `WixResult` is successful, only the `payload` field contents will be sent to your callback so you won't need to repeat the pattern of stripping it away everywhere.

"use strict";

angular.module("wixAngularAppInternal", [ "pascalprecht.translate" ]);

angular.module("wixAngular", [ "wixAngularAppInternal" ]).config([ "$httpProvider", "wixAngularProvider", function($httpProvider, wixAngularProvider) {
    $httpProvider.interceptors.push("wixAngularInterceptor");
    if (!wixAngularProvider.getStaticsUrl()) {
        wixAngularProvider.setStaticsUrl(angular.element(document).find("base").attr("href"));
    }
} ]);

"use strict";

(function() {
    function wixTranslateCompile($translate, $compile, $parse) {
        return {
            restrict: "A",
            replace: true,
            link: function(scope, element, attrs) {
                var values = attrs.translateValues ? $parse(attrs.translateValues)(scope) : {};
                var content = $translate(attrs.wixTranslateCompile, values);
                element.html(content);
                $compile(element.contents())(scope);
            }
        };
    }
    wixTranslateCompile.$inject = [ "$translate", "$compile", "$parse" ];
    angular.module("wixAngularAppInternal").directive("wixTranslateCompile", wixTranslateCompile);
})();

"use strict";

(function() {
    function relativeHref($window) {
        return {
            priority: 99,
            link: function(scope, element, attr) {
                attr.$observe("relativeHref", function(url) {
                    if (url) {
                        attr.$set("href", new URI(url, $window.location));
                    }
                });
            }
        };
    }
    relativeHref.$inject = [ "$window" ];
    angular.module("wixAngularAppInternal").directive("relativeHref", relativeHref);
})();

"use strict";

(function() {
    function relativeSrc(wixAngular) {
        return {
            priority: 99,
            link: function(scope, element, attr) {
                attr.$observe("relativeSrc", function(url) {
                    if (url) {
                        attr.$set("src", url.indexOf("images/") === 0 ? wixAngular.staticsUrl + url : url);
                    }
                });
            }
        };
    }
    relativeSrc.$inject = [ "wixAngular" ];
    angular.module("wixAngularAppInternal").directive("relativeSrc", relativeSrc);
})();

"use strict";

(function() {
    function wixAngularInterceptorFactory($q, $log, wixAngular) {
        var wixAngularInterceptor = {};
        function errorHandler(response) {
            return $q.reject(response);
        }
        wixAngularInterceptor.request = function(config) {
            if (config.url.match(/^views\/.*\.html$/)) {
                if (!config.cache || !config.cache.get(config.url)) {
                    config.url = wixAngular.partialsUrl + config.url;
                }
            } else if (config.url.indexOf("/_api/") === 0) {
                config.url = wixAngular.fixOrigin(config.url);
            }
            return config;
        };
        wixAngularInterceptor.response = function(response) {
            if (response.data) {
                if (response.data.success === false) {
                    response.status = 500;
                    return errorHandler(response);
                } else if (response.data.success === true && response.data.payload !== undefined) {
                    response.data = response.data.payload;
                }
            }
            return response;
        };
        wixAngularInterceptor.responseError = function(response) {
            return errorHandler(response);
        };
        return wixAngularInterceptor;
    }
    wixAngularInterceptorFactory.$inject = [ "$q", "$log", "wixAngular" ];
    angular.module("wixAngularAppInternal").factory("wixAngularInterceptor", wixAngularInterceptorFactory);
})();

"use strict";

(function() {
    function WixAngular($sceDelegateProvider) {
        var staticsUrl = "";
        var experiments = {};
        function isExperimentEnabled(name) {
            return experiments[name] === "true";
        }
        this.getStaticsUrl = function() {
            return staticsUrl;
        };
        this.setStaticsUrl = function(url) {
            $sceDelegateProvider.resourceUrlWhitelist([ staticsUrl + "**", "self" ]);
            staticsUrl = url;
        };
        this.setExperiments = function(obj) {
            angular.extend(experiments, obj);
        };
        this.isExperimentEnabled = isExperimentEnabled;
        this.$get = function($window, $document) {
            var origin = $document.find("base").attr("href") ? $window.location.protocol + "//" + $window.location.host : "";
            function fixOrigin(url) {
                return url.replace(/^([^\/]*\/\/+)?[^\/]*/, origin);
            }
            var wixAngular = {};
            wixAngular.experiments = experiments;
            wixAngular.isExperimentEnabled = isExperimentEnabled;
            wixAngular.fixOrigin = fixOrigin;
            wixAngular.staticsUrl = staticsUrl ? staticsUrl : "";
            wixAngular.partialsUrl = staticsUrl ? fixOrigin(staticsUrl.replace("/services/", "/_partials/")) : "";
            return wixAngular;
        };
        this.$get.$inject = [ "$window", "$document" ];
    }
    WixAngular.$inject = [ "$sceDelegateProvider" ];
    angular.module("wixAngularAppInternal").provider("wixAngular", WixAngular);
})();
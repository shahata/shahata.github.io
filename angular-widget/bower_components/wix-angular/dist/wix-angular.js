"use strict";

angular.module("wixAngular", []).provider("wixAngular", [ "$sceDelegateProvider", function($sceDelegateProvider) {
    var staticsUrl = "";
    return {
        setStaticsUrl: function(url) {
            $sceDelegateProvider.resourceUrlWhitelist([ staticsUrl + "**", "self" ]);
            staticsUrl = url;
        },
        $get: [ "$window", function($window) {
            function fixOrigin(url) {
                return url.replace(/^([^\/]*\/\/+)?[^\/]*/, $window.location.protocol + "//" + $window.location.host);
            }
            return {
                fixOrigin: fixOrigin,
                staticsUrl: staticsUrl ? staticsUrl : "",
                partialsUrl: staticsUrl ? fixOrigin(staticsUrl.replace("/services/", "/_partials/")) : ""
            };
        } ]
    };
} ]).directive("relativeHref", [ "$window", function($window) {
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
} ]).config([ "$httpProvider", "wixAngularProvider", function($httpProvider, wixAngularProvider) {
    $httpProvider.interceptors.push("wixAngularInterceptor");
    wixAngularProvider.setStaticsUrl(angular.element(document).find("base").attr("href"));
} ]).factory("wixAngularInterceptor", [ "$q", "$log", "wixAngular", function($q, $log, wixAngular) {
    function errorHandler(response) {
        $log.error(response);
        return $q.reject(response);
    }
    return {
        request: function(config) {
            if (!wixAngular.staticsUrl) {
                return config;
            }
            if (config.url.indexOf("views/") === 0) {
                config.url = wixAngular.partialsUrl + config.url;
            } else if (config.url.indexOf("/_api/") === 0) {
                config.url = wixAngular.fixOrigin(config.url);
            }
            return config;
        },
        response: function(response) {
            if (!wixAngular.staticsUrl) {
                return response;
            }
            if (response.data) {
                if (response.data.success === false) {
                    response.status = 500;
                    return errorHandler(response);
                } else if (response.data.success === true && response.data.payload !== undefined) {
                    response.data = response.data.payload;
                }
            }
            return response;
        },
        responseError: function(response) {
            return errorHandler(response);
        }
    };
} ]);
"use strict";

angular.module("wixAngularExperiments", []);

angular.module("wixAngularPermissions", []);

angular.module("wixAngularBackwardCompatibility", [ "wixAngularAppInternal", "wixAngularExperiments" ]);

angular.module("wixAngularStorage", [ "wixAngularAppInternal" ]);

angular.module("wixAngularStorageHub", [ "wixAngularStorage" ]);

angular.module("wixAngularAppInternal", []);

angular.module("wixAngularInterceptor", [ "wixAngularAppInternal" ]).config([ "$httpProvider", "wixAngularTopologyProvider", function($httpProvider, wixAngularTopologyProvider) {
    $httpProvider.interceptors.push("wixAngularInterceptor");
    if (!wixAngularTopologyProvider.getStaticsUrl()) {
        wixAngularTopologyProvider.setStaticsUrl(angular.element(document).find("base").attr("href"));
    }
} ]);

angular.module("wixAngularTranslateCompile", [ "pascalprecht.translate" ]);

angular.module("wixAngular", [ "wixAngularAppInternal", "wixAngularTranslateCompile", "wixAngularStorage", "wixAngularExperiments", "wixAngularInterceptor", "wixAngularBackwardCompatibility", "wixAngularPermissions" ]);

"use strict";

angular.module("wixAngularStorage").constant("ANGULAR_STORAGE_PREFIX", "wixAngularStorage").constant("KEY_SEPARATOR", "|").constant("DEFAULT_AGE_IN_SEC", 60 * 60).constant("CLEANING_INTERVAL", 1e3 * 60 * 10).constant("CLEAN_EPSILON", 100).constant("MAX_KEY_LENGTH", 100).constant("MAX_VALUE_SIZE_IN_BYTES", 4 * 1024).constant("MAX_AGE_IN_SEC", 60 * 60 * 24 * 2).constant("MAX_STORAGE_SIZE_IN_BYTES", 1024 * 1024).constant("DATA_TYPE", "data").constant("ADHOC_TYPE", "adhoc").constant("REMOTE_TYPE", "remote").constant("LOCAL_STORAGE_FRAME_ID", "wixCacheFrame").constant("wixAngularStorageErrors", {
    LOGGED_OUT: 1,
    NOT_FOUND: 2,
    RUNTIME_EXCEPTION: 3,
    SERVER_ERROR: 4,
    QUOTA_EXCEEDED: 5
});

"use strict";

(function() {
    function WixAngularStorageController(wixCache, wixStorage) {
        var that = this;
        function getOptions() {
            return {
                siteId: that.siteId,
                noCache: that.noCache
            };
        }
        var writeData = function(res) {
            that.data = res;
        };
        var eraseData = function() {
            that.data = null;
        };
        this.cache = {
            set: function(key, data) {
                wixCache.set(key, data, getOptions());
            },
            setWithGUID: function(data) {
                wixCache.setWithGUID(data).then(function(key) {
                    that.key = key;
                });
            },
            get: function(key) {
                wixCache.get(key, getOptions()).then(writeData, eraseData);
            },
            remove: function(key) {
                wixCache.remove(key, getOptions()).then(eraseData);
            }
        };
        this.remote = {
            set: function(key, value) {
                wixStorage.set(key, value, getOptions());
            },
            get: function(key) {
                wixStorage.get(key, getOptions()).then(writeData, eraseData);
            },
            remove: function(key) {
                wixStorage.remove(key, getOptions()).then(eraseData);
            }
        };
    }
    WixAngularStorageController.$inject = [ "wixCache", "wixStorage" ];
    angular.module("wixAngularAppInternal").controller("WixAngularStorageController", WixAngularStorageController);
})();

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
    angular.module("wixAngularTranslateCompile").directive("wixTranslateCompile", wixTranslateCompile);
})();

"use strict";

(function() {
    function relativeHref(wixAngularTopology) {
        return {
            priority: 99,
            link: function(scope, element, attr) {
                attr.$observe("relativeHref", function(url) {
                    if (url) {
                        attr.$set("href", wixAngularTopology.staticsUrl + url);
                    }
                });
            }
        };
    }
    relativeHref.$inject = [ "wixAngularTopology" ];
    angular.module("wixAngularAppInternal").directive("relativeHref", relativeHref);
})();

"use strict";

(function() {
    function relativeSrc(wixAngularTopology) {
        return {
            priority: 99,
            link: function(scope, element, attr) {
                attr.$observe("relativeSrc", function(url) {
                    if (url) {
                        attr.$set("src", url.indexOf("images/") === 0 ? wixAngularTopology.staticsUrl + url : url);
                    }
                });
            }
        };
    }
    relativeSrc.$inject = [ "wixAngularTopology" ];
    angular.module("wixAngularAppInternal").directive("relativeSrc", relativeSrc);
})();

"use strict";

(function() {
    function hookPreLink(link, fn) {
        if (typeof link === "function") {
            return {
                pre: fn,
                post: link
            };
        } else {
            var hooked = link.pre;
            link.pre = function() {
                fn.apply(undefined, arguments);
                return hooked.apply(undefined, arguments);
            };
            return link;
        }
    }
    function wixManagersNgDirective(manager, ngDirective, directiveName, ngAttributeName) {
        function parseNegation(expr) {
            var negationGroups = /^(\!*)([^!].*)/.exec(expr);
            var negation = negationGroups[1];
            var name = negationGroups[2];
            var value = manager.contains(name);
            return negation.length % 2 ? !value : value;
        }
        var ngDir = ngDirective[0];
        var ddo = angular.copy(ngDir);
        ddo.compile = function() {
            var ret = ngDir.compile.apply(ngDir, arguments);
            return hookPreLink(ret, function(scope, element, attr) {
                attr[ngAttributeName] = function() {
                    var expr = attr[directiveName];
                    return parseNegation(expr);
                };
            });
        };
        return ddo;
    }
    wixManagersNgDirective.$inject = [ "manager", "ngDirective", "directiveName", "ngAttributeName" ];
    function defineNgDirective($injector, manager, name, ngDirective, ngAttributeName) {
        return $injector.invoke(wixManagersNgDirective, this, {
            manager: manager,
            directiveName: name,
            ngDirective: ngDirective,
            ngAttributeName: ngAttributeName
        });
    }
    angular.module("wixAngularExperiments").directive("wixExperimentIf", [ "$injector", "experimentManager", "ngIfDirective", function($injector, experimentManager, ngIfDirective) {
        return defineNgDirective($injector, experimentManager, "wixExperimentIf", ngIfDirective, "ngIf");
    } ]);
    angular.module("wixAngularPermissions").directive("wixPermissionIf", [ "$injector", "permissionsManager", "ngIfDirective", function($injector, permissionsManager, ngIfDirective) {
        return defineNgDirective($injector, permissionsManager, "wixPermissionIf", ngIfDirective, "ngIf");
    } ]);
    angular.module("wixAngularExperiments").directive("wixExperimentDisabled", [ "$injector", "experimentManager", "ngDisabledDirective", function($injector, experimentManager, ngDisabledDirective) {
        return defineNgDirective($injector, experimentManager, "wixExperimentDisabled", ngDisabledDirective, "ngDisabled");
    } ]);
    angular.module("wixAngularPermissions").directive("wixPermissionDisabled", [ "$injector", "permissionsManager", "ngDisabledDirective", function($injector, permissionsManager, ngDisabledDirective) {
        return defineNgDirective($injector, permissionsManager, "wixPermissionDisabled", ngDisabledDirective, "ngDisabled");
    } ]);
})();

"use strict";

(function() {
    function wixManagersClass(manager, directiveName, valuesToCheck, $parse) {
        return {
            restrict: "A",
            link: function postLink(scope, element, attr) {
                var values = $parse(attr[valuesToCheck])(scope);
                var name = attr[directiveName];
                if (values) {
                    var classToAdd = values[manager.get(name)];
                    if (classToAdd) {
                        element.addClass(classToAdd);
                    }
                }
            }
        };
    }
    wixManagersClass.$inject = [ "manager", "directiveName", "valuesToCheck", "$parse" ];
    function defineClassDirective($injector, manager, name, valuesToCheck) {
        return $injector.invoke(wixManagersClass, this, {
            manager: manager,
            directiveName: name,
            valuesToCheck: valuesToCheck
        });
    }
    angular.module("wixAngularExperiments").directive("wixExperimentClass", [ "$injector", "experimentManager", function($injector, experimentManager) {
        return defineClassDirective($injector, experimentManager, "wixExperimentClass", "experimentValues");
    } ]);
    angular.module("wixAngularPermissions").directive("wixPermissionClass", [ "$injector", "permissionsManager", function($injector, permissionsManager) {
        return defineClassDirective($injector, permissionsManager, "wixPermissionClass", "permissionValues");
    } ]);
})();

"use strict";

(function() {
    function wixAngularInterceptorFactory($q, wixCookies, $rootScope, wixAngularEvents, wixAngularTopology) {
        var wixAngularInterceptor = {};
        var firstUserSwitchTest = true;
        var previousUserGUID;
        function errorHandler(response) {
            return $q.reject(response);
        }
        function checkUserSwitch() {
            if (!firstUserSwitchTest && previousUserGUID !== wixCookies.userGUID) {
                $rootScope.$emit(wixAngularEvents.userSwitch, wixCookies.userGUID, previousUserGUID);
            }
            previousUserGUID = wixCookies.userGUID;
            firstUserSwitchTest = false;
        }
        wixAngularInterceptor.request = function(config) {
            checkUserSwitch();
            if (config.url.match(/\.html$/)) {
                if (!config.url.match(/(:|^)\/\//)) {
                    if (!config.cache || !config.cache.get || !config.cache.get(config.url)) {
                        config.url = wixAngularTopology.calcPartialsUrl(wixAngularTopology.staticsUrl) + config.url.replace(/^\//, "");
                    }
                }
            } else if (config.url.indexOf("/_api/") === 0) {
                config.url = wixAngularTopology.fixOrigin(config.url);
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
    wixAngularInterceptorFactory.$inject = [ "$q", "wixCookies", "$rootScope", "wixAngularEvents", "wixAngularTopology" ];
    angular.module("wixAngularAppInternal").factory("wixAngularInterceptor", wixAngularInterceptorFactory).constant("wixAngularEvents", {
        userSwitch: "userSwitch"
    });
})();

"use strict";

(function() {
    function WixAngular(wixAngularTopologyProvider, experimentManagerProvider) {
        this.getStaticsUrl = wixAngularTopologyProvider.getStaticsUrl;
        this.setStaticsUrl = wixAngularTopologyProvider.setStaticsUrl;
        var isExperimentEnabled = experimentManagerProvider.isExperimentEnabled.bind(experimentManagerProvider);
        this.setExperiments = experimentManagerProvider.setExperiments.bind(experimentManagerProvider);
        this.isExperimentEnabled = isExperimentEnabled;
        this.$get = [ "wixAngularTopology", "experimentManager", function(wixAngularTopology, experimentManager) {
            var wixAngular = {};
            wixAngular.experiments = experimentManager.$$getExperimentsObj();
            wixAngular.isExperimentEnabled = isExperimentEnabled;
            wixAngular.fixOrigin = wixAngularTopology.fixOrigin;
            wixAngular.staticsUrl = wixAngularTopology.staticsUrl;
            wixAngular.partialsUrl = wixAngularTopology.partialsUrl;
            return wixAngular;
        } ];
        this.$get.$inject = [ "wixAngularTopology", "experimentManager" ];
    }
    WixAngular.$inject = [ "wixAngularTopologyProvider", "experimentManagerProvider" ];
    angular.module("wixAngularBackwardCompatibility").provider("wixAngular", WixAngular);
})();

"use strict";

(function() {
    function wixCacheFactory($q, recordUtils, crossStorage, wixAngularStorageErrors, DEFAULT_AGE_IN_SEC, DATA_TYPE, ADHOC_TYPE, REMOTE_TYPE, CLEAN_EPSILON) {
        var wixCache = {};
        function rejectWithRuntimeException() {
            return $q.reject(wixAngularStorageErrors.RUNTIME_EXCEPTION);
        }
        function getCrossStorage() {
            return crossStorage.onConnect().catch(rejectWithRuntimeException);
        }
        function tryToSet(key, value) {
            var cacheKey = recordUtils.getCacheKey(key, value.options);
            function returnKey() {
                return key;
            }
            return getCrossStorage().then(function() {
                return crossStorage.set(cacheKey, value);
            }).then(returnKey, function(reason) {
                if (reason === wixAngularStorageErrors.RUNTIME_EXCEPTION) {
                    return rejectWithRuntimeException();
                }
                if (value.options.type === REMOTE_TYPE) {
                    return $q.reject();
                } else {
                    return crossStorage.clear(recordUtils.getRecordSize(cacheKey, value) + CLEAN_EPSILON).then(function() {
                        return crossStorage.set(cacheKey, value).then(returnKey, rejectWithRuntimeException);
                    }, function() {
                        return $q.reject(wixAngularStorageErrors.QUOTA_EXCEEDED);
                    });
                }
            });
        }
        wixCache.set = function(key, data, options) {
            recordUtils.validateKey(key);
            recordUtils.validateData(data);
            recordUtils.validateExpiration(options);
            var value = {
                createdAt: Date.now(),
                data: data,
                options: angular.extend({
                    expiration: DEFAULT_AGE_IN_SEC,
                    type: DATA_TYPE
                }, options)
            };
            return tryToSet(key, value);
        };
        wixCache.setWithGUID = function(data) {
            var key = recordUtils.generateRandomKey();
            return this.set(key, data, {
                expiration: null,
                type: ADHOC_TYPE
            });
        };
        wixCache.get = function(key, opts) {
            return getCrossStorage().then(function() {
                return crossStorage.get(recordUtils.getCacheKey(key, opts));
            }).then(function(record) {
                if (record && !recordUtils.isExpired(record)) {
                    return record.data;
                } else {
                    return $q.reject(wixAngularStorageErrors.NOT_FOUND);
                }
            }, rejectWithRuntimeException);
        };
        wixCache.remove = function(key, opts) {
            return getCrossStorage().then(function() {
                return crossStorage.del(recordUtils.getCacheKey(key, opts));
            }).catch(rejectWithRuntimeException);
        };
        if (!recordUtils.isUserLoggedIn()) {
            wixCache.set = wixCache.get = wixCache.remove = function() {
                return $q.reject(wixAngularStorageErrors.LOGGED_OUT);
            };
        }
        return wixCache;
    }
    wixCacheFactory.$inject = [ "$q", "recordUtils", "crossStorage", "wixAngularStorageErrors", "DEFAULT_AGE_IN_SEC", "DATA_TYPE", "ADHOC_TYPE", "REMOTE_TYPE", "CLEAN_EPSILON" ];
    angular.module("wixAngularStorage").factory("wixCache", wixCacheFactory);
})();

"use strict";

(function() {
    function wixCookiesFactory(cookieStr) {
        var parsedUser, prevCookies;
        function parseUserCookie(cookie) {
            var cookieParts = cookie ? cookie.split("|") : [];
            return {
                guid: cookieParts[6],
                userName: cookieParts[0]
            };
        }
        function parseAllCookies(cookies) {
            return cookies.split(";").map(function(str) {
                return str.trim();
            }).reduce(function(acc, curr) {
                var args = curr.split("=");
                acc[args[0]] = args[1];
                return acc;
            }, {});
        }
        function getParsedUserCookie() {
            var cookies = cookieStr() || "";
            if (cookies !== prevCookies) {
                prevCookies = cookies;
                parsedUser = parseUserCookie(parseAllCookies(cookies).wixClient);
            }
            return parsedUser;
        }
        return {
            get userGUID() {
                return getParsedUserCookie().guid;
            },
            get userName() {
                return getParsedUserCookie().userName;
            }
        };
    }
    wixCookiesFactory.$inject = [ "cookieStr" ];
    angular.module("wixAngularAppInternal").factory("wixCookies", wixCookiesFactory).factory("cookieStr", [ "$document", function($document) {
        return function() {
            return $document[0] && $document[0].cookie || "";
        };
    } ]);
})();

"use strict";

(function() {
    function crossStorage($q, wixAngularTopology, LOCAL_STORAGE_FRAME_ID) {
        function promiseCtor(resolver) {
            var dfd = $q.defer();
            resolver(dfd.resolve, dfd.reject);
            return dfd.promise;
        }
        promiseCtor.resolve = function() {
            return $q.when(true);
        };
        promiseCtor.reject = $q.reject;
        CrossStorageClient.prototype.clear = function(amount) {
            return this._request("clear", {
                amount: amount
            });
        };
        return new CrossStorageClient(wixAngularTopology.staticsUrl.replace(".parastaging.com", ".wixpress.com").replace(".parastorage.com", ".wix.com").replace("//static.", "//sslstatic.") + "bower_components/wix-angular/dist/views/cross-storage.html", {
            frameId: LOCAL_STORAGE_FRAME_ID,
            promise: promiseCtor
        });
    }
    crossStorage.$inject = [ "$q", "wixAngularTopology", "LOCAL_STORAGE_FRAME_ID" ];
    angular.module("wixAngularStorage").factory("crossStorage", crossStorage);
})();

"use strict";

(function() {
    function crossStorageCleanerFactory($window, $interval, recordUtils, MAX_STORAGE_SIZE_IN_BYTES, CLEANING_INTERVAL, DATA_TYPE) {
        var hub = $window.CrossStorageHub;
        var init = hub.init;
        var _set = hub._set;
        var dataKeys = [];
        var remoteAndAdhocKeys = [];
        function removeFromArray(item, arr) {
            var itemIndex = arr.indexOf(item);
            if (itemIndex !== -1) {
                arr.splice(itemIndex, 1);
            }
        }
        function chooseArrayByType(options) {
            return options.type === DATA_TYPE ? dataKeys : remoteAndAdhocKeys;
        }
        function clearRecord(key) {
            var record = hub._get({
                keys: [ key ]
            });
            if (record) {
                var recordSize = recordUtils.getRecordSize(key, record);
                hub._del({
                    keys: [ key ]
                });
                return recordSize;
            } else {
                return 0;
            }
        }
        function clearRecords(keys) {
            return keys.reduce(function(acc, key) {
                acc += clearRecord(key);
                return acc;
            }, 0);
        }
        function getWixCacheKeys() {
            return hub._getKeys().filter(recordUtils.hasPrefix);
        }
        function getWixCacheSize() {
            return getWixCacheKeys().reduce(function(acc, key) {
                return acc + recordUtils.getRecordSize(key, hub._get({
                    keys: [ key ]
                }));
            }, 0);
        }
        function loadExistingWixCacheKeys() {
            var createdAtSort = function(a, b) {
                return a.createdAt - b.createdAt;
            };
            var getKey = function(item) {
                return item.key;
            };
            getWixCacheKeys().forEach(function(key) {
                var item = hub._get({
                    keys: [ key ]
                });
                var arr = chooseArrayByType(item.options);
                arr.push({
                    key: key,
                    createdAt: item.createdAt
                });
            });
            dataKeys.sort(createdAtSort);
            remoteAndAdhocKeys.sort(createdAtSort);
            dataKeys = dataKeys.map(getKey);
            remoteAndAdhocKeys = remoteAndAdhocKeys.map(getKey);
        }
        function decorateInit(permissions) {
            dataKeys.length = 0;
            remoteAndAdhocKeys.length = 0;
            loadExistingWixCacheKeys();
            hub._clear();
            init(permissions);
            $interval(hub._clear.bind(hub), CLEANING_INTERVAL);
        }
        function decorateSet(params) {
            var arr = chooseArrayByType(params.value.options);
            removeFromArray(params.key, arr);
            arr.push(params.key);
            _set(params);
        }
        function clearOtherUsers() {
            return clearRecords(getWixCacheKeys().filter(function(key) {
                return !recordUtils.belongsToCurrentUser(key);
            }));
        }
        function clearExpiredRecords() {
            return clearRecords(getWixCacheKeys().filter(function(cacheKey) {
                var record = hub._get({
                    keys: [ cacheKey ]
                });
                return recordUtils.isExpired(record);
            }));
        }
        function clearNonExpiredRecord() {
            var arr = remoteAndAdhocKeys.length === 0 ? dataKeys : remoteAndAdhocKeys;
            var key = arr.shift();
            return clearRecord(key);
        }
        hub._clear = function(amount) {
            var requiredSpace = amount || 0;
            var clearedSpace = 0;
            clearedSpace += clearOtherUsers();
            clearedSpace += clearExpiredRecords();
            var size = getWixCacheSize();
            var removedRecordsSpace = 0;
            while (size - removedRecordsSpace > MAX_STORAGE_SIZE_IN_BYTES) {
                var removed = clearNonExpiredRecord();
                clearedSpace += removed;
                removedRecordsSpace += removed;
            }
            if (size - removedRecordsSpace < requiredSpace - clearedSpace) {
                return false;
            }
            while (clearedSpace < requiredSpace) {
                clearedSpace += clearNonExpiredRecord();
            }
            return true;
        };
        hub.init = decorateInit;
        hub._set = decorateSet;
        hub.init([ {
            origin: /\.(wix|wixpress)\.com($|:\d{4}$)/,
            allow: [ "get", "set", "del" ]
        }, {
            origin: /localhost:\d{4}$/,
            allow: [ "get", "set", "del" ]
        } ]);
    }
    crossStorageCleanerFactory.$inject = [ "$window", "$interval", "recordUtils", "MAX_STORAGE_SIZE_IN_BYTES", "CLEANING_INTERVAL", "DATA_TYPE" ];
    angular.module("wixAngularStorageHub").run(crossStorageCleanerFactory);
})();

"use strict";

(function() {
    function wixStorageFactory($q, $http, recordUtils, wixCache, wixAngularStorageErrors, ANGULAR_STORAGE_PREFIX, REMOTE_TYPE, DEFAULT_AGE_IN_SEC) {
        var wixStorage = {};
        function cacheRemoteData(key, data, options) {
            if (!options.noCache) {
                return wixCache.set(key, data, angular.extend({}, options, {
                    type: REMOTE_TYPE,
                    expiration: DEFAULT_AGE_IN_SEC
                }));
            }
        }
        function getRemote(key, options) {
            var path = options.siteId ? "getVolatilePrefForSite" : "getVolatilePrefForKey";
            var url = [ "/_api/wix-user-preferences-webapp", path, ANGULAR_STORAGE_PREFIX, options.siteId, key ].filter(angular.identity).join("/");
            return $http.get(url).then(function(res) {
                if (res.data[key] === null) {
                    return $q.reject(wixAngularStorageErrors.NOT_FOUND);
                }
                cacheRemoteData(key, res.data[key], options);
                return res.data[key];
            }, function(err) {
                if (err.status === 404) {
                    cacheRemoteData(key, null, options);
                    return $q.reject(wixAngularStorageErrors.NOT_FOUND);
                }
                return $q.reject(wixAngularStorageErrors.SERVER_ERROR);
            });
        }
        function tryCache(key, options) {
            return wixCache.get(key, options).then(function(res) {
                if (res === null) {
                    return $q.reject(wixAngularStorageErrors.NOT_FOUND);
                }
                return res;
            }, function() {
                return getRemote(key, options);
            });
        }
        wixStorage.set = function(key, data, opts) {
            var options = opts || {};
            recordUtils.validateKey(key);
            recordUtils.validateData(data);
            recordUtils.validateExpiration(options);
            var dto = {
                nameSpace: ANGULAR_STORAGE_PREFIX,
                key: key,
                blob: data
            };
            if (options.siteId) {
                dto.siteId = options.siteId;
            }
            if (options.expiration) {
                dto.TTLInDays = Math.ceil(options.expiration / (60 * 60 * 24));
            }
            return $http.post("/_api/wix-user-preferences-webapp/set", dto).then(function() {
                cacheRemoteData(key, data, options);
                return key;
            });
        };
        wixStorage.get = function(key, opts) {
            var options = opts || {};
            return !options.noCache ? tryCache(key, options) : getRemote(key, options);
        };
        wixStorage.remove = function(key, opts) {
            return wixStorage.set(key, null, opts);
        };
        if (!recordUtils.isUserLoggedIn()) {
            wixStorage.set = wixStorage.get = wixStorage.remove = function() {
                return $q.reject(wixAngularStorageErrors.LOGGED_OUT);
            };
        }
        return wixStorage;
    }
    wixStorageFactory.$inject = [ "$q", "$http", "recordUtils", "wixCache", "wixAngularStorageErrors", "ANGULAR_STORAGE_PREFIX", "REMOTE_TYPE", "DEFAULT_AGE_IN_SEC" ];
    angular.module("wixAngularStorage").factory("wixStorage", wixStorageFactory);
})();

"use strict";

(function() {
    function recordUtilsFactory(wixCookies, ANGULAR_STORAGE_PREFIX, KEY_SEPARATOR, MAX_KEY_LENGTH, MAX_VALUE_SIZE_IN_BYTES, MAX_AGE_IN_SEC) {
        var recordUtils = {};
        function countBytes(str) {
            return encodeURI(str).match(/%..|./g).length;
        }
        function hasExpiration(options) {
            return options && !!options.expiration;
        }
        recordUtils.isUserLoggedIn = function() {
            return wixCookies.userGUID !== undefined;
        };
        recordUtils.validateKey = function(key) {
            if (typeof key !== "string" || key.length > MAX_KEY_LENGTH) {
                throw new Error("Key length should be no more than " + MAX_KEY_LENGTH + " chars");
            }
        };
        recordUtils.validateData = function(data) {
            var val = JSON.stringify(data);
            if (countBytes(val) > MAX_VALUE_SIZE_IN_BYTES) {
                throw new Error("The size of passed data exceeds the allowed " + MAX_VALUE_SIZE_IN_BYTES / 1024 + " KB");
            }
        };
        recordUtils.validateExpiration = function(options) {
            if (hasExpiration(options) && (typeof options.expiration !== "number" || options.expiration > MAX_AGE_IN_SEC)) {
                throw new Error("Expiration should be a number and cannot increase " + MAX_AGE_IN_SEC + " seconds");
            }
        };
        recordUtils.isExpired = function(record) {
            if (hasExpiration(record.options)) {
                return record.createdAt + record.options.expiration * 1e3 <= Date.now();
            } else {
                return false;
            }
        };
        recordUtils.getRecordSize = function(key, value) {
            return countBytes(key) + countBytes(JSON.stringify(value));
        };
        recordUtils.getCacheKey = function(key, opts) {
            var options = opts || {};
            return [ ANGULAR_STORAGE_PREFIX, wixCookies.userGUID, options.siteId, key ].filter(angular.identity).join(KEY_SEPARATOR);
        };
        recordUtils.generateRandomKey = function() {
            return Math.random().toString(36).slice(2);
        };
        recordUtils.hasPrefix = function(key) {
            return key.indexOf(ANGULAR_STORAGE_PREFIX) === 0;
        };
        recordUtils.belongsToCurrentUser = function(key) {
            if (recordUtils.isUserLoggedIn()) {
                return key.split(KEY_SEPARATOR)[1] === wixCookies.userGUID;
            } else {
                return false;
            }
        };
        return recordUtils;
    }
    recordUtilsFactory.$inject = [ "wixCookies", "ANGULAR_STORAGE_PREFIX", "KEY_SEPARATOR", "MAX_KEY_LENGTH", "MAX_VALUE_SIZE_IN_BYTES", "MAX_AGE_IN_SEC" ];
    angular.module("wixAngularStorage").factory("recordUtils", recordUtilsFactory);
})();

"use strict";

(function() {
    function WixAngularTopology($sceDelegateProvider) {
        var staticsUrl = "";
        this.getStaticsUrl = function() {
            return staticsUrl;
        };
        this.setStaticsUrl = function(url) {
            staticsUrl = url && url.replace(/\/?$/, "/").replace(/^\/\//, location.protocol + "//");
            $sceDelegateProvider.resourceUrlWhitelist([ staticsUrl + "**", "self" ]);
        };
        this.$get = [ "$window", "$document", "$location", "$injector", function($window, $document, $location, $injector) {
            var origin = $document.find && $document.find("base").attr("href") ? $window.location.protocol + "//" + $window.location.host : "";
            function fixOrigin(url) {
                return url.replace(/^([^\/]*\/\/+)?[^\/]*/, origin);
            }
            var wixAngularTopology = {};
            wixAngularTopology.fixOrigin = fixOrigin;
            wixAngularTopology.calcPartialsUrl = function(staticsUrl, force) {
                if (!force && $location.protocol && $location.protocol() === "https" && $injector.has("experimentManager") && $injector.get("experimentManager").isExperimentEnabled("specs.cx.UseCorsInPartials")) {
                    return staticsUrl;
                } else {
                    return staticsUrl ? fixOrigin(staticsUrl.replace("/services/", "/_partials/")) : "";
                }
            };
            wixAngularTopology.staticsUrl = staticsUrl ? staticsUrl : "";
            wixAngularTopology.partialsUrl = staticsUrl ? fixOrigin(staticsUrl.replace("/services/", "/_partials/")) : "";
            return wixAngularTopology;
        } ];
        this.$get.$inject = [ "$window", "$document", "$location", "$injector" ];
    }
    WixAngularTopology.$inject = [ "$sceDelegateProvider" ];
    angular.module("wixAngularAppInternal").provider("wixAngularTopology", WixAngularTopology);
})();

"use strict";

window.jsonpExperiemts = {};

window.loadExperimentScopeSync = function(scope) {
    var url = "//www.wix.com/_api/wix-laboratory-server/laboratory/conductAllInScope?scope=" + scope + "&accept=jsonp&callback=setExperimentsSync";
    document.write('<script src="' + url + '"></script>');
    window.setExperimentsSync = function(junk, experiments) {
        angular.extend(window.jsonpExperiemts, experiments);
    };
};

var ExperimentManager = function() {
    function ExperimentManager(provider, $http) {
        this.provider = provider;
        this.$http = $http;
        this.petriUrlPrefix = "/_api/wix-laboratory-server/laboratory/";
        this.getExperimentValue = provider.getExperimentValue.bind(provider);
        this.isExperimentEnabled = provider.isExperimentEnabled.bind(provider);
    }
    ExperimentManager.$inject = [ "provider", "$http" ];
    ExperimentManager.prototype.get = function(value) {
        return this.getExperimentValue(value);
    };
    ExperimentManager.prototype.contains = function(value) {
        return this.isExperimentEnabled(value);
    };
    ExperimentManager.prototype.loadScope = function(scope) {
        var _this = this;
        return this.$$queryPetri({
            scope: scope
        }).then(function(experiments) {
            _this.provider.setExperiments(experiments);
            return experiments;
        });
    };
    ExperimentManager.prototype.loadExperiment = function(name, fallback) {
        var _this = this;
        return this.$$queryPetri({
            name: name,
            fallback: fallback
        }).then(function(value) {
            var singleExperiment = {};
            singleExperiment[name] = value;
            _this.provider.setExperiments(singleExperiment);
            return value;
        });
    };
    ExperimentManager.prototype.$$queryPetri = function(params) {
        return this.$http.get(this.getPetriUrl(params), {
            params: this.getQueryParams(params),
            cache: true
        }).then(function(result) {
            return result.data;
        });
    };
    ExperimentManager.prototype.$$getExperimentsObj = function() {
        return this.provider.experiments;
    };
    ExperimentManager.prototype.getPetriUrl = function(params) {
        return this.petriUrlPrefix + (params.scope ? "conductAllInScope/" : "conductExperiment/");
    };
    ExperimentManager.prototype.getQueryParams = function(params) {
        return params.scope ? {
            scope: params.scope
        } : {
            key: params.name,
            fallback: params.fallback
        };
    };
    return ExperimentManager;
}();

var ExperimentManagerProvider = function() {
    function ExperimentManagerProvider() {
        this.experiments = angular.copy(window.jsonpExperiemts);
    }
    ExperimentManagerProvider.prototype.clearExperiments = function() {
        this.experiments = {};
    };
    ExperimentManagerProvider.prototype.isExperimentEnabled = function(name) {
        return this.experiments[name] === "true";
    };
    ExperimentManagerProvider.prototype.setExperiments = function(map) {
        angular.extend(this.experiments, map);
    };
    ExperimentManagerProvider.prototype.getExperimentValue = function(name) {
        return this.experiments[name];
    };
    ExperimentManagerProvider.prototype.$get = function($injector) {
        return $injector.instantiate(ExperimentManager, {
            provider: this
        });
    };
    ExperimentManagerProvider.prototype.$get.$inject = [ "$injector" ];
    return ExperimentManagerProvider;
}();

angular.module("wixAngularExperiments").provider("experimentManager", ExperimentManagerProvider).run([ "$rootScope", "experimentManager", function($rootScope, experimentManager) {
    $rootScope.experimentManager = experimentManager;
} ]);

"use strict";

if (window.beforeEach) {
    window.beforeEach(function() {
        angular.module("experimentManagerMock").config([ "experimentManagerProvider", function(experimentManagerProvider) {
            experimentManagerProvider.clearExperiments();
        } ]);
    });
}

angular.module("experimentManagerMock", []).config([ "$provide", function($provide) {
    $provide.decorator("experimentManager", [ "$delegate", "$q", function($delegate, $q) {
        var originalGetExperimentValue = $delegate.getExperimentValue.bind($delegate);
        var originalIsExperimentEnabled = $delegate.isExperimentEnabled.bind($delegate);
        var scopeToExperiments = {};
        var unexpected = [];
        var used = [];
        function addIfNotExist(val, group) {
            if (group.indexOf(val) === -1) {
                group.push(val);
            }
        }
        function markAsUsedOrUnexpected(experiment) {
            if (originalGetExperimentValue(experiment) === undefined) {
                addIfNotExist(experiment, unexpected);
            } else {
                addIfNotExist(experiment, used);
            }
        }
        function resolvePromise(params) {
            var deferred = $q.defer();
            if (params.scope) {
                deferred.resolve(scopeToExperiments[params.scope] || {});
            } else {
                deferred.resolve(Object.keys(scopeToExperiments).reduce(function(prev, scope) {
                    return prev || scopeToExperiments[scope][params.name];
                }, undefined) || params.fallback);
            }
            return deferred.promise;
        }
        $delegate.getExperimentValue = function(name) {
            markAsUsedOrUnexpected(name);
            return originalGetExperimentValue(name);
        };
        $delegate.isExperimentEnabled = function(name) {
            markAsUsedOrUnexpected(name);
            return originalIsExperimentEnabled(name);
        };
        $delegate.$$queryPetri = function(params) {
            return $q.when(params).then(resolvePromise);
        };
        $delegate.setScopeExperiments = function(str, map) {
            scopeToExperiments[str] = map;
        };
        $delegate.verifyNoUnexpectedExperiments = function() {
            if (unexpected.length) {
                throw "unexpected experiments: " + unexpected.join(", ");
            }
        };
        $delegate.verifyNoUnusedExperiments = function() {
            var unused = Object.keys($delegate.$$getExperimentsObj()).filter(function(experiment) {
                return used.indexOf(experiment) === -1;
            });
            if (unused.length) {
                throw "unused experiments: " + unused.join(", ");
            }
        };
        return $delegate;
    } ]);
} ]);

"use strict";

var PermissionsManager = function() {
    function PermissionsManager(provider) {
        this.provider = provider;
    }
    PermissionsManager.$inject = [ "provider" ];
    PermissionsManager.prototype.contains = function(value) {
        return this.getIndexOf(value) !== -1;
    };
    PermissionsManager.prototype.get = function(value) {
        return this.contains(value).toString();
    };
    PermissionsManager.prototype.loadScope = function(scope) {
        throw new Error("This method is not implemented.");
    };
    PermissionsManager.prototype.getIndexOf = function(value) {
        return this.provider.permissions.indexOf(value);
    };
    return PermissionsManager;
}();

var PermissionsManagerProvider = function() {
    function PermissionsManagerProvider() {
        this.permissions = [];
    }
    PermissionsManagerProvider.prototype.setPermissions = function(permissions) {
        this.permissions = permissions;
    };
    PermissionsManagerProvider.prototype.clearPermissions = function() {
        angular.copy([], this.permissions);
    };
    PermissionsManagerProvider.prototype.$get = function($injector) {
        return $injector.instantiate(PermissionsManager, {
            provider: this
        });
    };
    PermissionsManagerProvider.prototype.$get.$inject = [ "$injector" ];
    return PermissionsManagerProvider;
}();

angular.module("wixAngularPermissions").provider("permissionsManager", PermissionsManagerProvider);
//# sourceMappingURL=wix-angular.js.map
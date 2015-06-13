"use strict";

angular.module("wixAngularDemoApp", [ "wixAngular" ]).config([ "experimentManagerProvider", function(experimentManagerProvider) {
    experimentManagerProvider.setExperiments({
        "active-experiment": "true",
        "background-color": "blue"
    });
} ]).run([ "experimentManager", function(experimentManager) {
    experimentManager.loadScope("shir");
    experimentManager.loadExperiment("sushi");
} ]);
//# sourceMappingURL=demo.js.map
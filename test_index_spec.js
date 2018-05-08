"use strict";

var Yadda = require('yadda');
const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')
Yadda.plugins.mocha.StepLevelPlugin.init();


before(function(next) {

    // Stop the application in case it's already running
    request.del({ url: serverUrl }, function(err, response, body) {

        app.start(hostname, port, function() {
            request.get({ url: serverUrl }, function(err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 200);
                next();
            });
        });
    });
});

after(function(next) {
    app.stop(next);
});

new Yadda.FeatureFileSearch('./test/features').each(function(file) {

    featureFile(file, function(feature) {

        var library = require('./steps/bottles-library');
        var yadda = Yadda.createInstance(library, { baseUrl: baseUrl });

        scenarios(feature.scenarios, function(scenario) {
            steps(scenario.steps, function(step, done) {
                yadda.run(step, done);
            });
        });
    });
});
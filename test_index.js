// /* jslint node: true */
// /* global featureFile, scenarios, steps */
// // "use strict";
const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')

var Yadda = require('yadda');
Yadda.plugins.mocha.StepLevelPlugin.init();

new Yadda.FeatureFileSearch('./test/features/mrt_inFeature').each(function(file) {
    featureFile(file, function(feature) { 
        var library = require('./test/steps/mrt_in.js');
        var yadda = Yadda.createInstance(library);
        
        scenarios(feature.scenarios, function(scenario) {
            steps(scenario.steps, function(step, done) {
                yadda.run(step, done);
            });
        });
    });
});

// new Yadda.FeatureFileSearch('./test/features/mrt_in_noProgram_Feature').each(function(file) {  
//     featureFile(file, function(feature) {        
//         var library = require('./test/steps/mrt_in.js');
//         var yadda = Yadda.createInstance(library);
        
//         scenarios(feature.scenarios, function(scenario) {
//             steps(scenario.steps, function(step, done) {
//                 yadda.run(step, done);
//             });
//         });
//     });
// });

// new Yadda.FeatureFileSearch('./test/features/mrt_leaveFeature').each(function(file) {

//     featureFile(file, function(feature) {
//         var library = require('./test/steps/mrt_leave.js');
//         var yadda = Yadda.createInstance(library);     
//         scenarios(feature.scenarios, function(scenario) {
//             steps(scenario.steps, function(step, done) {
//                 yadda.run(step, done);
//             });
//         });
//     });
// });

// new Yadda.FeatureFileSearch('./test/features/mrt_leave_noProgram_Feature').each(function(file) {

//     featureFile(file, function(feature) {
//         var library = require('./test/steps/mrt_leave.js');
//         var yadda = Yadda.createInstance(library);     
//         scenarios(feature.scenarios, function(scenario) {
//             steps(scenario.steps, function(step, done) {
//                 yadda.run(step, done);
//             });
//         });
//     });
// });

// new Yadda.FeatureFileSearch('./test/features/mrt_leave_in_15_second_Feature').each(function(file) {

//     featureFile(file, function(feature) {

//         var library = require('./test/steps/mrt_leave_in_15s.js');
//         var yadda = Yadda.createInstance(library);

//         scenarios(feature.scenarios, function(scenario) {
//             steps(scenario.steps, function(step, done) {
//                 yadda.run(step, done);
//             });
//         });
//     });
// });

// new Yadda.FeatureFileSearch('./test/features/mrt_leave_in_15_second_noAD_Feature').each(function(file) {

//     featureFile(file, function(feature) {

//         var library = require('./test/steps/mrt_leave_in_15s.js');
//         var yadda = Yadda.createInstance(library);

//         scenarios(feature.scenarios, function(scenario) {
//             steps(scenario.steps, function(step, done) {
//                 yadda.run(step, done);
//             });
//         });
//     });
// });

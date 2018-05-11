// /* jslint node: true */
// /* global featureFile, scenarios, steps */
// // "use strict";
const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')

// // var path = require('path');
// var Yadda = require('yadda');
// Yadda.plugins.mocha.StepLevelPlugin.init();
// // new Yadda.FeatureFileSearch('./test/unit/features').each(function(file) {

// //     featureFile(file, function(feature) {

// //         var library = require('./test/unit/steps/bottle.js');
// //         var yadda = Yadda.createInstance(library);

// //         scenarios(feature.scenarios, function(scenario) {
// //             steps(scenario.steps, function(step, done) {
// //                 yadda.run(step, done);
// //             });
// //         });
// //     });
// // });
// before(function () {
//     this.app = new Application({
//     //   Your electron path can be any binary
//     //   i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
//     //   But for the sake of the example we fetch it from our node_modules.
//       path: electronPath,

//       args: [path.join(__dirname, './')]
//     })
//     return this.app.start()
//   })
// new Yadda.FeatureFileSearch('./test/features').each(function(file) {

//     featureFile(file, function(feature) {

//         var libraries = require_feature_libraries(feature);
//         var yadda = Yadda.createInstance(libraries);

//         scenarios(feature.scenarios, function(scenario) {

//             steps(scenario.steps, function(step,done) {

//                 yadda.run(step,done);
//             });
//         });
//     });
// });

// after(function () {
//     if (this.app && this.app.isRunning()) {
//       return this.app.stop()
//     }
//   })

// function require_feature_libraries(feature) {
//     // console.log(`feature ${JSON.stringify(feature,null,2)}`)
//     // console.log(feature.annotations.step.split(', ').reduce(require_library, []))
//     return feature.annotations.step.split(', ').reduce(require_library, []);
// }

// function require_library(libraries, library) {
//     return libraries.concat(require('./test/steps/' + library));
// }
var Yadda = require('yadda');
Yadda.plugins.mocha.StepLevelPlugin.init();




new Yadda.FeatureFileSearch('./test/features/mrt_leaveFeature').each(function(file) {

    featureFile(file, function(feature) {

        var library = require('./test/steps/mrt_leave.js');
        var yadda = Yadda.createInstance(library);
        // before(function () {
        //     this.app = new Application({
        //     //   Your electron path can be any binary
        //     //   i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
        //     //   But for the sake of the example we fetch it from our node_modules.
        //       path: electronPath,
        
        //       args: [path.join(__dirname, './')]
        //     })
        //     return this.app.start()
        //   })
        
        scenarios(feature.scenarios, function(scenario) {
            steps(scenario.steps, function(step, done) {
                yadda.run(step, done);
            });
        });
        // after(function () {
        //     if (this.app && this.app.isRunning()) {
        //       return this.app.stop()
        //     }
        //   })
    });
});

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



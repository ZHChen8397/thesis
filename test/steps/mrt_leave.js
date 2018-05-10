"use strict";
var PythonShell = require('python-shell');
var Yadda = require('yadda');
var English = Yadda.localisation.English;
var Dictionary = Yadda.Dictionary;
var assert = require('assert');

module.exports = (function() {

    let isEnter
    // var dictionary = new Dictionary().define('NUM', /(\d+)/);
    var library = English.library()

    .given("I run my python code", function() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                var options = {
                    scriptPath: './pyforJS'
                    };
                    var pyshell = new PythonShell('detect_in.py',options);
              
                    pyshell.on('message', function (result) {
                        // console.log(result)
                        isEnter = result
                        if(result) resolve(result)
                        else reject(result)
                    });
            }, 100);
        })
    })

    .when("I finish the camera", function() {
        return new Promise(function(resolve, reject) {
            resolve(true)
        });
    })

    .then("I should return value gotcha", function(number_of_bottles) {
        return new Promise(function(resolve, reject) {
            assert.equal(1,1)
            resolve(true)
        });
    });

    return library;
})();



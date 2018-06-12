"use strict"
var PythonShell = require('python-shell')
var Yadda = require('yadda')
var English = Yadda.localisation.English
var Dictionary = Yadda.Dictionary
var assert = require('assert')
const launch = require('../../test_index') 
const utils = require('../../app/back/utils.js')
const Application = require('spectron').Application
const electronPath = require('electron')
const path = require('path')
const serverAPI = require('../../app/back/serverAPI.js')
const s3 = require('../../app/back/s3.js')
const audioHandler = require('../../app/back/audioTableHandler.js')
// const os = require('os')
let programTable = {
    "星期一": [{
        "userName": "Play1321",
        "clip": [
          {
            "name": "tax",
            "duration": 30
          }
        ],
        "startTime": "06:00",
        "endTime": "23:59"
      }],
    "星期二": [{
        "userName": "Play1321",
        "clip": [
          {
            "name": "tax",
            "duration": 30
          }
        ],
        "startTime": "06:00",
        "endTime": "23:59"
      }],
    "星期三": [{
        "userName": "Play1321",
        "clip": [
          {
            "name": "tax",
            "duration": 30
          }
        ],
        "startTime": "06:00",
        "endTime": "23:59"
      }],
    "星期四": [{
        "userName": "Play1321",
        "clip": [
          {
            "name": "tax",
            "duration": 30
          }
        ],
        "startTime": "06:00",
        "endTime": "23:59"
      }],
    "星期五": [
      {
        "userName": "Play1321",
        "clip": [
          {
            "name": "tax",
            "duration": 30
          }
        ],
        "startTime": "06:00",
        "endTime": "23:59"
      }
    ],
    "星期六": [{
        "userName": "Play1321",
        "clip": [
          {
            "name": "tax",
            "duration": 30
          }
        ],
        "startTime": "06:00",
        "endTime": "23:59"
      }],
    "星期日": [{
        "userName": "Play1321",
        "clip": [
          {
            "name": "tax",
            "duration": 30
          }
        ],
        "startTime": "06:00",
        "endTime": "23:59"
      }]
  }

module.exports = (function() {
    let app
    let program={
        "userName": "Play1321",
        "clip": [
          {
            "name": "tax",
            "duration": 30
          }
        ],
        "startTime": "06:00",
        "endTime": "23:59",
        "day": "星期二"
      }
    let isEnter
    let isEmpty = true
    var library = English.library()
    .given("The player has opened and has advertisements in playList", function() {
        return new Promise(function(resolve,reject){
            launch.app.webContents.send('playProgramRequest',undefined,0) 
            resolve()
        })
        for(var index in programTable) { 
            if(programTable[index] !== '') isEmpty = false
        }
        if(isEmpty) {
            assert.fail('programTable is empty')
        }
        else {
            assert(true)
        }
    })
    .when("MRT depart the station over 15 seconds", function() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                var options = {
                    scriptPath: './pyforJS'
                    };
                    var pyshell = new PythonShell('detect_depart.py',options);
                    pyshell.on('message', function (result) {
                        isEnter = result
                        if(result) resolve(result)
                        else reject(result)
                    });
            }, 100);
        });
    })
    .then("The player should start to play", function() {
        return new Promise(function(resolve,reject){
            launch.app.webContents.send('playProgramRequest',program,0) 
            setTimeout(() => {
                resolve()
            }, 5000);
        })
        return app.client.getAttribute('video','src')
        .then(result=>{ 
            console.log(result)
            if(result === ''){
                assert.fail('the program does not start')
            }
        })
        
    })

    .given("The player has opened and has no advertisement in playList",function(){
        return new Promise(function(resolve,reject){
            launch.app.webContents.send('playProgramRequest',undefined,0) 
            resolve()
        })
        return new Promise(function(resolve, reject) {
            let _emptyProgramTable = utils.getProgramTable()
            for(var index in _emptyProgramTable) { 
                if(_emptyProgramTable[index] === undefined) assert.fail('there is already a program in CMS')
            }
            resolve(true)
        });
    })
    .then("The player should stay stopped",function(){
        return new Promise(function(resolve,reject){
            launch.app.webContents.send('playProgramRequest',undefined,0) 
            setTimeout(() => {
                resolve()
            }, 5000);
        })
        return app.client.getAttribute('video','src')
        .then(result=>{ 
            if(result !== ''){
                assert.fail('the player should stay stopped')
            }
        })
    })
    return library;
})();


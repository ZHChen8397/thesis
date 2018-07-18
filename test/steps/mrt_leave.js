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
    let isEmpty = true
    let scriptPath = {
        scriptPath: './pyforJS'
    };
    var library = English.library()
    .given("The player has opened and has advertisements in playList and train is in station", function() {
        return new Promise(function(resolve,reject){
            launch.app.webContents.send('playProgramRequest',undefined,0) 
            var pyshell = new PythonShell('detect_arrive.py',scriptPath);
            pyshell.on('message', function (result) {
                if(result){       
                    for(var index in programTable) { 
                        if(programTable[index] !== '') isEmpty = false
                    }
                    if(isEmpty) {
                        reject()
                        assert.fail('programTable is empty')
                    }
                    else {
                        resolve()
                        assert(true)
                    }
                }
            })
            
        })

    })
    .when("Train depart the station over $NUM seconds", function(number) {   
        let seconds = parseInt(number*1000)   
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                var pyshell = new PythonShell('detect_depart.py',scriptPath);
                pyshell.on('message', function (result) {
                    if(result) {
                        setTimeout(() => {
                            if(isEmpty){
                                launch.app.webContents.send('playProgramRequest',undefined,0) 
                            }
                            else{
                                launch.app.webContents.send('playProgramRequest',program,0)                                     
                            }
                            resolve(result)
                        }, seconds);
                        
                        assert(true)
                    }
                    else {
                        reject(result)
                        assert.fail()
                    }
                });
            }, 100);
        })
    })
    .then("The player should start to play", function() {
        return new Promise(function(resolve,reject){
            setTimeout(() => {
                resolve()
            }, 5000);
        })
        return launch.app.client.getAttribute('video','src')
        .then(result=>{ 
            if(result === ''){
                assert.fail('the program does not start')
            }
        })
        
    })
    .given("The player has opened and has no advertisement in playList and train is in station",function(){
        return new Promise(function(resolve,reject){
            launch.app.webContents.send('playProgramRequest',undefined,0) 
            var pyshell = new PythonShell('detect_arrive.py',scriptPath);
            pyshell.on('message', function (result) {
                if(result){
                    let _emptyProgramTable = utils.getProgramTable()
                    for(var index in _emptyProgramTable) { 
                        if(_emptyProgramTable[index].length !=0) assert.fail('there is already a program in CMS')
                    }
                    isEmpty = true
                    resolve()
                }
            })
            
        })
    })
    .then("The player should stay paused",function(){
        return new Promise(function(resolve,reject){
            setTimeout(() => {
                resolve()
            }, 5000);
        })
        return launch.app.client.getAttribute('video','src')
        .then(result=>{ 
            if(result !== ''){
                assert.fail('the player should stay stopped')
            }
        })
    })
    return library;
})();


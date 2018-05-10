"use strict"
var PythonShell = require('python-shell')
var Yadda = require('yadda')
var English = Yadda.localisation.English
var Dictionary = Yadda.Dictionary
var assert = require('assert')
const utils = require('../../app/back/utils.js')
const Application = require('spectron').Application
const electronPath = require('electron')
const path = require('path')


module.exports = (function() {
    let app
    before(function () {
        app = new Application({
          path: electronPath,
          args: [path.join(__dirname, '../..')]
        })
        return app.start()
      })
    let programList = [{ userName: 'Play1321',
    clip: [{name:'let it go',duration:'3:30'}],
    panelName: '台北車站1號出口',
    period: {
      day: '星期四',
      startTime: '00:00',
      endTime: '23:59' 
        }}
    ]
    let _programTable
    let _currentProgram
    let emptyProgramTable = {
        '星期一': [],
        '星期二': [],
        '星期三': [],
        '星期四': [],
        '星期五': [],
        '星期六': [],
        '星期日': []
      }
    let isEnter
    let isEmpty = true
    var library = English.library()
    
    .given("the player has opened",function(){
        return new Promise(function(resolve, reject) {            
            let _emptyProgramTable = utils.getProgramTable()
            resolve(true)
        });
    })
    .given("User already push a program to CMS", function() {
        return new Promise(function(resolve, reject) {
            utils.initProgramTable(programList)
            .then(()=>{})
            _programTable = utils.getProgramTable()
            _currentProgram = utils.getCurrentProgram()
            for(var index in _programTable) { 
                if(_programTable[index] !== '') isEmpty = false
            }
            if(isEmpty) {
                assert.fail('programTable is empty')
                resolve()
            }
            else {
                assert(true)
                resolve()
            }
        })
    })
    .given("User has no program in CMS",function(){
        return new Promise(function(resolve, reject) {
            let _emptyProgramTable = utils.getProgramTable()
            for(var index in _emptyProgramTable) { 
                if(_emptyProgramTable[index] === undefined) assert.fail('there is already a program in CMS')
            }
            resolve(true)
        });
    })
    .when("MRT is enter the station", function() {
        app.webContents.send('playProgramRequest',{},0) 
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                var options = {
                    scriptPath: './pyforJS'
                    };
                    var pyshell = new PythonShell('detect_in.py',options);
                    pyshell.on('message', function (result) {
                        isEnter = result
                        if(result) resolve(result)
                        else reject(result)
                    });
            }, 100);
        });
    })
    .then("the player should stop the program", function() {
        return app.client.getAttribute('video','src')
        .then(result=>{ 
            if(result !== ''){
                assert.fail('the program does not stop')
            }
        })
        
    })
    .then("the player should stay stopped",function(){
        app.webContents.send('playProgramRequest',{},0)
        return app.client.getAttribute('video','src')
        .then(result=>{ 
            if(result !== ''){
                assert.fail('the program does not stop')
            }
        })
    })
    after(function () {
        if (app && app.isRunning()) {
            return app.stop()
        }
    })
    return library;
})();


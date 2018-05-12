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
const serverAPI = require('../../app/back/serverAPI.js')
const s3 = require('../../app/back/s3.js')
const audioHandler = require('../../app/back/audioTableHandler.js')
// const os = require('os')


module.exports = (function() {
    let app
    before(function () {
        app = new Application({
          path: electronPath,
          args: [path.join(__dirname, '../..')]
        })
        return app.start()
      })
    let _programTable
    let _currentProgram
    // let programTable = {
    //     "星期一": [],
    //     "星期二": [],
    //     "星期三": [],
    //     "星期四": [],
    //     "星期五": [
    //       {
    //         "userName": "Play1321",
    //         "clip": [
    //           {
    //             "name": "tax",
    //             "duration": 30
    //           }
    //         ],
    //         "startTime": "06:00",
    //         "endTime": "23:59"
    //       }
    //     ],
    //     "星期六": [],
    //     "星期日": []
    //   }
    let isEnter
    let isEmpty = true
    var library = English.library()
    
    .given("the player has opened",function(){
    })
    .given("User already push a program to CMS", function() {
        serverAPI.getProgramByPanelName('JEFF_MAC')
        .then(result=>{
            return utils.initProgramTable(result.data)
        })
        .then(function () {
        return s3.getClipInfoByProgramTable(utils.getProgramTable())
        })
        .then(function (clipInfoList) {
        let downloadList =utils.filterClipInfoList(clipInfoList)
        audioHandler.createAudioTable(downloadList)
        return downloadList
        })
        .then(function (downloadList) {
        return s3.downloadClipFromS3(downloadList)
        })

        let _programTable = utils.getProgramTable()
        for(var index in _programTable) { 
            if(_programTable[index] !== '') isEmpty = false
        }
        if(isEmpty) {
            assert.fail('programTable is empty')
        }
        else {
            assert(true)
        }
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
    .when("MRT leave the station less than 15 seconds", function() {
        _currentProgram = utils.getCurrentProgram()
        app.webContents.send('playProgramRequest',{},0) 
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                var options = {
                    scriptPath: './pyforJS'
                    };
                    var pyshell = new PythonShell('detect_leave_less_than_15s.py',options);
                    pyshell.on('message', function (result) {
                        isEnter = result
                        if(result) resolve(result)
                        else reject(result)
                    });
            }, 100);
        });
    })
    .then("the player should stay stopped",function(){
        app.webContents.reload()
        app.webContents.send('playProgramRequest',{},0)
        return app.client.getAttribute('video','src')
        .then(result=>{ 
            // console.log(result)
            if(result !== ''){
                assert.fail('the player should stay stopped')
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


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
const audioHandler = require('../../app/back/audioTableHandler.js')
const s3 = require('../../app/back/s3.js')
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

    let isEnter
    let isEmpty = true
    var library = English.library()
    
    .given("The player has opened and has ads in playList", function() {
        utils.setCanPlay(true)
        app.webContents.send('playProgramRequest',program,0) 
        // app.webContents.reload()
        serverAPI.getProgramByPanelName('JEFF_MAC_player')
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
    .when("MRT arrive the station", function() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                var options = {
                    scriptPath: './pyforJS'
                };
                var pyshell = new PythonShell('detect_arrive.py',options);
                pyshell.on('message', function (result) {
                    isEnter = result
                    if(result) resolve(result)
                    else reject(result)
                });
            }, 100);
            // app.webContents.reload()
            // app.webContents.send('playProgramRequest',{},0) 
        });
    })
    .then("The player should stop playing the ads", function() {
        return new Promise(function(resolve,reject){
            utils.setCanPlay(false)
            app.webContents.send('playProgramRequest',{},0) 
            app.webContents.reload()

            setTimeout(() => {
                resolve()
            }, 5000);
        })
        return app.client.getAttribute('video','src')
            .then(result=>{ 
                if(result !== ''){
                    assert.fail('the program does not stop')
                }
            })
        // app.webContents.reload()
        // app.webContents.send('playProgramRequest',{},0)
    })

    .given("The player has opened and has no ad in playList",function(){
        return new Promise(function(resolve, reject) {
            let _emptyProgramTable = utils.getProgramTable()
            for(var index in _emptyProgramTable) { 
                if(_emptyProgramTable[index] === undefined) assert.fail('there is already a program in CMS')
            }
            resolve(true)
        });
    })
    .then("The player should stay stopped",function(){
        // app.webContents.reload()
        // app.webContents.send('playProgramRequest',{},0)
        return app.client.getAttribute('video','src')
        .then(result=>{ 
            // console.log(result)
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


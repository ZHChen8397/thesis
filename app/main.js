const electron = require('electron')
const os = require('os')
const ip = require('ip')
const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const audioHandler = require('./back/audioTableHandler.js')
const s3 = require('./back/s3.js')
const qr = require('./back/qrCode.js')
const serverAPI = require('./back/serverAPI.js')
const utils = require('./back/utils')
const expressApp = express()
const http = require('http').Server(expressApp)
const io = require('socket.io')(http)
const cors = require('cors')
const panelIP = require('ip').address()
const moment = require('moment')
const MRTDETECTOR_DOMAIN = 'http://localhost:1321' 
let clientSocket

let panelName
let currentTime
let currentClip
let startOfNotPlay
const app = electron.app
const BrowserWindow = electron.BrowserWindow
let mainWindow

require('electron-debug')({ showDevTools: false })
function createWindow () {
  mainWindow = new BrowserWindow({
    title: 'Electron Video Player',
    'accept-first-mouse': true,
    'fullscreen': false,
    frame: false,
    icon: path.join(__dirname, '/img/logo-256.png'),
    'text-areas-are-resizable': false
  })

  mainWindow.loadURL(`file://${__dirname}/player.html`)

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  mainWindow.webContents.on('did-finish-load', () => {
    serverAPI.checkPanelName(panelIP)
      .then((result) => {
        if (result.data.length === 0) { // 未註冊
          mainWindow.webContents.send('setPanelName')
          return Promise.resolve()
        } else { // 已註冊
          console.log('已註冊')
          panelName = result.data[0].panelName
          initPanel(panelName)
        }
      }).catch((err) => {
        if (err.message === 'timeout of 3000ms exceeded') {
          mainWindow.webContents.send('showErrorMessage')
        } else {
          console.log(`[err] ${err}`)
        }
      })
  })
}
function initPanel (panelName) {
  console.log(`[initPanel]`)
  serverAPI.getProgramByPanelName(panelName)
    .then(function (result) {
      return utils.initProgramTable(result.data)
    })
    .then(function () {
      // console.log(`[init programTable] ${JSON.stringify(utils.getProgramTable(), null, 2)}`)
      return s3.getClipInfoByProgramTable(utils.getProgramTable())
    })
    .then(function (clipInfoList) {
      // console.log(`[clipInfoList] ${JSON.stringify(clipInfoList,null,2)}`)
      let downloadList =utils.filterClipInfoList(clipInfoList)
      audioHandler.createAudioTable(downloadList)
      return downloadList
    })
    .then(function (downloadList) {
      // console.log(`[downloadList] ${JSON.stringify(downloadList,null,2)}`)
      return s3.downloadClipFromS3(downloadList)
    })
    .then(function () {
      return qr.createQrcode()
    })
    .then(function () {
      initSocketChannel()
    })
    // .then(programInterval)
    .catch(function (err) {
      console.error(err)
    })
}
let clipIndex = 0
function updateRecordRequest (currentProgram) {
  let record = {
    program: {
      userName: currentProgram.userName,
      clip: currentProgram.clip,
      panelName: panelName,
      period: {
        day: currentProgram.day,
        startTime: currentProgram.startTime,
        endTime: currentProgram.endTime
      }
    },
    clip: currentClip
  }
  serverAPI.updateRecord(record)
    .catch((err) => {
      console.log(`[err] = ${JSON.stringify(err, null, 2)}`)
    })
}
function initIpcProcess () {
  electron.ipcMain.on('registerPanelRequest', function (event, data) {
    panelName = data
    serverAPI.registerPanel(panelName, panelIP)
      .then((result) => {
        mainWindow.webContents.send('registerPanelResponse', {error: undefined, data: result})
      }).catch((err) => {
        mainWindow.webContents.send('registerPanelResponse', {error: err, data: undefined})
        console.err(err)
      })
  })
  electron.ipcMain.on('updateTime', function (event, time) {
    currentTime = time
  })

  electron.ipcMain.on('updateCurrentClip', function (event) {
    let currentProgram = utils.getCurrentProgram()
    if(currentProgram) {
      updateRecordRequest(currentProgram)
      let canplay = utils.getCanPlay()
      if(canplay)mainWindow.webContents.send('playProgramRequest', currentProgram, clipIndex)
      else mainWindow.webContents.send('playProgramRequest',{},0)
      // if (currentProgram.clip.length - 1 === clipIndex) clipIndex = 0
      // else clipIndex++
      // currentClip = currentProgram.clip[clipIndex]
      // switch (utils.isExtendPlayByMRT(currentProgram.clip[clipIndex].duration,startOfNotPlay)){ // 先判斷MRT延長，再判斷program延長
      //   case true:
      //     if(utils.isExtendPlayByProgram(currentProgram,clipIndex)){
      //       mainWindow.webContents.send('playProgramRequest', currentProgram, clipIndex)
      //     }else{
      //       mainWindow.webContents.send('playProgramRequest', undefined)
      //       io.emit('isPlaying', false)
      //       isPlaying = false
      //       pollNextProgram(JSON.stringify(currentProgram))
      //     }
      //     break;
      //   case false:
      //     mainWindow.webContents.send('playProgramRequest', undefined)
      //     io.emit('isPlaying', false)
      //     isPlaying = false
      //     break;
      // }
      io.emit('updateCurrentClip')
    }else {
      mainWindow.webContents.send('playProgramRequest', undefined)
      io.emit('isPlaying', false)
      isPlaying = false
      return 
    }
  })
}
if (process.env.NODE_ENV !== 'test') {
  app.on('ready', createWindow)

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow()
    }
  })
  initIpcProcess()
}

let isPlaying

function initSocketChannel () {
  let canplay = utils.getCanPlay()
  playController(canplay)
  // console.log(`initSocketChannel`)
  // clientSocket = require('socket.io-client').connect(MRTDETECTOR_DOMAIN)

  // clientSocket.on('firstConnect', function (data) {
  //   console.log(`[firstConnect] = ${JSON.stringify(data,null,2)}`)
  //   startOfNotPlay = data.startOfNotPlay
  //   playController(true)
  // })

  // clientSocket.on('updateStatus', function (data) {
  //   console.log(`[updateStatus] = ${data}`)
  //   playController(true)
  // })
  
  // clientSocket.on('updateStartOfNotPlay', function(time){
  //   startOfNotPlay = time
  // })
}
let golbalStatus = undefined
function playController (status) {
  golbalStatus = status
  if(status)mainWindow.webContents.send('playProgramRequest', utils.getCurrentProgram(), clipIndex)
  else mainWindow.webContents.send('playProgramRequest', {}, 0)
  // console.log(JSON.stringify(utils.getCurrentProgram(),null,2))
  io.emit('isPlaying', true)
  isPlaying = true
  // if (status && utils.getCurrentProgram()) {
  //   s3.checkProgramCanPlay(utils.getCurrentProgram(), function (err, checkResult) {
  //     if(err){console.log('\033[37m',`[checkProgramCanPlay error] ${err.message}`)}
  //     if (checkResult && utils.isExtendPlayByProgram(utils.getCurrentProgram(),clipIndex)) {
  //       switch (utils.isExtendPlayByMRT(utils.getCurrentProgram().clip[clipIndex].duration,startOfNotPlay)){
  //         case true :
  //           currentClip = utils.getCurrentProgram().clip[clipIndex]
  //           mainWindow.webContents.send('playProgramRequest', utils.getCurrentProgram(), clipIndex)
  //           io.emit('isPlaying', true)
  //           isPlaying = true
  //           break;
  //         case false :
  //           currentClip = undefined
  //           clipIndex = 0
  //           mainWindow.webContents.send('playProgramRequest', undefined)
  //           io.emit('isPlaying', false)
  //           isPlaying = false
  //           break;
  //       }
  //     } else {
  //       setTimeout(function () { playController(true) }, 1000)
  //     }
  //   })
  // }
  // else if(status && !utils.getCurrentProgram() && !isPolling){
  //   pollNextProgram()
  // } 
}

let temp = undefined
let isPolling = false
function pollNextProgram(oldProgram){
  console.log(`[pollNextProgram]`)
  isPolling = true
  if(!golbalStatus){
    temp = undefined
    isPolling = false
    return 
  }
  else if(temp && temp !== oldProgram){
    temp = undefined
    isPolling = false
    clipIndex = 0
    playController(true)
    
  }else{
    temp = JSON.stringify(utils.getCurrentProgram())
    setTimeout(function () { pollNextProgram(oldProgram) }, 2000)
  }
}

expressApp.use(bodyParser.json())
expressApp.use(cors())
expressApp.options('*', cors())
expressApp.post('/updateProgram', function (req, res) {
  let program = req.body.document
  let action = req.body.action
  utils.updateProgramTable(action, program)
    .then(() => {
      console.log(`[updateProgramTable]`)
      res.send({result: 'success'})
      return s3.getClipInfoByProgramTable(utils.getProgramTable())
    })
    .then(function (clipInfoList) {
      let downloadList = utils.filterClipInfoList(clipInfoList)
      audioHandler.createAudioTable(downloadList)
      return downloadList
    })
    .then(function (downloadList) {
      return s3.downloadClipFromS3(downloadList)
    })
    .then(function(){
      if(utils.getCurrentProgram() && golbalStatus){
        playController(true)
      }else if(!utils.getCurrentProgram() && golbalStatus && !isPolling){
        pollNextProgram(undefined)
      }
    })
    .catch(function (err) {
      console.log(err)
    })
})
expressApp.get('/getCurrentProgram', function (req, res) { // for App client
  let currentProgram = utils.getCurrentProgram()
  console.log(`[Client:getCurrentProgram]`)
  if (currentProgram && currentClip) {
    let languageList = audioHandler.getLanguageList(currentClip.name, currentProgram.userName)
    res.send({result: languageList})
  } else {
    res.send({result: 'No program on current time'})
  }
})
expressApp.get('/getCurrentTime', function (req, res) { // for App client
  console.log(`Request for getting current play time: ${currentTime}`)
  res.send(String(currentTime))
})

expressApp.get('/audio/:id', function (req, res) { // for App client
  // console.log(`Request for getting audio: ${req.params.id}`)
  let path = audioHandler.getAudioPathById(req.params.id)
  if (path) {
    var music = path
    var stat = fs.statSync(music)
    range = req.headers.range
    var readStream
    if (range !== undefined) {
      var parts = range.replace(/bytes=/, '').split('-')
      var partial_start = parts[0]
      var partial_end = parts[1]
      var start = parseInt(partial_start, 10)
      var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1
      var content_length = (end - start) + 1
      res.status(206).header({
        'Content-Type': 'audio/mpeg',
        'Content-Length': content_length,
        'Content-Range': 'bytes ' + start + '-' + end + '/' + stat.size
      })
      readStream = fs.createReadStream(music, {start: start, end: end})
    } else {
      res.header({
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
      })
      readStream = fs.createReadStream(music)
    }
    readStream.pipe(res)
  }
})
expressApp.listen(1234, function () {
  console.log('listening on *:1234') // for server
})
io.on('connection', function (socket) {
  console.log('a user connected')
  io.emit('firstConnect', isPlaying)
})
http.listen(8888, function () {
  console.log('listening on *:8888') // for app client
})
module.exports = expressApp

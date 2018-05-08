const electron = require('electron')
var path = require('path')
var os = require('os')
const swal = require('sweetalert2')
var utils = require(path.resolve(__dirname, './front/utils.js'))

global.jQuery = require('jquery')
require('bootstrap')
const ipc = electron.ipcRenderer
window.addEventListener(
  'DOMContentLoaded',
  init
)

function init () {
  // var dm = document.getElementById('qrCode')
  // dm.addEventListener('dragstart', dragStart, false)
  // document.body.addEventListener('dragover', dragOver, false)
  // document.body.addEventListener('drop', drop, false)
  bindEvents()
  document.querySelector('#videoContainer').ontimeupdate = function () {
    ipc.send('updateTime', getVideoCurrentTime())
  }
}

// function dragStart (event) {
//   var style = window.getComputedStyle(event.target, null)
//   var str = (parseInt(style.getPropertyValue('left')) - event.clientX) + ',' + (parseInt(style.getPropertyValue('top')) - event.clientY) + ',' + event.target.id
//   event.dataTransfer.setData('Text', str)
// }

// function drop (event) {
//   var offset = event.dataTransfer.getData('Text').split(',')
//   var dm = document.getElementById(offset[2])
//   dm.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px'
//   dm.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px'
//   event.preventDefault()
//   return false
// }

// function dragOver (event) {
//   event.preventDefault()
//   return false
// }

function getVideoCurrentTime () {
  return document.querySelector('#videoContainer').currentTime
}
// ipc.on('initQrcodeImage', function (event, path) {
//   document.querySelector('#qrCode').src = path
// })
ipc.on('showErrorMessage', function (event) {
  swal({
    title: '伺服器離線中',
    type: 'error'
  })
})

ipc.on('setPanelName', function (event, data) {
  swal({
    title: '請輸入目前地點',
    input: 'text',
    showCancelButton: false,
    confirmButtonText: '確定',
    showLoaderOnConfirm: true,
    preConfirm: (text) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (text === '') {
            swal.showValidationError(
              '地點不可為空'
            )
          }
          resolve()
        }, 300)
      })
    },
    allowOutsideClick: false
  }).then((result) => {
    if (result.value) {
      ipc.send('registerPanelRequest', result.value)
    }
  })
})
ipc.on('registerPanelResponse', function (event, data) {
  if (data.error) {
    swal({
      title: '設定失敗',
      type: 'error'
    })
  } else {
    swal({
      title: '設定成功',
      type: 'success'
    })
  }
})
ipc.on('playProgramRequest', function (event, program, clipIndex) {
  // console.log(`[playProgramRequest event] ${JSON.stringify(program, null, 2)}`)
  if (program) {
    utils.setProgram(program, clipIndex)
  } else {
    utils.setProgram('')
  }
})

function bindEvents () {
  var video = document.querySelector('#videoContainer')

  video.addEventListener(
    'ended',
    ended
  )

  video.addEventListener(
    'stalled',
    function (e) {
      videoError('Video Stalled')
    }
  )

  document.querySelector('#playerContainer').addEventListener(
    'click',
    playerClicked
  )

  window.addEventListener(
    'keyup',
    function (e) {
      switch (e.keyCode) {
        case 13 : // enter
        case 32 : // space
          togglePlay()
          break
      }
    }
  )
}

function getTime (ms) {
  var date = new Date(ms)
  var time = []

  time.push(date.getUTCHours())
  time.push(date.getUTCMinutes())
  time.push(date.getUTCSeconds())

  return time.join(':')
}

function adjustVolume (e) {
  var video = document.querySelector('#videoContainer')
  video.volume = e.target.value
}

function togglePlay () {
  document.querySelector('.play:not(.hide),.pause:not(.hide)').click()
}

function toggleScreen () {
  document.querySelector('.fullscreen:not(.hide),.smallscreen:not(.hide)').click()
}

function ended (e) {
  // var player = document.querySelector('#playerContainer')

  // document.querySelector('#play').classList.remove('hide')
  // document.querySelector('#pause').classList.add('hide')
  // player.classList.add('paused')
}

function videoError (message) {
  var err = document.querySelector('#error')
  err.querySelector('h1').innerHTML = message
  err.classList.remove('hide')

  setTimeout(
    function () {
      document.querySelector('#error').classList.remove('hidden')
    },
    10
  )
}

function closeError () {
  document.querySelector('#error').classList.add('hidden')
  setTimeout(
    function () {
      document.querySelector('#error').classList.add('hide')
    },
    300
  )
}

function playerClicked (e) {
  if (!e.target.id || e.target.id == 'controlContainer' || e.target.id == 'dropArea') {
    return
  }

  var video = document.querySelector('#videoContainer')
  var player = document.querySelector('#playerContainer')

  switch (e.target.id) {
    case 'video' :
      togglePlay()
      break
    case 'play' :
      if (!video.videoWidth) {
        videoError('Error Playing Video')
        return
      }
      video.play()
      break
    case 'pause' :
      video.pause()
      break
    case 'volume' :
      document.querySelector('#volRange').classList.toggle('hidden')
      break
    case 'mute' :
      video.muted = !(video.muted)
      player.classList.toggle('muted')
      break
    case 'volRange' :
      // do nothing for now
      break
    case 'fullscreen' :
      fullscreened()
      break
    case 'smallscreen' :
      smallscreened()
      break
    case 'prog' :
      video.currentTime = ((e.offsetX) / e.target.offsetWidth) * video.duration
      break
    case 'close' :
      window.close()
      break
    case 'fileChooser' :
      document.querySelector('#chooseVideo').click()
      break
    case 'enterLink' :
      // do nothing for now
      break
    case 'error' :
    case 'errorMessage' :
      closeError()
      break
    default :
      break
  }
}

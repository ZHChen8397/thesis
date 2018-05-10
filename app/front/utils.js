const $ = require('jquery')
const ipc = require('electron').ipcRenderer
let programList = []
$(document).ready(function () {
  $('#videoContainer').on('ended', function () {
    ipc.send('updateCurrentClip')
  })
})

module.exports.setProgram = function (data, clipIndex) {
  programList = []
  if (data === '') {
    document.getElementById('videoContainer').pause()
    $('#videoContainer').attr('src', '')
  } else {
    // console.log(`[setProgram parameter] ${JSON.stringify(data, null, 2)}`)
    // console.log(`[clipIndex] ${clipIndex}`)

    data.clip.forEach((eachClip) => {
      let program = {
        clipName: eachClip.name,
        clipPath: require('path').join(require('os').homedir(), 'program', data.userName, eachClip.name, eachClip.name + '.mp4')
      }
      programList.push(program)
    })
    console.log(`[programList] ${JSON.stringify(programList, null, 2)}`)
    $('#videoContainer').attr('src', programList[clipIndex].clipPath)
    document.getElementById('videoContainer').play()
  }
}
/*
[data] {
  "clipName": [
    "s7",
    "iphone7"
  ],
  "endTime": "23:59",
  "startTime": "06:00",
  "userName": "Play1321"
}
*/
/*
module.exports.setVideoPath = function (path) {
  $('#logo').hide()
  // $('#qrCode').show()
  if (path === '') {
    document.getElementById('videoContainer').pause()
    $('#videoContainer').attr('src', path)
    // $('#qrCode').hide()
    $('#logo').show()
  } else if (document.getElementById('videoContainer').src) {
    document.getElementById('videoContainer').pause()
    $('#videoContainer').attr('src', path)
    document.getElementById('videoContainer').play()
  }
}
*/

const os = require('os')
const path = require('path')

let audioTable

module.exports.createAudioTable = function (downloadList) {
  audioTable = []
  downloadList.forEach(function (item) {
    if (!item.Key.includes('.mp4')) {
      let lang = item.Key.split('_')[item.Key.split('_').length - 1].split('.')[0]
      let userName = item.Key.split('/')[0]
      let clipName = item.Key.split('/')[1]
      if (audioTable.length !== 0 && audioTable[audioTable.length - 1].clipName === clipName && audioTable[audioTable.length - 1].userName === userName) {
        audioTable[audioTable.length - 1][lang] = {
          id: item.MD5,
          path: path.join(os.homedir(), 'program', item.Key)
        }
      } else {
        let audioTableItem = {
          userName: userName,
          clipName: clipName
        }
        audioTableItem[lang] = {
          id: item.MD5,
          path: path.join(os.homedir(), 'program', item.Key)
        }
        audioTable.push(audioTableItem)
      }
    }
  })
  return audioTable
}

module.exports.getAudioPathById = function (id) {
  let audioPath
  audioTable.forEach(function (audioItem) {
    Object.keys(audioItem).forEach(function (Key) {
      if (audioItem[Key].id === id) {
        audioPath = audioItem[Key].path
      }
    })
  })
  return audioPath
}

module.exports.getLanguageList = function (clipName, userName) {
  // console.log(`[audioTable] ${JSON.stringify(audioTable, null, 2)}`)
  // console.log(`[getLanguageList_clipName] ${clipName}`)
  // console.log(`[getLanguageList_userName] ${userName}`)

  let currentClipInfo = audioTable.filter(function (audioItem) {
    return audioItem.userName === userName && audioItem.clipName === clipName
  })[0]
  let result = format(currentClipInfo)
  return result
}

function format (currentClipInfo) {
  let clone = {}
  Object.assign(clone, currentClipInfo)
  delete clone['userName']
  clone['languageList'] = []
  Object.keys(clone).forEach(function (key) {
    if (clone[key].id) {
      clone['languageList'].push({lang: key, id: clone[key].id})
      delete clone[key]
    }
  })
  return clone
}

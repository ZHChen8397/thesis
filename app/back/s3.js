const AWS = require('aws-sdk')
const path = require('path')
const os = require('os')
const fs = require('fs')
AWS.config.update({
  accessKeyId: 'AKIAIPR4JGOELSQTFFAQ',
  secretAccessKey: '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',
  region: 'us-east-1'
})
module.exports.downloadClipFromS3 = function (downloadList) { // get clips from s3
  if (!fs.existsSync(path.join(os.homedir(), 'program'))) {
    fs.mkdirSync(path.join(os.homedir(), 'program'))
  }
  let downloadPromiseList = []
  downloadList.forEach(function (downloadItem) {
    if (!fs.existsSync(path.join(os.homedir(), 'program', downloadItem.Key))) {
      downloadPromiseList.push(downloadOneClip(downloadItem))
    }
  })
  return Promise.all(downloadPromiseList)
}
module.exports.getClipInfoByProgramTable = function (programTable) {
  const s3 = new AWS.S3()
  let getClipInfoPromiseList = []
  Object.keys(programTable).forEach(function (weekDay) {
    programTable[weekDay].forEach(function (program) {
      program.clip.forEach(function (eachClip) {
        getClipInfoPromiseList.push(s3.listObjectsV2({Bucket: 'oneplay-test', Prefix: program.userName + '/' + eachClip.name}).promise())
      })
    })
  })
  return Promise.all(getClipInfoPromiseList)
    .then((clipInfoList) => {
      let temp = []
      clipInfoList.forEach((clipInfo) => {
        clipInfo.Contents.forEach((item) => {
          temp.push({
            Key: item.Key,
            MD5: item.ETag.split('"')[1]
          })
        })
      })
      return Promise.resolve(temp)
    })
}

module.exports.checkProgramCanPlay = function (program, callback) {
  // console.log(`[program] ${JSON.stringify(program, null, 2)}`)
  const s3 = new AWS.S3()
  let clipInfoPromiseList = []
  let clipLocalInfo = {}
  let clipCloudInfo = {}
  program.clip.forEach((eachClip) => {
    if (fs.existsSync(path.join(os.homedir(), 'program', program.userName, eachClip.name, eachClip.name + '.mp4'))) {
      clipLocalInfo[eachClip.name] = fs.statSync(path.join(os.homedir(), 'program', program.userName, eachClip.name, eachClip.name + '.mp4')).size
    }
    clipInfoPromiseList.push(s3.listObjectsV2({Bucket: 'oneplay-test', Prefix: program.userName + '/' + eachClip.name + '/' + eachClip.name + '.mp4'}).promise())
  })

  Promise.all(clipInfoPromiseList)
    .then((data) => {
      data.forEach((eachData) => {
        clipCloudInfo[eachData.Contents[0].Key.split('/')[1]] = eachData.Contents[0].Size
      })
      let result = JSON.stringify(clipCloudInfo) === JSON.stringify(clipLocalInfo)
      callback(null, result)
    }).catch((err) => {
      callback(err, undefined)
    })
}

function downloadOneClip (downloadItem) {
  const s3 = new AWS.S3()
  let userName = downloadItem.Key.split('/')[0]
  let clipName = downloadItem.Key.split('/')[1]

  if (!fs.existsSync(path.join(os.homedir(), 'program', userName))) { // create user folder
    fs.mkdirSync(path.join(os.homedir(), 'program', userName))
  }
  if (!fs.existsSync(path.join(os.homedir(), 'program', userName, clipName))) { // create clip folder
    fs.mkdirSync(path.join(os.homedir(), 'program', userName, clipName))
  }

  let objPath = path.join(os.homedir(), 'program', downloadItem.Key)
  let objFile = fs.createWriteStream(objPath)
  let param = {
    Bucket: 'oneplay-test',
    Key: downloadItem.Key
  }
  return new Promise(function (resolve, reject) {
    s3.getObject(param).createReadStream().pipe(objFile)
      .on('finish', function () {
        resolve(objPath)
      })
  })
}


const moment = require('moment')
let canPlay = false
let programTable = {
  '星期一': [],
  '星期二': [],
  '星期三': [],
  '星期四': [],
  '星期五': [],
  '星期六': [],
  '星期日': []
}
const weekFormat = {
  'Mon': '星期一',
  'Tue': '星期二',
  'Wed': '星期三',
  'Thu': '星期四',
  'Fri': '星期五',
  'Sat': '星期六',
  'Sun': '星期日'
}
module.exports.updateProgramTable = function (action, program) {
  switch (action) {
    case 'new':
      return new Promise(function (resolve, reject) {
        programTable[program.period.day].push({
          userName: program.userName,
          clip: program.clip,
          startTime: program.period.startTime,
          endTime: program.period.endTime
        })
        resolve()
      })
    case 'delete':
      return new Promise(function (resolve, reject) {
        let deleteProgram = {
          userName: program.userName,
          clip: program.clip.map((each) => {
            return {name: each.name, duration: each.duration}
          }),
          startTime: program.period.startTime,
          endTime: program.period.endTime,
          day: program.period.day
        }
        programTable[program.period.day] = programTable[program.period.day].filter((each) => {
          return JSON.stringify(each) !== JSON.stringify(deleteProgram)
        })
        resolve()
      })
    default:
      return Promise.reject(new Error('Unexpected action'))
  }
}
module.exports.getCanPlay = function (){
  return canPlay
}

module.exports.setCanPlay = function(status){
  canPlay = status
}

module.exports.initProgramTable = function (programList) {
  programTable = {
    '星期一': [],
    '星期二': [],
    '星期三': [],
    '星期四': [],
    '星期五': [],
    '星期六': [],
    '星期日': []
  }
  return new Promise(function (resolve, reject) {
    if (!programList || programList.length === 0) {
      resolve()
    } else {
      programList.forEach(function (program, index) {
        programTable[program.period.day].push({
          userName: program.userName,
          clip: program.clip.map((each) => {
            return {name: each.name, duration: each.duration}
          }),
          startTime: program.period.startTime,
          endTime: program.period.endTime
        })
        if (programList.length - 1 === index) {
          resolve()
        }
      })
    }
  })
}

module.exports.filterClipInfoList = function (clipInfoList) {
  return clipInfoList.filter((clipInfo, index, self) => {
    return (
      self.map(mapObj => mapObj['MD5']).indexOf(clipInfo['MD5']) === index
    )
  })
}

module.exports.getCurrentProgram = function () {
  let currentTime = moment(new Date())
  let weekDay = currentTime.format('ddd')
  let currentProgram
  programTable[weekFormat[weekDay]].forEach((program) => {
    let programStartTime = moment().hours(program.startTime.split(':')[0]).minutes(program.startTime.split(':')[1]).seconds(0)
    let programEndTime = moment().hours(program.endTime.split(':')[0]).minutes(program.endTime.split(':')[1]).seconds(0)
    if (currentTime.isBetween(programStartTime, programEndTime)) {
      currentProgram = program
      currentProgram['day'] = weekFormat[weekDay]
    }
  })
  return currentProgram
}

module.exports.getProgramTable = function () {
  return programTable
}

module.exports.isExtendPlayByMRT = function(clipDuration,startOfNotPlay){
  // console.log(`[MRT]-------------------------`)
  if(!startOfNotPlay)
  return true

  let delta = moment().add(clipDuration, 's').diff(moment(startOfNotPlay), 's')
  // console.log(` ** delta ${delta}`)

  if(delta < (clipDuration / 2) || delta < 0 || (moment().isAfter(moment(startOfNotPlay)) && delta > clipDuration*1.5) ){ // clipDuration + clipDuration/2 (影片長度 + 影片可被延長播放時間)
    // console.log(`** result ${true}`)
    return true
  }

  if (delta > 0 && delta >= (clipDuration / 2)){
    // console.log(`** result ${false}`)
    return false
  }

}


module.exports.isExtendPlayByProgram = function(currentProgram, clipIndex){
  // console.log(`[program]---------------------`)
  let isOverlay = isOverlayProgram(currentProgram,clipIndex)
  // console.log(`** isOverlay ${isOverlay}`)
  let programEndTime = moment().format().split('T')[0] + ' ' + currentProgram.endTime
  let expectedEndTime = moment().add(currentProgram.clip[clipIndex].duration, 's')
  let clipDuration = currentProgram.clip[clipIndex].duration
  let delta = moment().add(clipDuration, 's').diff(moment(programEndTime),'s')
  if(isOverlay)
    return false
  if(delta < (clipDuration / 2) || delta < 0 || delta > clipDuration){
    return true
  }
  if (delta > 0 && delta >= (clipDuration / 2)){
    return false
  }
}

function isOverlayProgram(currentProgram,clipIndex){
  let currentTime = moment(new Date())
  let weekDay = currentTime.format('ddd')
  let clipDuration = currentProgram.clip[clipIndex].duration
  let otherProgramList = programTable[weekFormat[weekDay]].filter((eachProgram)=>{
    return JSON.stringify(eachProgram)!==JSON.stringify(currentProgram)
  })
  for(let eachProgram of otherProgramList){
    let eachStartTime = moment().format().split('T')[0] + ' ' + eachProgram.startTime 
    let eachEndtTime = moment().format().split('T')[0] + ' ' + eachProgram.endTime 
    if(moment().add(clipDuration, 's').isBetween(moment(eachStartTime),moment(eachEndtTime))){
      return true
      break
    }
  }
  return false
}

/** Program format
{ userName: 'Play1321',
  clipName: 'let it go',
  panelName: '台北車站1號出口',
  period: {
    day: '星期五',
    startTime: '00:00',
    endTime: '23:59' } }
 */

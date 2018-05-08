const axios = require('axios')
const serverDomain = 'http://140.124.181.149:3000'
module.exports.checkPanelName = function (panelIP) {
  return axios.create({timeout: 3000}).get(serverDomain + '/checkPanelName', {params: {domain: panelIP}})
}
module.exports.registerPanel = function (panelName, panelIP) {
  return axios.post(serverDomain + '/registerPanel', {panelName: panelName, domain: panelIP})
}

module.exports.getProgramByPanelName = function (panelName) {
  return axios.get(serverDomain + '/getProgramByPanelName', {params: {panelName: panelName}})
}

module.exports.updateRecord = function (record) {
  return axios.post(serverDomain + '/updateRecord', record)
}

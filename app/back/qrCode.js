const path = require('path')
const os = require('os')
const ip = require('ip')
const fs = require('fs')

module.exports.createQrcode = function () {
  if (!fs.existsSync(path.join(os.homedir(), 'qrCode'))) {
    fs.mkdirSync(path.join(os.homedir(), 'qrCode'))
  }
  return new Promise(function (resolve, reject) {
    let qrContent = 'http://' + ip.address() + ':3030'
    require('qr-image').image(
      qrContent,
      {
        type: 'png',
        ec_level: 'L',
        size: 10
      }
    ).pipe(fs.createWriteStream(path.join(os.homedir(), 'qrCode' + '/' + ip.address() + '.png')))
      .on('finish', function () {
        resolve(path.join(os.homedir(), 'qrCode' + '/' + ip.address() + '.png'))
      }).on('error', function () {
        reject(new Error('Fail create qrCode'))
      })
  })
}

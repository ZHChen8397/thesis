let launch = require('./index.js') 

module.exports.stopApp = function () {
    if (launch.app && launch.app.isRunning()) { return launch.app.stop() }
  }
  
module.exports.startApp = function () {
    return launch.app.start()
  }
  
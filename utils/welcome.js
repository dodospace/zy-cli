const log = require('./log')

function welcome(message) {
  log.info()
  log.success(`
  ==========================================================

          Success
          Welcome usage ${message} Template.
          Enjoy!

  ==========================================================
  `)
  log.info()
}

module.exports = welcome

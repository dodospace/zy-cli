const chalk = require('chalk')

const info = (message) => {
  if (!message) {
    console.log()
    return
  }
  console.log(chalk.green.bold(message))
}

const error = (message) => {
  console.error(chalk.red(message))
}

const success = (message) => {
  console.log(chalk.green(message))
}

module.exports = {
  info,
  error,
  success
}

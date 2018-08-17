const spawn = require('cross-spawn')
const log = require('./log')

/**
 * CMD操作方法
 * @param {String}    command  指令
 * @param {Array}     args     指令的具体操作
 * @param {Object}    options  命令参数
 * @param {Function}  callback 完成后的回调函数
 * @param {Boolean}   verbose  是否显示安装的详细信息
 */
function cmd(command, args, options, callback, verbose) {
  const cmd = command || 'npm'

  // 是否显示安装的详细信息
  verbose && args.push('--verbose')

  // 将子进程继承主进程的stdin、stdout和stderr
  options = Object.assign({stdio: 'inherit'}, options)

  // 执行命令
  const child = spawn.sync(command, args, options)
  
  if(child.status === 0) {
    log.success('install')
    callback && callback()
  } else {
    log.error(`command: ${command} error !`);
  }

  process.exit(1)
}

module.exports = cmd
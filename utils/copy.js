const fs = require('fs')

/**
 * 遍历目录以及目录文件
 * @param {String}    dir      目录路径
 * @param {Function}  callback 遍历回调
 */
function travelCopyFile(dir, callback) {
  fs.readdirSync(dir).forEach(file=> {
    var pathname = path.join(dir, file)
    if (fs.statSync(pathname).isDirectory()) {
      travelCopyFile(pathname, callback)
    } else {
      callback(pathname)
    }
  })
}

/**
 * 拷贝文件
 * @param {String}    srcPath   源文件路径
 * @param {String}    tarPath   目标文件路径
 * @param {Function}  callback  回调函数
 */
function copyFile(srcPath, tarPath, callback) {
  const rs = fs.createReadStream(srcPath)
  rs.on('error', err => {
    if (err) {
      console.log('read error, please try later.'.red)
    }
    callback && callback(err)
  })

  const ws = fs.createWriteStream(tarPath)
  ws.on('error', err => {
    if (err) {
      console.log('write errpr, please try later.'.red, err)
    }
    callback && callback(err)
  })
  ws.on('close', ex => {
    callback && callback(ex)
  })
  rs.pipe(ws)
}


/**
 * 遍历拷贝目录
 * @param {String}    srcPath   源目录路径
 * @param {String}    tarPath   目标目录路径
 * @param {Function}  callback  回调函数
 */
function copyFolder(srcDir, tarDir, callback) {
  fs.readdir(srcDir, (err, files) => {
    var count = 0
    var checkEnd = function () {
      ++count == files.length && callback && callback()
    }

    if (err) {
      checkEnd()
      return
    }

    files.forEach( file => {
      const srcPath = path.join(srcDir, file)
      const tarPath = path.join(tarDir, file)

      fs.stat(srcPath, (err, stats) => {
        if (stats.isDirectory()) {
          fs.mkdir(tarPath, err => {
            if (err) {
              console.log('copy folder error.'.red, err)
              return
            }
            copyFolder(srcPath, tarPath, checkEnd)
          })
        } else {
          copyFile(srcPath, tarPath, checkEnd)
        }
      })
    })

    files.length === 0 && callback && callback()
  })
}

module.exports = {
  travelCopyFile,
  copyFile,
  copyFolder
}
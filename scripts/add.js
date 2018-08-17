const fs = require('fs-extra')
const path = require('path')
const log = require('../utils/log')

/**
 * 快速添加组件到指定的文件夹
 * name -> path/subpath@button    @前面为指定文件夹，通过/区别层级 @后面为组件名称
 * name -> button                 无前缀路径默认安装到components文件夹下
 * @param {String}    name        组件名称 
 * @param {Boolean}   isSave      是否保存到app.json中 
 */
function add(name, isSave) {
  // 解析模块名称
  const paths = name.split('@')

  // 定义模块名称
  const projectName = paths[paths.length -1]

  // 组件父级保存目录
  let dir = ''

  // 是否存在前缀路径
  if(paths.length === 1) {
    // 无前缀默认父级目录名为components
    dir = 'components'
  } else {
    // 拼接父级目录
    const dirs = paths[0].split('/')
    dirs.map(item => {
      dir = path.join(dir, item)
    })
  }

  // 准备写入文件
  writeFile(dir, projectName, isSave)
}

/**
 * 保存组件路径到app.json的pages中
 * @param {String} dir          组件父级目录
 * @param {String} projectName  组件名称
 */
function savePath(dir, projectName) {
  const file = JSON.parse(fs.readFileSync(path.join('./', 'app.json'), 'utf-8'))
  const pages = file.pages
  const pathStr = `${dir}/${projectName}/index`
  if (pages.indexOf(pathStr) === -1) {
    file.pages.push(pathStr)
  }
  fs.writeFileSync(path.join('./', 'app.json'), JSON.stringify(file, null, 2))
}

/**
 * 写入文件
 * @param {String}  dir     组件父级目录
 * @param {String}  name    组件名称
 * @param {Boolean} isSave  是否保存路径
 */
function writeFile(dir, name, isSave) {
  const srcPath = path.join(dir, name)
  fs.ensureDirSync(dir)
  const ensureDir = fs.ensureDirSync(srcPath)
  if (ensureDir) {
    fs.writeFileSync(path.join(srcPath, 'index.js'), getFileContent('js', name, isSave))
    fs.writeFileSync(path.join(srcPath, 'index.json'), JSON.stringify(getFileContent('json', name), null, 2))
    fs.writeFileSync(path.join(srcPath, 'index.wxml'), getFileContent('wxml', name))
    fs.writeFileSync(path.join(srcPath, 'index.wxss'), getFileContent('wxss', name))
    isSave && savePath(dir, name)
    log.success(`${name} is added.`)
  } else {
    log.error(`${name} already exists.`)
  }
}

/**
 * 返回小程序json配置文件信息
 * @param {String}  type    文件名称
 * @param {String}  name    模块名
 * @param {Boolean} isSave  是否已添加到app.json
 */
function getFileContent(type, name, isSave) {
  const content = {
    'json' : {
      "navigationBarTitleText": name,
      "usingComponents": {}
    },
    'wxml': `<!-- ${name}.wxml -->`,
    'wxss': `/** ${name}.wxss **/`,
    'js': `// ${name}.js
${isSave ? `Page({
  data: {

  }
})` : ''} 
    `
  }
  return content[type]
}

module.exports = add
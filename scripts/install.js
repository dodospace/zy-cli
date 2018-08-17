const log = require('../utils/log')
const cmd = require('../utils/cmd')
const path = require('path')
const spawn = require('cross-spawn')
const fs = require('fs-extra')
const uuid = require('../utils/uuid')

/**
 * 指定：安装组件
 * @param {String} moduleName 
 */
function install(moduleName) {
  if (moduleName) {
    installComponent(moduleName)
  } else {
    installPackage()
  }
}

/**
 * 安装packa.json指定的包
 */
function installPackage() {
  cmd('npm', ['install', '--save-exact'], {}, ()=> {
    log.info()
  }, false)
}

/**
 * 自定义安装组件
 * @param {String} name 路径/模块名
 */
function installComponent(name) {
  // 解析安装的模块
  const res = name.split('@')

  // 工程名称
  let project = ''

  // 模块名称
  let componentName = ''

  // 模块路径
  let componentPath = ''

  // 工程模块安装路径
  let rootPath = 'components/'

  if (res.length === 1) {
    project = 'wxui'
    componentName = res[0] === 'wxui' ? '' : res[0]
    componentPath = 'components'
  } else {
    project = res[0].split('/')[0]
    componentName = res[res.length - 1]
  }

  const temp = `.${uuid(8)}`

  log.info()
  log.success('Downloading components please wait...')
  log.info()

  const gitUrl = `http://git.51wakeup.cn:81/G-FE/${project}.git`
  const result = spawn.sync('git', ['clone', gitUrl, temp], {'stdio': 'inherit'})

  if (result.status === 0) {
    if (componentName === '') {
      try {
        fs.copySync(path.join(temp, componentPath), componentPath)
      } catch(error) {
        console.log(error)
        fs.removeSync(temp)
      }
      
      fs.removeSync(temp)

      log.info()
      log.success(`Success, All components are downloaded in './${componentPath}/'`)
      log.info()
    } else {
      downloadComponent(temp, componentPath, componentName)
    }
  }
}

/**
 * 下载指定的组件文件
 * @param {String}  temp          缓存目录
 * @param {String}  componentPath 指定的组件相对目录
 * @param {String}  componentName 指定的组件名称
 */
function downloadComponent(temp, componentPath, componentName) {

  const currentPath = path.join(componentPath, componentName)

  // 缓存入口组件
  let componentArr = []
  componentArr.push(currentPath)

  try {
    // 缓存组件的依赖
    const subArr = createCache(temp, currentPath, componentArr)

    // 缓存新添加的组件路径
    const newComponent = []

    // 遍历复制添加组件到对应的本地路径
    subArr.map(function(item) {
      if (!fs.pathExistsSync(item)) {
        fs.copySync(path.join(temp, item), item)
        newComponent.push(item)
      }
    })

    fs.removeSync(temp)

    // 输出日志，过滤已存在的组件
    log.info()
    newComponent.map(function(item) {
      const tmp = item.split('/')
      log.success(`==> ${tmp[tmp.length-1]} is installed in ${item}`)
    })
    log.info()

  } catch(error) {
    console.log(error)
    fs.removeSync(temp)
  }    
}


/**
 * 缓存组件依赖的子组件关系，存储到数组
 * @param {String}  temp  缓存目录
 * @param {String}  dir   组件目录路径
 * @param {Array}   arr   缓存的目录数据
 */
function createCache(temp, dir, arr) {
  // 读取当前组件的配置文件
  const file = JSON.parse(fs.readFileSync(path.join(temp, dir, 'index.json'), 'utf-8'))

  if (isMiniComponent(file)) {
    // 获取依赖的子组件
    const components = getSubComponent(file)
    if ( components ) {
      components.map(function (item) {
        // 判断子组件是否存在于缓存数组里
        if (arr.indexOf(item) === -1) { 
          // 添加进缓存组件数组  
          arr = arr.concat(item)    
  
          // 循环遍历子组件的下层组件
          const sub = createCache(temp, item, arr)
  
          // 过滤重复
          sub.map(function (item) {
            if (arr.indexOf(item) === -1) {
              arr = arr.concat(item)
            }
          })
        }
      })
    }
  }
  return arr
}

/**
 * 通过配置文件判断是否是小程序组件
 * @param {Object} json 配置文件
 */
function isMiniComponent(json) {
  return json.hasOwnProperty('component') && json['component']
}

/**
 * 读取配置文件，返回依赖的子组件的路径数组
 * @param {Object} json 配置文件
 */
function getSubComponent(json) {
  let arr = []
  if (json.hasOwnProperty('usingComponents')) {
    const components = json['usingComponents']
    for ( let key in components) {
      let url = components[key].split('/')
      const urlArr = url.pop()
      arr.push(url.join('/').substring(1))
    }
  }
  return arr.length > 0 ? arr : null
}


module.exports = install
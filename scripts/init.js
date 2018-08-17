const log = require('../utils/log')
const path = require('path')
const spawn = require('cross-spawn')
const fs = require('fs-extra')
const inquirer = require('inquirer')

const config = require('../config/json.config')
const welcome = require('../utils/welcome')

const selectorTemplatePrompt = inquirer.createPromptModule()

/**
 * 初始化安装指定模板
 * @param {String} name 初始化工程名称
 */
function create(name) {
  const root = path.resolve()
  if (name) {
    // 项目目录
    const baseUrl = path.join('./', name)

    // 是否存在目录，不存在则创建，存在返回null
    const ensureDir = fs.pathExistsSync(baseUrl)

    if (!ensureDir) {
      const templates = []
      for ( let key in config ) {
        templates.push({
          name: config[key].descriptipon,
          value: key
        })
      }

      selectorTemplatePrompt([
        {
          type: 'list',
          message: 'Select Init Template',
          choices: templates,
          name: 'Template',
          default: 'wx-miniprogram'
        }
      ]).then( answers => {
        initOptions(options=> {
          log.info('Downloading template please wait...')
          log.info()
          downloadFile(name, answers.Template, options)
        }) 
      })
    } else {
      log.error(`Folder ${name} already exists, Please checkout! `)
    }
  } else {
    log.success(`init a Project[${name}] in ${root}.`)
    log.info()
  }
}

/**
 * 从git下载指定的模板到当前的项目文件夹下
 * @param {String} name 项目文件夹名称
 * @param {String} template 模板名称
 */
function downloadFile(name, template, options) {
  // 当前模板的配置文件
  const currentTemplate = config[template]

  // 创建项目根目录
  const rootPath = path.join('./', name)
  fs.ensureDir(rootPath)
  

  // 临时缓存目录
  const temp = path.join('./', name, '.temp')

  // 远程下载模板工程文件
  const result = spawn.sync('git', ['clone', 'http://git.51wakeup.cn:81/G-FE/templates.git', temp], {'stdio': 'inherit'})

  // 远程模板的目录路径
  const templateAlias = currentTemplate.templateAlias
  const templateUrl = path.join(temp,  templateAlias ?  templateAlias : template)

  // 修改的配置文件名
  const configName = currentTemplate.configFileName

  if (result.status === 0) {
    try {
      fs.copySync(templateUrl,rootPath)
      fs.removeSync(temp)
      rewriteFile(path.join(rootPath, configName), options)
      welcome(template)
    } catch(err) {
      log.error('Download template error:' + err)
    }
  }
}

/**
 * 根据命令输入重写指定的配置文件
 * @param {String} configPath  重新的配置文件路径
 * @param {Object} options     配置文件的参数
 */
function rewriteFile(configPath, options) {
  const configInfo = fs.readFileSync(configPath, 'utf-8')
  const file = JSON.parse(configInfo)
  const newFile = Object.assign({}, file, options)
  try {
    fs.writeFileSync(configPath, JSON.stringify(newFile, 1, 1))
  } catch(err) {
    log.error('update file error:' + err)
  }
}

/**
 * 初始化模板参数
 * @param {Funciton} callback 确认后的回调函数
 */
function initOptions(callback) {
  const wxminiprogramPrompt = inquirer.createPromptModule();
  wxminiprogramPrompt([
    {
      type: 'input',
      message: 'Please input your project name',
      name: 'projectname',
      default: ''
    }, {
      type: 'input',
      message: 'Please input your project description',
      name: 'description',
      default: ''
    }, {
      type: 'input',
      message: 'Please input your project APPId',
      name: 'appid',
      default: ''
    }
  ]).then(function (answers) {
    callback(answers)
  })
}

module.exports = create
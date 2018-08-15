/**
 * 初始化模板配置文件
 * @param {String} descriptipon    模板描述文件
 * @param {String} configFileName  模板中配置文件名
 * @param {String} templateAlias   模板远程仓库中的文件夹别名，如为空字符串或null，则以key为模板目录名下载模板
 * @param {Array}  options         初始化命令行输入参数配置，会与configFileName合并写入项目中，配置参照inquirer库
 */
const config = {
  "wx-miniprogram": {
    descriptipon: "微信小程序原生模板",
    configFileName: "project.config.json",
    templateAlias: "",
    options: [
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
    ]
  },
  "wx-miniprogram-for-mpvue": {
    descriptipon: "微信小程序mpvue模板",
    configFileName: "package.json",
    templateAlias: "",
    options: []
  }
}

module.exports = config
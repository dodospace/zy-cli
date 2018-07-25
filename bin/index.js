#!/usr/bin/env node
var path = require('path');
var fs = require('fs');

var colors = require('colors');

var package = require('../package.json');

var program = require('commander');
var inquirer = require('inquirer');

console.log(program)

program
  .version(package.version)
  .option('-C, --chdir <path>', 'change the working directory')
  .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  .option('-T, --no-tests', 'ignore test hook')

const selectorTemplatePrompt = inquirer.createPromptModule();

const selectorTemplateOptions = [
  {
    type: 'list',
    message: 'Select Init Template',
    choices: [ 
      { name: '微信小程序原生模板', value: 'wx-mini-program' },
      { name: '微信小程序mpvue模板', value: 'wx-mini-program-for-mpvue' }
    ],
    name: 'Template',
    default: 'wx-mini-program'
  }
]

const wxminiprogramPrompt = inquirer.createPromptModule();
const wxminiprogramOptions = [
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
  
program
  .command('init')
  .description('Initialization template')
  .action(function() {
    selectorTemplatePrompt(selectorTemplateOptions)
      .then( answers => {
        templates[answers.Template]()
      })
  });

program
  .command('welcome')
  .description('run the given remote command')
  .action(function() {
    welcome();
  });

program
  .command('teardown <dir> [otherDirs...]')
  .description('run teardown commands')
  .action(function(dir, otherDirs) {
    console.log('dir "%s"', dir)
    if (otherDirs) {
      otherDirs.forEach(function (oDir) {
        console.log('dir "%s"', oDir)
      });
    }
  });

program
  .command('*')
  .description('deploy the given env')
  .action(function(env) {
    console.log('deploying "%s"', env)
  });

program.parse(process.argv);


const templates = {
  'wx-mini-program': function () {
    wxminiprogramPrompt(wxminiprogramOptions)
      .then( answers => {
        const perfixPath = './'
        copyTemplate('config/wxmini.config.json', 'project.config.json', answers)
        copyFolder(path.join(__dirname, '../templates/wx-miniprogram'), './', err => {
          if (err) {
            console.log(err.red)
            return
          }
          welcome()
        })
      })
  },
  'wx-mini-program-for-mpvue': function () {
    console.log('正在开发中，敬请期待!'.green)
  }
}

// 拷贝修改文件
function copyTemplate(from, to, options) {
  var filePath = path.join(__dirname, '../templates', from);
  var fileStr = fs.readFileSync(filePath, 'utf-8');
  const file = JSON.parse(fileStr)
  const newFile = JSON.stringify(Object.assign({}, file, options), null, 2)
  fs.writeFileSync(to, newFile);
}

// 遍历拷贝文件夹与文件
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

// 拷贝文件
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

function welcome() {
  console.log('  ')
  console.log('╭────────────────────────────────────────────────────────────╮'.yellow)
  console.log('│                                                            │'.yellow)
  console.log('│         \033[32m Success!\033[0m                                          │'.yellow)
  console.log('│         \033[33m Welcome\033[0m weixin mini program Template.             │'.yellow)
  console.log('│         \033[36m Enjoy!\033[0m                                            │'.yellow)
  console.log('│                                                            │'.yellow)
  console.log('╰────────────────────────────────────────────────────────────╯'.yellow)
  console.log('  ')
  console.log('  ')
}
// process.exit();

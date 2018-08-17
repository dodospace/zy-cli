#!/usr/bin/env node
const program = require('commander');

const package = require('../package.json')
const welcome = require('../utils/welcome')

const init    = require('../scripts/init')
const install = require('../scripts/install')
const add     = require('../scripts/add')



program
  .version(package.version)
  // .option('-C, --chdir <path>', 'change the working directory')
  // .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  // .option('-T, --no-tests', 'ignore test hook')
 
// 初始化安装模板
program
  .command('init [name]')
  .description('Initialization template')
  .action(function(name) {
    init(name)
  });

// 安装指定的模块和组件
program
  .command('install [name]')
  .description(`Install module or component.`)
  .action(function(name) {
    install(name)
  });

// 快速在当前添加组件到指定的目录下
program
  .command('add [name]')
  .description('Quickly add Component.')
  .option('--save', 'Save the current component in app.json')
  .action(function(name, cmd) {
    add(name, cmd.save)
  })

// 欢迎
program
  .command('welcome')
  .description('run the given remote command')
  .action(function() {
    welcome('ZY-CLI');
  });

/*

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

*/

program.parse(process.argv);


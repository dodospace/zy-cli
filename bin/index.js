#!/usr/bin/env node
var path = require('path');
var fs = require('fs');

var colors = require('colors');

var program = require('commander');
var inquirer = require('inquirer');
const create = require('../scripts/init')
const package = require('../package.json')

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

  
program
  .command('init [name]')
  .description('Initialization template')
  .action(function(name) {
    create(name)
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

process.on('SIGINT', function () {
  console.log('Exit now!');
  process.exit();
});

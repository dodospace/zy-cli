# 项目快速生成脚手架

## 如何调试

```
  $ git clone git git@github.com:dodospace/zy-cli.git
  $ cd zy-cli
  $ sudo npm install -g
  $ zy-cli -h
```

## 命令帮助

### init

通过cmd命令行选择，快速初始化模板，目前支持的有小程序的模板

### add <name> --save

考虑到小程序初始化需要4个基本文件，此命令用于快速生成一个小程序页面或组件
* `name` 字段有多种组成方式，通过`@`符区分前半部分为当前的目标路径，后为模块名称，目标路径还可以用`/`区分文件夹层级
* `--save` 如果是页面，可以通过此参数，将新建的页面，添加到小程序的`app.json`的`pages`配置项中，重复不添加

添加到当前目录下的`components`文件夹中新建
```
  $ zy add button  
```

添加到当前目录下的`demo`文件夹中新建
```
  $ zy add demo@button 
```

添加到当前目录下的`pages/demo`文件夹中新建
```
  $ zy add pages/demo@button 
```

### install [name]

**name**
* 为空或不填，默认执行`npm install`命令，安装当前目录下的`package.json`中的依赖
* `wxui` 默认安装`wxui`这个库下`components`目录下的所有组件 
* `name` 非wxui值，则去寻找`wxui`库下的指定`name`组件，并安装所有依赖的子组件，包括子组件嵌套的依赖
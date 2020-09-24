'use strict'
require('./check-versions')()
// 生产模式
process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
// 路径模块
const path = require('path')
// 对日志输出文案颜色
const chalk = require('chalk')
// 打包插件
const webpack = require('webpack')
// 配置文件
const config = require('../config')
// webpack生产包配置
const webpackConfig = require('./webpack.prod.conf')
// 日志输入插件
const spinner = ora('building for production...')
spinner.start()

//删除命令 打包之前需要删除前次打包文件重新打包

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})

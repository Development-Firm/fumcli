const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const readline = require('readline')
const {
  app_temp,
  server_temp,
  factory_handler_temp,
  error_controller_temp,
  api_features_temp,
  app_error_temp,
  catch_async_temp,
  config_env_template
} = require('../templates/starter_temp')
const { devPackageString, depPackageString } = require('./package')

exports.starter = directory_path => {
  console.log('Creating Express server...')

  // Create the necessary directories
  if (!fs.existsSync(directory_path)) {
    fs.mkdirSync(directory_path)
    fs.mkdirSync(path.join(directory_path, 'controllers'))
    fs.mkdirSync(path.join(directory_path, 'utils'))
    fs.mkdirSync(path.join(directory_path, 'routes'))
    fs.mkdirSync(path.join(directory_path, 'models'))
    fs.mkdirSync(path.join(directory_path, 'img'))
  }

  //TODO: No need for app directory
  fs.writeFileSync(path.join(directory_path, 'config.env'), config_env_template)
  fs.writeFileSync(path.join(directory_path, 'app.js'), app_temp)
  fs.writeFileSync(path.join(directory_path, 'server.js'), server_temp)
  fs.writeFileSync(
    path.join(directory_path, 'controllers/factoryHandler.js'),
    factory_handler_temp
  )
  fs.writeFileSync(
    path.join(directory_path, 'controllers/errorController.js'),
    error_controller_temp
  )
  fs.writeFileSync(
    path.join(directory_path, 'utils/apiFeatures.js'),
    api_features_temp
  )
  fs.writeFileSync(
    path.join(directory_path, 'utils/appError.js'),
    app_error_temp
  )
  fs.writeFileSync(
    path.join(directory_path, 'utils/catchAsync.js'),
    catch_async_temp
  )

  const isWindows = process.platform === 'win32'
  const cmd = isWindows ? 'cmd' : 'npm'
  const npm_init = isWindows ? ['/c', 'npm init', 'npm i express'] : ['init']
  const npm_install_dep = isWindows
    ? ['/c', `npm i ${depPackageString}`]
    : ['i', ...depPackageString.split(' ')]
  const npm_install_dev = isWindows
    ? ['/c', `npm i ${devPackageString}`]
    : ['i', ...devPackageString.split(' ')]

  const child = spawn(cmd, npm_init, {
    cwd: directory_path,
    shell: true,
    stdio: 'inherit'
  })
  child.on('exit', function (code, signal) {
    console.log('npm init command completed')
    const child2 = spawn(cmd, npm_install_dep, {
      cwd: directory_path,
      shell: true,
      stdio: 'inherit'
    })
    child2.on('exit', function (code, signal) {
      const child3 = spawn(cmd, npm_install_dev, {
        cwd: directory_path,
        shell: true,
        stdio: 'inherit'
      })
      child3.on('exit', function (code, signal) {
        console.log('npm i command completed')
      })
    })
  })
}

const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const readline = require('readline')
const chalk = require('chalk')
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

//File generator
const fileGenerator = (directory_path, path, temp) =>
  fs.writeFileSync(path.join(directory_path, path), temp)

//Commands to be run
async function runCommands (directory_path) {
  const isWindows = process.platform === 'win32'
  const cmd = isWindows ? 'cmd' : 'npm'
  const npm_init = isWindows ? ['/c', 'npm init'] : ['init']
  const npm_install_dep = isWindows
    ? ['/c', `npm i ${depPackageString}`]
    : ['i', ...depPackageString.split(' ')]
  const npm_install_dev = isWindows
    ? ['/c', `npm i ${devPackageString}`]
    : ['i', ...devPackageString.split(' ')]
  const createReactApp = isWindows
    ? ['/c', 'npx create-react-app client']
    : ['create-react-app', 'client']

  await new Promise((resolve, reject) => {
    const child = spawn(cmd, npm_init, {
      cwd: directory_path,
      shell: true,
      stdio: 'inherit'
    })
    child.on('exit', function (code, signal) {
      console.log('npm init command completed')
      resolve()
    })
  })

  await new Promise((resolve, reject) => {
    const child2 = spawn(cmd, npm_install_dep, {
      cwd: directory_path,
      shell: true,
      stdio: 'inherit'
    })
    child2.on('exit', function (code, signal) {
      resolve()
    })
  })

  await new Promise((resolve, reject) => {
    const child3 = spawn(cmd, npm_install_dev, {
      cwd: directory_path,
      shell: true,
      stdio: 'inherit'
    })
    child3.on('exit', function (code, signal) {
      console.log('npm i command completed')
      resolve()
    })
  })

  await new Promise((resolve, reject) => {
    const child4 = spawn(isWindows ? cmd : 'npx', createReactApp, {
      cwd: directory_path,
      shell: true,
      stdio: 'inherit'
    })
    child4.on('exit', function (code, signal) {
      console.log('create-react-app command completed')
      resolve()
    })
  })

  console.log(
    chalk.green(`\nSTATUS: Boilerplate has been successfully generated\n`)
  )
}

//Directories to be made
const directories = ['', 'controllers', 'utils', 'routes', 'models', 'img']

//Template Files
const templates = [
  {
    path: 'config.env',
    temp: config_env_template
  },
  {
    path: 'app.js',
    temp: app_temp
  },
  {
    path: 'server.js',
    temp: server_temp
  },
  {
    path: 'controllers/factoryHandler.js',
    temp: factory_handler_temp
  },
  {
    path: 'controllers/errorController.js',
    temp: error_controller_temp
  },
  {
    path: 'utils/apiFeatures.js',
    temp: app_error_temp
  },
  {
    path: 'utils/catchAsync.js',
    temp: catch_async_temp
  }
]

exports.starter = directory_path => {
  console.log('Creating project starter boilerplate...')

  // Create the necessary directories
  if (!fs.existsSync(directory_path))
    directories.forEach(dir => fs.mkdirSync(path.join(directory_path, dir)))

  // Create template files
  templates.forEach(el =>
    fs.writeFileSync(path.join(directory_path, el.path), el.temp)
  )
  // Running neccessary commands
  runCommands(directory_path)
}

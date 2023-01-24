const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const app_temp = require('../templates/app_temp')
const server_temp = require('../templates/server_temp')

exports.starter = directory_path => {
  console.log('Creating Express server...')

  // Create the necessary directories
  if (!fs.existsSync(directory_path)) {
    fs.mkdirSync(directory_path)
  }

  // Create the basic Express files
  //TODO: No need for app directory
  fs.writeFileSync(path.join(directory_path, 'app.js'), app_temp)
  fs.writeFileSync(path.join(directory_path, 'server.js'), server_temp)

  const isWindows = process.platform === 'win32'
  const cmd = isWindows ? 'cmd' : 'npm'
  const npm_init = isWindows ? ['/c', 'npm init', 'npm i express'] : ['init']
  const npm_install = isWindows ? ['/c', 'npm i express'] : ['i', 'express']

  const child = spawn(cmd, npm_init, {
    cwd: directory_path,
    shell: true,
    stdio: 'inherit'
  })
  child.on('exit', function (code, signal) {
    console.log('npm init command completed')
    const child2 = spawn(cmd, npm_install, {
      cwd: directory_path,
      shell: true,
      stdio: 'inherit'
    })
    child2.on('exit', function (code, signal) {
      console.log('npm i command completed')
    })
  })
}

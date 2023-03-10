// LICENSE_CODE DevFUM
const {spawn} = require('child_process');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const {
  app_temp,
  server_temp,
  handler_factory_temp,
  error_controller_temp,
  app_error_temp,
  catch_async_temp,
  config_env_template,
  api_features_temp,
  email_temp
} = require('../templates/starter_temp');
const {dev_package_string, dep_package_string} = require('./package');

//Commands to be run
const run_commands = async function(directory_path){
  const is_windows = process.platform === 'win32';
  const cmd = is_windows ? 'cmd' : 'npm';
  const npm_init = is_windows ? ['/c', 'npm init'] : ['init'];
  const npm_install_dep = is_windows
    ? ['/c', `npm i ${dep_package_string}`]
    : ['i', ...dep_package_string.split(' ')];
  const npm_install_dev = is_windows
    ? ['/c', `npm i ${dev_package_string}`]
    : ['i', ...dev_package_string.split(' ')];
  const create_react_app = is_windows
    ? ['/c', 'npx create-react-app client']
    : ['create-react-app', 'client'];

  await new Promise((resolve, reject)=>{
    const child = spawn(cmd, npm_init, {
      cwd: directory_path,
      shell: true,
      stdio: 'inherit'
    });
    child.on('exit', function (code, signal){
      console.log('npm init command completed');
      resolve();
    });
  });

  await new Promise((resolve, reject)=>{
    const child2 = spawn(cmd, npm_install_dep, {
      cwd: directory_path,
      shell: true,
      stdio: 'inherit'
    });
    child2.on('exit', function (code, signal){
      resolve();
    });
  });

  await new Promise((resolve, reject)=>{
    const child3 = spawn(cmd, npm_install_dev, {
      cwd: directory_path,
      shell: true,
      stdio: 'inherit'
    });
    child3.on('exit', function (code, signal){
      console.log('npm i command completed');
      resolve();
    });
  });

  await new Promise((resolve, reject)=>{
    const child4 = spawn(is_windows ? cmd : 'npx', create_react_app, {
      cwd: directory_path,
      shell: true,
      stdio: 'inherit'
    });
    child4.on('exit', function (code, signal){
      console.log('create-react-app command completed');
      resolve();
    });
  });

  console.log(
    chalk.green('\nSTATUS: Boilerplate has been successfully generated\n')
  );
};

//Directories to be made
const directories = ['', 'controllers', 'utils', 'routes', 'models', 'img'];

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
    path: 'controllers/handlerFactory.js',
    temp: handler_factory_temp
  },
  {
    path: 'controllers/errorController.js',
    temp: error_controller_temp
  },
  {
    path: 'utils/appError.js',
    temp: app_error_temp
  },
  {
    path: 'utils/apiFeatures.js',
    temp: api_features_temp
  },
  {
    path: 'utils/catchAsync.js',
    temp: catch_async_temp
  },
  {
    path: 'utils/email.js',
    temp: email_temp
  }
];

exports.starter = directory_path=>{
  console.log('Creating project starter boilerplate...');

  // Create the necessary directories
  directories.forEach(dir=>{
    const dir_path = path.join(directory_path, dir);
    if (!fs.existsSync(dir_path))
      fs.mkdirSync(dir_path);
  });

  // Create template files
  templates.forEach(
    el=>fs.writeFileSync(path.join(directory_path, el.path), el.temp)
  );
  // Running neccessary commands
  run_commands(directory_path);
};

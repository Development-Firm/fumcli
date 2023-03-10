#! /usr/bin/env node
// LICENSE_CODE DevFUM
/* eslint-disable max-len */

// Import necessary dependencies
const program = require('commander');
const {generate_crud} = require('./commands/gen_crud');
const {add_user} = require('./commands/add_user');
const {starter} = require('./flags/starter');

// Define options and current_path
let options = {};
const current_path = process.cwd();

// Define CLI options
program
  .option('-s, --starter', 'Create a starter Express server')
  .version('0.0.1', '-v, --version', 'Show version')
  .helpOption('-h, --help', 'Show help')
  .action(function (){
    options = this.opts();
  });

// Define gen-crud command and its options
const gen_crud = program
  .command('gen-crud')
  .description('Generate CRUD for an entity')
  .option('-n, --name <name>', 'The name of the entity')
  .option(
    '-a, --attributes <attributes>',
    'A list of attributes for the entity, in the format of "name:type,name:type,..."'
  )
  .option('-m, --models', 'Generate models for the entity')
  .option('-c, --controller', 'Generate a controller for the entity')
  .option('-r, --routes', 'Create routes folder');

// Define add-user command and its options
const add_user_module = program
  .command('add-user')
  .description('This command adds a user feature to the existing started template by generating frontend pages and backend models and APIs. It automatically integrates and applies authentication using JWT')
  .option('-t, --template <template numnber>', 'The template you want to select. By default it selects template 1');

// Define actions for gen-crud and add-user commands
gen_crud.action(cmd=>generate_crud(current_path, cmd));
add_user_module.action(cmd=>add_user(current_path, cmd));

// Parse CLI arguments
program.parse(process.argv);

// Execute starter if starter option is specified, otherwise show help if no command is specified
if (options.starter)

  starter(current_path);

else if (!options.starter && process.argv.slice(2).length === 0)

  program.outputHelp();


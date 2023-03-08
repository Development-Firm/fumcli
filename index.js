#! /usr/bin/env node
// LICENSE_CODE DevFUM
const program = require('commander');
const {generate_crud} = require('./commands/gen_crud');
const {starter} = require('./flags/starter');

let options = {};
const current_path = process.cwd();
program
  .option('-s, --starter', 'Create a starter Express server')
  .version('0.0.1', '-v, --version', 'Show version')
  .helpOption('-h, --help', 'Show help')
  .action(function (){
    options = this.opts();
  });

const gen_crud = program
  .command('gen-crud')
  .description('Generate CRUD for an entity')
  .option('-n, --name <name>', 'The name of the entity')
  .option(
    '-a, --attributes <attributes>',
    // eslint-disable-next-line max-len
    'A list of attributes for the entity, in the format of "name:type,name:type,..."'
  )
  .option('-m, --models', 'Generate models for the entity')
  .option('-c, --controller', 'Generate a controller for the entity')
  .option('-r, --routes', 'Create routes folder');

gen_crud.action(cmd=>generate_crud(current_path, cmd));

program.parse(process.argv);

// Create the necessary directories


if (options.starter)
  starter(current_path);

else if (
  !options.starter &&
  !options.routes &&
  !options.views &&
  process.argv.slice(2).length === 0
)
{
  program.outputHelp();
}

const program = require('commander')
const path = require('path')
const { generateCrud } = require('./commandFunctions/gen_crud')
const { starter } = require('./flagFunctions/starter')

let options = {}

program
  .option('-s, --starter', 'Create a starter Express server')
  .version('0.0.1', '-v, --version', 'Show version')
  .helpOption('-h, --help', 'Show help')
  .action(function () {
    options = this.opts()
  })

const genCrud = program
  .command('gen-crud')
  .description('Generate CRUD for an entity')
  .option('-n, --name <name>', 'The name of the entity')
  .option(
    '-a, --attributes <attributes>',
    'A list of attributes for the entity, in the format of "name:type,name:type,..."'
  )
  .option('-m, --models', 'Generate models for the entity')
  .option('-c, --controller', 'Generate a controller for the entity')
  .option('-r, --routes', 'Create routes folder')

genCrud.action(cmd => generateCrud(path.join(__dirname, 'Temp_App/'), cmd))

program.parse(process.argv)

// Create the necessary directories
if (options.routes) {
  fs.mkdirSync(path.join(__dirname, 'Temp_App/routes'))
  console.log('Routes folder created.')
}

if (options.views) {
  fs.mkdirSync(path.join(__dirname, 'Temp_App/views'))
  console.log('Views folder created.')
}

if (options.starter) {
  starter(path.join(__dirname, 'Temp_App/'))
} else if (
  !options.starter &&
  !options.routes &&
  !options.views &&
  process.argv.slice(2).length === 0
) {
  program.outputHelp()
}

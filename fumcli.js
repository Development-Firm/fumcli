const program = require('commander')
const path = require('path')
const { starter } = require('./flagFunctions/starter')

let options = {}

program
  .version('0.0.1')
  .option('-s, --starter', 'Create a starter Express server')
  .option('-r, --routes', 'Create routes folder')
  .option('-v, --views', 'Create views folder')
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

genCrud.action(cmd => {
  console.log(cmd.name, cmd.attributes, cmd.models, cmd.controller, cmd.output)
})

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
  console.log('No flag specified')
}

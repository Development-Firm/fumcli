const program = require('commander')
const path = require('path')
const { starter } = require('./flagFunctions/starter')

program
  .version('0.0.1')
  .option('-s, --starter', 'Create a starter Express server')
  .option('-r, --routes', 'Create routes folder')
  .option('-v, --views', 'Create views folder')
  .parse(process.argv)

const options = program.opts()

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
} else {
  console.log('No flag specified')
}

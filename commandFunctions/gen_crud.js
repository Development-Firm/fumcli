const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const { model_temp } = require('../templates/gen_crud_temp')

const createModel = (directory_path, entityName, attributes) => {
  let model = model_temp
    .replace(/<NAME>/g, entityName)
    .replace(/<CNAME>/g, entityName.toUpperCase()[0] + entityName.slice(1))
  let entitySchema = ''
  _attributes = attributes.split(',')
  _attributes.forEach(atr => {
    let required, unique, type, trim
    const _atr = atr.split(':')
    atr_name = _atr[0]
    type = _atr[1]
    if (type.includes('*')) {
      required = true
      type = type.split('*').join('')
    }
    if (type.includes(`'`)) {
      required = true
      type = type.split(`'`).join('')
    }
    if (type.includes(`^`)) {
      trim = true
      type = type.split(`^`).join('')
    }
    entitySchema += `${atr_name}:{
          type: ${type},
          ${required ? "required: [true, 'Please tell us your name!']," : ''}
          ${unique ? 'unique: true,' : ''}
          ${trim ? 'trim: true,' : ''}
      },`
  })
  model = model.replace('<MODEL>', entitySchema)
  fs.writeFileSync(
    path.join(directory_path, 'models/' + entityName + '.js'),
    model
  )
  console.log(
    chalk.green(
      `\nSTATUS: "${entityName}"` + ' model has been successfully created\n'
    )
  )
}

exports.generateCrud = (
  directory_path,
  { name, attributes, models, controller, routes }
) => {
  if (!fs.existsSync(directory_path)) {
    console.log(
      chalk.red(
        'ERROR: Please first create boilerplate by using --starter flag\n'
      )
    )
    return
  }
  if (models) createModel(directory_path, name, attributes)
  //   if (controller) createController(directory_path, entity, attributes)
  //   if (routes) createRouter(directory_path, entity, attributes)
}

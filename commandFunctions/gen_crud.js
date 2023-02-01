
// eslint-disable-next-line header/header
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const {model_temp,
  controller_temp,
  router_temp} = require('../templates/gen_crud_temp');

const create_model = (directory_path, entity_name, attributes)=>{
  let model = model_temp
    .replace(/<NAME>/ug, entity_name)
    .replace(/<CNAME>/ug, entity_name.toUpperCase()[0] + entity_name.slice(1));
  let entity_schema = '';
  let _attributes = attributes.split(',');
  _attributes.forEach(atr=>{
    let required, unique, type, trim;
    const _atr = atr.split(':');
    let atr_name = _atr[0];
    type = _atr[1];
    if (type.includes('*'))
    {
      required = true;
      type = type.split('*').join('');
    }
    if (type.includes('\''))
    {
      required = true;
      type = type.split('\'').join('');
    }
    if (type.includes('^'))
    {
      trim = true;
      type = type.split('^').join('');
    }
    entity_schema += `${atr_name}:{
          type: ${type},
          ${required ? `required: [true, 'Please enter ${atr_name}!'],` : ''}
          ${unique ? 'unique: true,' : ''}
          ${trim ? 'trim: true,' : ''}
      },`;
  });
  model = model.replace('<MODEL>', entity_schema);
  fs.writeFileSync(
    path.join(directory_path, 'models/' + entity_name + 'Model.js'),
    model
  );
  console.log(
    chalk.green(
      `\nSTATUS: ${entity_name} model has been successfully created\n`
    )
  );
};

const create_controller = (directory_path, entity_name, attributes)=>{
  let controller = controller_temp
    .replace(/<NAME>/ug, entity_name)
    .replace(/<CNAME>/ug, entity_name.toUpperCase()[0] + entity_name.slice(1));
  fs.writeFileSync(
    path.join(directory_path, 'controllers/' + entity_name + 'Controller.js'),
    controller
  );
  console.log(
    chalk.green(
      `\nSTATUS: ${entity_name} controller has been successfully created\n`
    )
  );
};
const create_router = (directory_path, entity_name, attributes)=>{
  let router = router_temp
    .replace(/<NAME>/ug, entity_name)
    .replace(/<CNAME>/ug, entity_name.toUpperCase()[0] + entity_name.slice(1));
  fs.writeFileSync(
    path.join(directory_path, 'routes/' + entity_name + 'Router.js'),
    router
  );
  console.log(
    chalk.green(
      `\nSTATUS: ${entity_name} router has been successfully created\n`
    )
  );
  let app = fs.readFileSync(path.join(directory_path, '/app.js'), 'utf-8');
  app=app.replace('<Import Router>',
    // eslint-disable-next-line max-len
    `<Import Router>\nconst ${entity_name}Router = require('./routes/${entity_name}Router');\n`)
    .replace('<Use Router middleware>',
      // eslint-disable-next-line max-len
      `<Use Router middleware>\napp.use('/api/v1/${entity_name}', ${entity_name}Router)`);
  fs.writeFileSync(
    path.join(directory_path, 'app.js'),
    app
  );
  console.log(
    chalk.green(
      '\nSTATUS: Integration has been successfully created\n'
    )
  );
};

exports.generate_crud = (
  directory_path,
  {name, attributes, models, controller, routes}
)=>{
  if (!fs.existsSync(directory_path))
  {
    console.log(
      chalk.red(
        'ERROR: Please first create boilerplate by using --starter flag\n'
      )
    );
    return;
  }
  if (models)
    create_model(directory_path, name, attributes);
  if (controller)
    create_controller(directory_path, name, attributes);
  if (routes)
    create_router(directory_path, name, attributes);
};

// LICENSE_CODE DevFUM
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const {
  user_model,
  user_controller_temp,
  auth_controller_temp,
  user_router
} = require('../templates/add_user_temp');

const add_user_backend=directory_path=>{
  fs.writeFileSync(
    path.join(directory_path, 'models/userModel.js'),
    user_model
  );
  console.log(
    chalk.green(
      '\nSTATUS: User model has been successfully created'
    )
  );
  fs.writeFileSync(
    path.join(directory_path, 'controllers/userController.js'),
    user_controller_temp
  );
  console.log(
    chalk.green(
      '\nSTATUS: User controller has been successfully created'
    )
  );
  fs.writeFileSync(
    path.join(directory_path, 'controllers/authController.js'),
    auth_controller_temp
  );
  console.log(
    chalk.green(
      '\nSTATUS: Auth router has been successfully created'
    )
  );
  fs.writeFileSync(
    path.join(directory_path, 'routes/userRouter.js'),
    user_router
  );
  console.log(
    chalk.green(
      '\nSTATUS: User router has been successfully created'
    )
  );
  let app = fs.readFileSync(path.join(directory_path, '/app.js'), 'utf-8');
  app=app.replace('<Import Router>',
    '<Import Router>\nconst userRouter = require(\'./routes/userRouter\');\n')
    .replace('<Use Router middleware>',
      '<Use Router middleware>\napp.use(\'/api/v1/user\', userRouter)');
  fs.writeFileSync(
    path.join(directory_path, 'app.js'),
    app
  );
  console.log(
    chalk.green(
      '\nSTATUS: Integration was successful!\n'
    )
  );
};

const add_user_frontend=(directory_path, template)=>{

} ;

exports.add_user = (
  directory_path,
  {template}
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
  add_user_backend(directory_path);
  if (!template)
    add_user_frontend(directory_path, '1');

  else
    add_user_frontend(directory_path, template);


};

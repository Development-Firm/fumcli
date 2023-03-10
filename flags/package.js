// LICENSE_CODE DevFUM
//Add the required packages in the packages object below
const packages = {
  dependencies: {
    bcryptjs: '^2.4.3',
    'cookie-parser': '^1.4.5',
    'core-js': '^3.18.3',
    cors: '^2.8.5',
    dotenv: '^10.0.0',
    express: '^4.17.1',
    'express-mongo-sanitize': '^2.1.0',
    'express-rate-limit': '^5.3.0',
    helmet: '^4.6.0',
    hpp: '^0.2.3',
    'js-cookie': '^3.0.1',
    jsonwebtoken: '^9.0.0',
    lodash: '^4.17.21',
    mongoose: '^6.0.8',
    morgan: '^1.10.0',
    multer: '^1.4.5-lts.1',
    sharp: '^0.31.2',
    slugify: '^1.6.0',
    validator: '^13.6.0',
    'xss-clean': '^0.1.1',
    nodemailer: '^6.9.1',
  },
  devDependencies: {
    nodemon: '^2.0.19'
  }
};

const convert_packages = function convert_packages (_packages, dev){
  let package_string = '';
  for (let pkg in _packages)

    package_string += `${pkg}@${_packages[pkg]} `;

  if (dev)
    package_string += ' --save-dev';
  return package_string;
};

exports.dev_package_string = convert_packages(packages.devDependencies, true);
exports.dep_package_string = convert_packages(packages.dependencies);

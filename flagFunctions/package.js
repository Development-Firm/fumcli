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
    'xss-clean': '^0.1.1'
  },
  devDependencies: {
    nodemon: '^2.0.19'
  }
}

const convertPackages = function convertPackages (packages, dev) {
  let packageString = ''
  for (let package in packages) {
    packageString += `${package}@${packages[package]} `
  }
  if (dev) packageString += ' --save-dev'
  return packageString
}

exports.devPackageString = convertPackages(packages.devDependencies, true)
exports.depPackageString = convertPackages(packages.dependencies)

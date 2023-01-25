exports.config_env_template = `
NODE_ENV= development
DATABASE=mongodb://localhost:27017/db_name
#DATABASE_PASSWORD=
JWT_SECRET=tferfa-efsfy-kfoi-kfam-nfay
JWT_EXPIRE_TIME=90d
JWT_COOKIE_EXPIRE_TIME=90
PORT=3001
`

//Follwoing is the Code for app.js
exports.app_temp = `
// ********* ALL REQUIRE MODULES ************
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const path = require('path')
const cookieParser = require('cookie-parser')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

//TODO: Include Routers

const app = express()
app.use(cors())

//Optimize:      ************** Global Midle-Wares ***************

//! To set headers
app.use(helmet())

//! Logging Middleware
if (process.env.NODE_ENV.trim() === 'development') {
  app.use(morgan('dev')) // to see the information of request in console
}

//! limit the requests from same IP address (Rate-limiting middle-ware)
const limiter = rateLimit({
  max: 100, //no of request per IP in below time
  windowMs: 60 * 60 * 1000, // 1-hour
  message: 'Too many request from this IP, please try again in an hour!'
})
app.use('/api', limiter)

//! Body parser MiddleWare
app.use(express.json({ limit: '10kb' })) // to attached the content of body to request obj(req.body) (mostly for patch request)

//! Cookie parser MiddleWare
app.use(cookieParser()) // to attached the cookies of request to req.cookies

//! attach form data to req.body
app.use(express.urlencoded({ extended: true }))

//! Data Sanitization Middlewares

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize()) //basically remove all the '$' signs and 'dots'

// Data sanitization against XSS attack
app.use(xss()) //clean  malicious html code from user input

//! MiddleWare for specfic routes

//TODO: Use Router middleware

//! Settings for Deployment
app.use('/image', express.static(path.join(__dirname, 'img')))

//! Middleware for handling all other(ERROR) unhandled routes
// app.all('*', (req, res, next) => {
//   next(new AppError("Can't find "+req.originalUrl+" , on this server!", 404)) // express automatically knows that, this is an error, so it call error handling middleware
// })

// ! ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler)

module.exports = app
`

//Follwoing is the Code for server.js
exports.server_temp = `
/* eslint-disable no-console */
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const express = require('express')

process.on('uncaughtException', err => {
console.error(err.name + ' ' + err.message)
process.exit(1)
})

dotenv.config({
path: './config.env'
})
const app = require('./app')

const DB = process.env.DATABASE.replace(
'<password>',
process.env.DATABASE_PASSWORD
)
mongoose
.connect(DB, {
useNewUrlParser: true,
useUnifiedTopology: true
})
.then(() => console.log('Database connection successfull!✨✨'))

let port = process.env.PORT || 30001
const server = app.listen(process.env.PORT, () => {
console.log('Starting the server at 127.0.0.1:' + process.env.PORT)
})

process.on('unhandledRejection', err => {
console.error(err.name + ' ' + err.message)

server.close(() => {
process.exit(1)
})
})
`

//Follwoing is the Code for controllers/errorController.js
exports.error_controller_temp = `
const AppError=require( "../utils/appError" );


const handleCastErrorDB=( err ) => {
    const message="Invalid "+err.path+": "+err.value;
    return new AppError( message, 400 );
}

const handleDuplicateKeyErrorDB=( err ) => {
    const message="Duplicate field value: {" +err.keyValue.name+" }, please use another value!"
    return new AppError( message, 400 )
}

const handleValidationError=( err ) => {
    const errArray=Object.values( err.errors ).map( el => el.message );
    const message="Invalid input data. "+errArray.join( ". " );
    return new AppError( message, 400 );
}


const handleJwtError=() => new AppError( 'Invalid Token! :(', 401 )

const handleJwtExpiredError=() => new AppError( "Your token has expired!, Please log in again :)", 401 )



const sendErrorDev=( err, req, res ) => {
    // FOR Api endpoints
    if ( req.originalUrl.startsWith( '/api' ) ) {
        res.status( err.statusCode ).json( {
            status: err.status,
            error: err,
            stackTrace: err.stack,
            message: err.message
        } )
    }

    // For normal endpoints
    else {
        res.status( 200 ).render( 'error', {
            title: "Something went very wrong!",
            msg:err.message,
        } );
    }

}

const sendErrorProd = ( err,req,res ) => {


    // Operational Error: send message to client
    if ( err.isOperational && req.originalUrl.startsWith( '/api' )) {
        res.status( err.statusCode ).json( {
            status: err.status,
            message: err.message
        } )
    }
    // Progamming or other unkown errorrs: don't leak details to client
    else if ( req.originalUrl.startsWith( '/api' )) {

        // console.error( 'ERROR 💥', err );

        res.status( 500 ).json( {
            status: 'error',
            message: "Something went wrong"
        } )
    }

    else {
        res.status( 200 ).render( 'error', {
            title: "Something went very wrong!",
            msg: err.message,
        } );
    }

}


module.exports=( err, req, res, next ) => {
    err.statusCode=err.statusCode||404;
    err.status=err.status||'error';

    if ( process.env.NODE_ENV.trim()==='development' ) {
        sendErrorDev( err, req, res );

    } else if ( process.env.NODE_ENV.trim()==='production' ) {

        const errorName=err.name;
        let error={
            ...err
        };
        error.name=errorName;
        error.message="Please try again later!";

        if ( error.name==="CastError" ) error=handleCastErrorDB( error ); // converting our error to operational

        if ( error.code===11000 ) error=handleDuplicateKeyErrorDB( error ); // converting our error to operational

        if ( error.name==="ValidationError" ) error=handleValidationError( error ); // converting our error to operational

        if ( error.name==="JsonWebTokenError" ) error=handleJwtError(); // converting our error to operational

        if ( error.name==="TokenExpiredError" ) error=handleJwtExpiredError(); // converting our error to operational

        sendErrorProd( error, req ,res );

    }


}
`

//Follwoing is the Code for controllers/factoryHandler.js
exports.factory_handler_temp = `
const catchAsync = require('../utils/catchAysnc')
const AppError = require('../utils/appError')

// eslint-disable-next-line import/no-dynamic-require
const APIFeatures = require(__dirname+"/../utils/apiFeatures")

//Fix:  Delete documents from DB based on id provided in url
exports.deleteOne = Model => {
  return catchAsync(async (req, res, next) => {
    // eslint-disable-next-line no-unused-vars
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) {
      return next(
        new AppError("Could not found document with ID: "+req.params.id, 404)
      )
    }
    res.status(204).json({
      status: 'success',
      data: null
    })
  })
}

//Fix:  update documents from DB based on id provided in url
exports.updateOne = Model => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true
      // runValidators: true
    })

    if (!doc) {
      return next(
        new AppError(
          "Could not find the document with ID: "+req.params.id,
          404
        )
      )
    }

    res.status(200).json({
      status: 'success',
      data: doc
    })
  })
}

//Fix:  Create document in DB
exports.createOne = Model => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body)
    res.status(201).json({
      status: 'success',
      data: doc
    })
  })
}

//Fix: Get a document from DB based on id provided in url
exports.getOne = (Model, populateOptions) => {
  return catchAsync(async (req, res, next) => {
    req.params.id = req.params.id || req.user._id

    let query = Model.findById(req.params.id)

    if (populateOptions) query = query.populate(populateOptions)
    const doc = await query

    if (!doc) {
      return next(
        new AppError("Could not found document with ID: "+req.params.id, 404)
      )
    }

    res.status(200).json({
      status: 'success',
      data: doc
    })
  })
}

//Fix: Get all the documents from DB
exports.getAll = (Model, populateOptions, options) => {
  return catchAsync(async (req, res, next) => {
    let filterObj = { role: 'user' }

    const features = new APIFeatures(
      Model.find(filterObj).select('+password'),
      req.query
    )

    features.filter().sort().limitFields().paginate()

    // ! EXECUTE THE QUERRY
    let query = features.query
    let docs
    if (options) {
      query = query
        .find(options)
        .select('userId phone role duration startingTime password')
    }

    if (populateOptions) {
      query = query.populate(populateOptions)
    }

    docs = await query

    // ! SENDING THE REPONSE
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: docs
    })
  })
}

`

//Follwoing is the Code for utils/apiFeatures.js
exports.api_features_temp =
  `
// eslint-disable-next-line no-unused-vars
class APIFeatures {

    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }


    // ! BUILT THE QUERY
    filter() {
        const queryObj = {
            ...this.queryString
        };

        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach(val => delete queryObj[val]);

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(` +
  `/\\b(gt|gte|lt|lte)\\b/g` +
  `, matchedVal => "$"+matchedVal);

        const queryObj2 = JSON.parse(queryString);

        this.query = this.query.find(queryObj2);
        return this;
    }

    // ! APPLY SORTING
    sort() {

        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('createdAt imageCover');
        }
        return this;
    }


    // ! APPLY PAGINATION
    paginate() {
        const PAGE = Number(this.queryString.page) || 1;
        const LIMIT = Number(this.queryString.limit) || 100;
        const SKIP = (PAGE - 1) * LIMIT;

        this.query = this.query.skip(SKIP).limit(LIMIT);
        return this;
    }


    // ! APPLY PROJECTION
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query;
        }
        return this;
    }



}

module.exports = APIFeatures;
`

//Follwoing is the Code for utils/appError
exports.app_error_temp = `
class AppError extends Error {
  constructor( message, statusCode ) {
      super( message );

      this.statusCode = statusCode;
      this.status = (""+statusCode).startsWith( '4' ) ? "fail" : "error";
      this.isOperational = true;

      // To add the stack trace of error
      Error.captureStackTrace( this, this.constructor );

  }
}
module.exports = AppError;
`

//Follwoing is the Code for utils/catchAsync
exports.catch_async_temp = `
module.exports = ( fn ) => {
  return function ( req, res, next ) {
      fn( req, res, next ).catch( err => next( err ) );
  }

}
`

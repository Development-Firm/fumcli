// LICENSE_CODE DevFUM
exports.model_temp = `
const mongoose=require( 'mongoose' );
const validator=require( "validator" );  

//Optimize:  ********* <NAME> Modal Schema ***********
const <NAME>Schema=new mongoose.Schema( {
    
<MODEL>

}, {
  // TO SEE VIRTUAL FIELDS 
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },

} );


//Todo: ********* Adding virtual properties ***********
// *** Whatever return will be set to virtual property value
// <NAME>Schema.virtual( 'nickName' ).get( function () {
//   return this.name.slice(0,3);
// } )


//Todo: ********* Document/query/aggregation middlewares ***********

// **** DOCUMENT MIDDLEWARE: runs before .save() and .create()
<NAME>Schema.pre( 'save', async function ( next ) {
  // HERE 'this' keyword === current document 


  next();
} )


// **** QUERRY MIDDLEWARE: runs before executing any find query
<NAME>Schema.pre( /^find/, async function ( next ) {
  // HERE 'this' keyword === querry Obj



  next();
} )


// **** AGGREGATION MIDDLEWARE: runs before executing Agrregation pipepline
<NAME>Schema.pre( 'aggregate', async function ( next ) {
    // HERE 'this' keyword === aggregation Obj



  next();
} )




//TODO:  ********* instance methods of documents ***********


<NAME>Schema.methods.checkName=async function () {
  return ""; // return anything based on logic
}


const <CNAME>=mongoose.model( '<NAME>', <NAME>Schema );


module.exports=<CNAME>;
`;

exports.controller_temp = `
const <CNAME>=require( "../models/<NAME>Model" );
const catchAsync=require( "../utils/catchAsync" );
const AppError=require( "../utils/appError" );
const factory=require( './factoryHandler' );


//Todo:  ********* helper functuions ***********


// Optimize: get all 
exports.getAll<CNAME>=factory.getAll( <CNAME> );

// Optimize: get single data basaed on id
exports.getSingle<CNAME>=factory.getOne( <CNAME> );

// Optimize: Create  
exports.create<CNAME>=factory.createOne( <CNAME> );

// Optimize: update based on id 
exports.update<CNAME>=factory.updateOne( <CNAME> )

// Optimize: delete  based on id 
exports.delete<CNAME>=factory.deleteOne( <CNAME> );

//exports.greet=catchAsync( async ( req, res, next ) => {
  
  //? (2) Send the delete response with 204 code
//  res.status( 200 ).json( {
//    status: "success",
//    data: "Hello World!"
//  } )
//} );
`;

exports.router_temp = `
const express=require( "express" );
const {
  getAll<CNAME>,
  getSingle<CNAME>,
  create<CNAME>,
  update<CNAME>,
  delete<CNAME>} = require( "../controllers/<NAME>Controller" );


const <NAME>Router=express.Router();

//Optimize:   ***** Routes ******


<NAME>Router.route( '/' ).get(getAll<CNAME>).post(create<CNAME>);

<NAME>Router.route( "/:id" )
   .get( getSingle<CNAME> )
   .delete( delete<CNAME> )
   .patch( update<CNAME> )



module.exports=<NAME>Router;
`;


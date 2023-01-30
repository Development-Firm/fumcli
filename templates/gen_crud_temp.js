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
`

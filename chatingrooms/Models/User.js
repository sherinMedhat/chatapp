var mongoose = require('mongoose');
var schema = mongoose.Schema;

var User = new schema({
   
    name: { type : String },
    email: { type : String },
    password: { type : String } ,
    


}, { collection : 'users' });




//mongoose.model('User', User);
module.exports = mongoose.model('User',User);
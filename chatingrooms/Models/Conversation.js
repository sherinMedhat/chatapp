var mongoose = require('mongoose');
var schema = mongoose.Schema;

var Conversation = new schema({
    members: {type : Array, "default" : []},
    
    message: [{
            from: { type : String },
            msgbody : { type : String },
            timestamp : { type : Date, default: Date.now }
        }]


}, { collection : 'Conversations' });

//mongoose.model('User', User);
module.exports = mongoose.model('Conversation', Conversation);
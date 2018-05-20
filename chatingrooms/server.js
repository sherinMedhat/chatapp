var express = require('express');
var app = express();
//app.set('view engine', 'ejs');
app.use(express.static(__dirname ));
//app.use(express.static(path.join(__dirname, "public")));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/Home.html')
   // res.send('hello word');

});

//var server = app.listen(7777);

//server.listen(7777, function () {
//    console.log('listening on *:3000');
//});
var http = require('http').Server(app);
var io = require('socket.io')(http);
var people = {};
io.on('connection', function (client) {
    console.log('Client connected...');
    
    
    client.username = "Anonymous";
    
    client.on('change_username' , function (data) {
        client.username = data.username
        client.isactive = true;
       // client.id = data.id
        people[data.id] = client.id;
    })
    
    client.on("new_message" , function (data) {
        
        console.log("new messageserver");
        console.log( data.toUserid +" " + data.username);
        //broadcast //client id not correct
        //sent to one socket
      client.to(people[data.toUserid]).emit('new_message' , {
            message : data.message , fromuserid : data.fromuserid , username: data.username ,
            toUserid : data.toUserid , tousername : data.tousername
        })
        //sent to me 
        client.emit('new_message' , {
            message : data.message , fromuserid : data.fromuserid , username: data.username ,
            toUserid : data.toUserid , tousername : data.tousername
        })  


         
    })


  
});
///db connection 
var db = require('./DBConnection');

var UserController = require('./UserController');
app.use('/user', UserController);

var ConversationController = require('./ConversationController');
app.use('/Conversation', ConversationController);

module.exports = app;

http.listen(7777, function () {
    console.log('listening on *:3000');
});









//server.listen(7777);

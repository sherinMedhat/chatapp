$(function () {

    var socket = io.connect('http://localhost:7777');
    var socket = io();
    
    //console.log("here");
    var message = $("#message");
    var Username = $("#Username");
    var password = $("#password");//
    var fromUserID = $("#fromUserID");
    var send_message = $("#send_message");
    var send_username = $("#send_username");
    var chatroom = $("#chatroom");
    var usersList = $("#usersList");
    var chatWith = $('.chatWith');
    var chatwithuserlegend = $('#chatwithuserlegend');
    var chatwithuserIDHidden = $('#chatwithuserIDHidden');
    var canchat = $('#canchat');
    var chatboxinputs = $('#chatboxinputs');
    var signup_username = $('#signup_username');
   var error_messages = $('#error_messages');
    //events
    send_message.click(function () {
        
        console.log(message)
        console.log(fromUserID.val())
        console.log(Username.val())  
        socket.emit('new_message' , {
            message : message.val() ,
            fromuserid : fromUserID.val() , username: Username.val() ,
            toUserid : chatwithuserIDHidden.val() , tousername : chatwithuserlegend.val()
        })
 
        //call database save new message 
        //if exists update message 
        insertUpdateMessageForchatmembers(fromUserID.val() , chatwithuserIDHidden.val() , message.val());

      
    })
    
    
    signup_username.click(function (){

        SignupCheckUserExists(Username.val() , function (user) {
            if (user) { //already exists 
                error_messages.text('*user name already Exists please enter another one ');
            } else {
                
                var user = {
                    name : Username.val() ,
                    password : password.val() ,

                }
                
                signupInsertUser(user , function () {
                
                    error_messages.text('*signed up successfuly please login to get started');
                
                })
            }
        
        
        })

    })

    send_username.click(function () {
        console.log(Username.val())
        
        checkUserExistance(Username.val() , password.val() );



    })
    
    
    $('#usersList').on('click', 'button',function () {
       
        var touserid = $(this).attr('id');
        var fromuserid = fromUserID.val();
        
    
        getsingleUserInfo(touserid , function (Userinfo) {
            chatboxinputs.attr("style", "display:block");
            if (Userinfo) {
                chatroom.children('p').remove();
                chatwithUserinfoHtml(Userinfo , function (user) {
                
               
                    getchathistory(fromuserid, touserid);

                    //add scroll 
                    $('#usersList').animate({
                        scrollTop: $("#usersList").offset().top
                    }, 2000);

                })

               
            }
        
        });
  
        //get user info from db
    })    
    //end events
    
    //socket recive
    socket.on("new_message" , function (data) {
        message.val('');
        console.log(data);
        console.log(data.username)
        console.log("testing new message client"+data.username)
        //var mesg = { from : msgbody }
      //put msg in chat room
        if (data.toUserid == chatwithuserIDHidden.val()) { //at reciever if at sender no notfication
            addmessagetochat(data);
        } else { //send notification only 
            if (data.fromuserid == chatwithuserIDHidden.val()) { 
                addmessagetochat(data);
            } else {
                 addmessagenotofication(data);
            }
                


            
        }
       
       // chatroom.append("<p class='message'>" + data.username + ":" + data.message + "</p>")
    })
    
    
    //end socket recive

    
    
 
    function insertUpdateMessageForchatmembers( fromuser ,touser , newmessage )
    {
        var messagedata = {
            from : fromuser ,
            msgbody : newmessage


        }
        var conversation = {
            members: [fromuser , touser],
            message : messagedata 
        }
        
        
        console.log(conversation);
        $.post("/Conversation/"+ fromuser+"/"+ touser, conversation , function (Conversation) {
            console.log(Conversation);
      
        
        });
    }
    
    
    
    //function change client html  
    function addUserhtml(userobj)
    {
        console.log(userobj.name);
        if (userobj._id != fromUserID.val()) {
            usersList.append('<button id="' + userobj._id + '" class="chatWith backgroundchat buttonsize" type="button">' + userobj.name + '<br/><span class="notification"></span></button>');
            usersList.append('<br/>')
        }
       
    
    }
    
    function addmessagenotofication(message)
   {
        var char10Length = message.message;
      //  alert(message.fromuserid);
        console.log($("#" + message.fromuserid).children(".notification"))
        if (char10Length) {
            if (char10Length.length > 10) char10Length = char10Length.substring(0, 10);

            $("#" + message.fromuserid).children(".notification").first().text(char10Length + " ...");
          //  $(".notification").text(char10Length + " ...");
        
          
        }
      
    }
    function addmessagetochat(message )
    {
        console.log("again" + message.username + " " + message.message)
        //chatboxinputs.attr("style", "display:block");
        chatroom.append("<p class='message' >" + message.username + ":" + message.message + "</p>")


    }
//    end change client html functions 
    
    //user functions 
    function signupInsertUser(user ,callback)
  {
        $.post("/user/" , user , function (user) {
            //remove error add signup succefully
               
            callback();
        });
    }
  function getchathistory(fromuser , touser)
{
      $.get("/Conversation/" + fromuser + "/" + touser , function (Conversation) {
            
           // addmessagetochat(data.username  , data.message);
           // Conversation.message.forEach(addmessagetochat);
            //
            Conversation.message.forEach(function (msgobj) {
                console.log("retrive name of from id" + msgobj.from)

                getsingleUserInfo(msgobj.from , function (user) {
                   
                    var newobject = {
                        username : user.name ,
                        message : msgobj.msgbody

                    }
                    console.log("test recive" + user.name + " " + newobject.message);
                    addmessagetochat(newobject);
                })


            });




      ///
        });
} 
    
    function chatwithUserinfoHtml(user, callbackafterfinish){
        chatwithuserlegend.text("chat with " + user.name);
        chatwithuserIDHidden.attr("value", user._id);
        callbackafterfinish(user);

    }
    function getsingleUserInfo(userId ,callbacktocontinue) {
        $.get("/user/"+userId , function (user) {
            console.log(user.name+ "  info from user function ");
           

            callbacktocontinue(user);
        });
        
    };    

    function checkUserExistance(username , password , callback) {
        $.get("/user/" +username + "/" + password   , function (users) {
            
            CheckUserExistancecallback(users);
        });


    }
    function SignupCheckUserExists(username  , callback) {
     
        $.get("/user/signup/checkexist/" + username    , function (users) {
           
            callback(users);
        });


    }    
    function CheckUserExistancecallback(users)
    {
       
        console.log(users._id);
        console.log(socket.isactive + "active");

        console.log("username " + users.name + "  pass " + users.password + " id " + users._id);
        if (users._id != null) {
            socket.emit('change_username' , { username : users.name , id : users._id })
            console.log(socket.isactive + "activeagain");

            canchat.attr("style", "display:block");
            fromUserID.attr("value" ,users._id);
            getUsersList();
            
        } else {
            canchat.attr("style", "display:none");
          
        }
    }

    function getUsersList() {
        $.get("/user" , function (users) {
            
            users.forEach(addUserhtml);
        
        });
        
    };
    




})






var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./Models/User'); 
 
// CREATES A NEW USER
router.post('/', function (req, res) {
    var user = new User(req.body);
    var xx = req.body.name;
    user.save().then(function (user) { 
        res.status(200).json({ 'user': 'added successsfully' , 'name' : user.name });
    }).catch(function () {
        res.status(500).send("problem in saving");
    
    });
    
 
});

//check user exists 
router.get('/:username/:password', function (req, res) {
    console.log(req.params.username);
    console.log(req.params.password);
    User.findOne({
        "name" : req.params.username ,
        "password" : req.params.password
    }
        
    , function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users." + err);
        res.status(200).send(users);
    });
});

//get list of users
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users."+err);
        res.status(200).send(users);
    });
});
///
// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

router.route('/signup/checkexist/:username').get( function (req, res) {
    
    console.log(req.params.username + "sign upppppp");
    User.findOne({
        "name" : req.params.username 
    }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) { res.status(200).send(user);
        }
        else {
            res.status(200).send(user);
        }
        
       
    });
});

///
//update
//router.route('/update/:id').post(function (req, res) {
//    Course.findById(req.params.id, function (err, course) {
//        if (!course)
//            return next(new Error('Could not load Document'));
//        else {
//            course.course_name = req.body.course_name;
//            course.course_price = req.body.course_price;
            
//            course.save().then(function( course) {
//                res.json('Successfully Updated');
//            })0
//.catch(function(err) {
//res.status(400).send("unable to update the database");
//});
//}
//});
//});


module.exports = router;
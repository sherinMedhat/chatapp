var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Conversation = require('./Models/Conversation');


// GETS A SINGLE conversation FROM THE DATABASE
router.get('/:fromid/:toid', function (req, res) {
    Conversation.findOne({
        members : {
            $all : [
                req.params.fromid ,
                req.params.toid
            ]
        }
    }
        , function (err, convmssg) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!convmssg) return res.status(404).send("No conversation found.");
        res.status(200).send(convmssg);
    });
});

///
//update
router.route('/:formid/:toid').post(function (req, res) {
    //{awards: {$elemMatch: {award:'National Medal', year:1975}}}
    Conversation.findOne({ members : {
            $all : [
                       req.params.formid ,
                     req.params.toid
            ]}}
       , function (err, conversation) {
        if (!conversation) {
            
            var conversaion = new Conversation(req.body);
            // newly created
            conversaion.save().then(function (conversaion) {
                res.status(200).json({ 'Conversaion': 'added successsfully' });
            }).catch(function () {
                res.status(500).send("problem in saving");
    
            });
        }
        else {
            //conversation.course_name = req.body.course_name;
            conversation.message.push(req.body.message  );
            
            conversation.save().then(function(conversation) {
                res.json('Successfully Updated');
            })
.catch(function(err) {
res.status(400).send("unable to update the database");
});
}
});
});


module.exports = router;
var mongoose = require('mongoose');
mongoose.connect('mongodb://testdb:testdb@ds223760.mlab.com:23760/chat').then(function () {
    console.log('DB connected');

}, function (err) {
    console.log('eror in connection' + err);
});
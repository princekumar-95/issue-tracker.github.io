// importing mongoose library
const mongoose = require('mongoose');

// connecting to localhost/system server
// also tells the name of database which we are connecting to
mongoose.connect('mongodb://localhost/issue_tracker_db');

//connection between database and mongoose is accessed by below code
const db = mongoose.connection;

// if connection gets error
db.on('error', console.error.bind(console, 'connection error to db:'));

// onces we get access to db or connection between database and mongoose gets established
db.once('open',function(){
    console.log('Successfully connected to database');
});
const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');


// creating schema for data to be stored
const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
});

// setting schema for db and naming collection for accessing and using for read, write etc as we did in case of without db by making array and naming it contactList
const Project = mongoose.model('Project', projectSchema);


// we need to export Project so that other file can use this collection and work with it
module.exports = Project; 


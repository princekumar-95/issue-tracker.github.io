const mongoose = require('mongoose');


// creating schema for data to be stored
const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    label:{
        type: String,
        required: true

    },
    author: {
        type: String,
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'

    }
});

// setting schema for db and naming collection for accessing and using for read, write etc as we did in case of without db by making array and naming it contactList
const Issue = mongoose.model('Issue', issueSchema);


// we need to export Project so that other file can use this collection and work with it
module.exports = Issue; 
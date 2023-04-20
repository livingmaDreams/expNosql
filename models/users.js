const mongoose = require('mongoose');
const schema = mongoose.Schema;

const User =  new schema({
    name: {
        type: String,
        required:true
    },
    mail: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    isPremium: {
        type: Boolean,
        required:true,
        default: false
    }
});

module.exports = mongoose.model('User',User);
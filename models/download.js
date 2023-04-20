const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Download = new schema({
    link: {
        type: String,
        required:true
    },
    userId: {
        type : schema.Types.ObjectId,
        ref: 'User',
    required: true
    },
    date: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Download',Download);

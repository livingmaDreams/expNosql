const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Forgotpassword = new schema({
    _id:{
        type: String,
        default: true   
    },
        active: {
            type: Boolean,
            default: true
        },
        expiresby: {
            type: Date,
        },
        userId: {
            type : schema.Types.ObjectId,
            ref: 'User',
        required: true
        }
});

module.exports = mongoose.model('Forgotpassword',Forgotpassword)
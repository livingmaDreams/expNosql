const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Order = new schema({
    orderid: {
        type: String,
        required:true
    },
    paymentid:{
        type: String,
        required:true,
        default: ' '
    },
    status: {
        type: String,
        required:true,
        default: 'PENDING'
    },
     userId: {
        type : schema.Types.ObjectId,
        ref: 'User',
    required: true
    }
});

module.exports = mongoose.model('Order',Order);
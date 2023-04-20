const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Expenses = new schema({
        name: {
            type: String,
            required:true
        },
        amount:{
            type: Number,
            required:true
        },
        description:{
            type: String,
            required:true
        },
        category:{
            type: String,
            required:true
        },
        userId: {
            type : schema.Types.ObjectId,
            ref: 'User',
        required: true
        },
        createdAt:{
            type: Date,
            default: new Date(),
        }
    
});

module.exports = mongoose.model('Expense',Expenses)
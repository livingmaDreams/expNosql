const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

const signupRouter = require('./routes/signup.js')
app.use('/signup',signupRouter);

const loginRouter = require('./routes/login.js');
app.use('/login',loginRouter);

const homeRouter = require('./routes/home.js');
app.use('/home',homeRouter);

const purchaseRouter = require('./routes/purchase.js');
app.use('/purchase',purchaseRouter);

const forgotpasswordRouter = require('./routes/forgotpassword.js');
app.use('/forgotpassword',forgotpasswordRouter);

const User = require('./models/users.js');
const Expense = require('./models/expenses.js');
const Order = require('./models/order')

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

const sequelize = require('./util/database');
sequelize
.sync()
.then(() => app.listen(3000))
.catch(err => console.log(err));

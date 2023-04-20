

const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');

exports.getSignupPage =(req,res,next) =>{
    if(req.originalUrl == '/signup')
     res.sendFile(path.join(__dirname,`../views${req.originalUrl}.html`));
}

const User = require('../models/users.js');

exports.addUser =  async (req,res,next) => {
    
    const name = req.body.name;
    const mail = req.body.mail;
    const password = req.body.password;
try{
    bcrypt.hash(password,10,async (err,hash) => {
       let user = await User.findOne({mail : mail});
       console.log(user)
       if(user){
        res.status(200).json({existingUser: 'found'});
       }
       else {
         user = new User({
            name: name,
            mail: mail,
            password: hash
         })
         const data = await user.save()
          res.status(201).json({newUseradded: 'success',data: data});
       }
    })
}  
catch(err){
    res.status(500).json({status:'failure'});
}
}

exports.getLoginPage = (req,res,next) =>{
    if(req.originalUrl == '/login')
    res.sendFile(path.join(__dirname,`../views${req.originalUrl}.html`));
}

function generateToken(id){
    return jwt.sign({userid: id},process.env.JWT_TOKEN);
}

exports.loginUser = async (req,res,next) =>{
    const mail = req.body.mail;
    const password = req.body.password;
    try{
        const data = await User.findOne({mail:mail});
        bcrypt.compare(password,data.password,(err,result) =>{
            if(err)
              res.status(500).json({status:'something went wrong'});
            if(result === false)
            res.status(401).json({status:'wrongpassword'});
            else
            res.status(200).json({status:'userfound',token: generateToken(data._id),premium: data.isPremium});
        })        
      }
    catch(err){
        res.status(404).json({status:'usernotfound'})
    }
}

exports.getHomePage = (req,res,next) =>{  
    res.sendFile(path.join(__dirname,`../views/home.html`)); 
}

exports.getPremiumPage = (req,res,next) =>{  
    res.sendFile(path.join(__dirname,`../views/premium.html`)); 
}

const Expense = require('../models/expenses.js');

exports.getDailyExpenses = async(req,res,next) =>{
    const page = req.params.page;
    const limit = +req.query.perPage;
    let tDate = new Date().getDate();
try{
    const totalExp =await Expense.find({userId: req.user._id});
    const dailyExp = totalExp.map(exp => {
        if(exp.createdAt.getDate() === tDate)
        return exp });
    const pages = Math.ceil(totalExp.length/limit);
    const exp = dailyExp.slice((page-1)*limit,page*limit)
    if(page == '1')
    res.status(200).json({expenses:exp,totalpages: pages});
    else
    res.status(200).json({expenses:exp,totalpages: 0});
}
catch(err){
    console.log(err);
}
}


exports.getMonthlyExpenses = async (req,res,next) =>{
    const page = req.params.page;
    let tMonth = new Date().getMonth();
    tMonth = tMonth + 1;
    const limit = +req.query.perPage;
try{
    const totalExp =await Expense.find({userId: req.user._id});
    const monthlyExp = totalExp.map(exp => {
        if(exp.createdAt.getMonth() + 1 === tMonth)
        return exp });
    const pages = Math.ceil(totalExp.length/limit);
    const exp = monthlyExp.slice((page-1)*limit,page*limit)
    if(page == '1')
    res.status(200).json({expenses:exp,totalpages: pages});
    else
    res.status(200).json({expenses:exp,totalpages: 0});
}
catch(err){
    console.log(err);
}
}

exports.getYearlyExpenses = async (req,res,next) =>{
    const page = req.params.page;
const yr = new Date().getFullYear();
const limit = +req.query.perPage;
try{
    const totalExp =await Expense.find({userId: req.user._id});
    const monthlyExp = totalExp.map(exp => {
        if(exp.createdAt.getFullYear()  === yr)
        return exp });
    const pages = Math.ceil(totalExp.length/limit);
    const exp = monthlyExp.slice((page-1)*limit,page*limit)
    if(page == '1')
    res.status(200).json({expenses:exp,totalpages: pages});
    else
    res.status(200).json({expenses:exp,totalpages: 0});
}
catch(err){
    console.log(err);
}
}



exports.postDailyExpenses = (req,res,next) =>{
    const name = req.body.name;
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;
 
 try{
   const exp = new Expense({
    name:name,
    category:category,
    description:description,
    amount:amount,
    userId: req.user._id});

const data = exp.save();
res.status(200).json({newexpense:data})
}
catch(err){
    console.log(err)
};  
}

exports.editExpenses =  async (req,res,next) =>{
    const name = req.body.name;
    const amount = req.body.amount;
    const desc = req.body.description;
    const category = req.body.category;
    const id = req.body.id;
    try{
         await  Expense.findOneAndUpdate({_id:id},{name:name,amount:amount,description:desc,category:category});
            res.status(200).json({edited:'true'})
    }catch(err){
        res.status(404).json({edited:'false'})
    };
 }

exports.delExpense = async (req,res,next) =>{
    const name = req.body.name;
    const amount = req.body.amount;
    const desc = req.body.desc;
    const category = req.body.category;

     try{
       const exp =  await Expense.deleteOne({userId : req.user._id,name:name,amount:amount,description:desc,category:category})
        res.status(200).json({deleted:'true'})
     }
     catch(err) {res.status(404).json({deleted:'false'})};
 }

const Order = require('../models/order.js');

exports.buyPremium = (req,res,next) =>{
   
    if(req.user.isPremium == 'true')
    res.status(200).json({message:"Premium user"})
    else{
      let razorId;
    var instances = new Razorpay({
        key_id : process.env.RAZORPAY_ID,
        key_secret : process.env.RAZORPAY_SECRET
    })
    const amount = 2000;
    instances.orders.create({amount})
    .then(data => {
        razorId = data.id;
     const order = new Order({orderid: razorId,userId: req.user._id})
     return order.save();
    })
    .then(() => res.status(200).json({orderid: razorId,key: instances.key_id,amount: amount}) )
    .catch(err => res.status(403).json({ message: 'Something went wrong', error: err}));
    }
}

exports.updatePremium = (req,res,next) => {
    const orderid = req.body.orderid;
    const paymentid = req.body.paymentid;
    Order.findOne({orderid:orderid})
    .then(order => {
        return order.updateOne({paymentid: paymentid,status:'SUCCESS'})
    })
    .then(() => {
        return req.user.updateOne({isPremium: true})
    })
    .then(() =>{
        res.status(200).json({message: 'TRANSACTION SUCCESS'})
    })
    .catch(err => res.status(403).json({ error:err, message: 'TRANSACTION FAILED' }));
}

exports.getLeadershipRank = async (req,res,next) =>{
    
    let userExp =[];
    const users = await User.find();
     for(let user of users){
        let obj={};
        let total=0;
        let userName = user.name;
        let id = user._id;
        const expenses = await Expense.find({userId:id});
         for(let expense of expenses){
              if(expense.category == 'credit')
                total = total + expense.amount;
             else
                total = total - expense.amount;
            }
            obj = {username: userName,total:total};
        userExp.push(obj);
     }
 const sort = userExp.sort((a, b) => b.total - a.total)
     res.status(200).send({leadership: sort});
}



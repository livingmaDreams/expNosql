const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.authenticate = (req,res,next) => {
    try{
        const token = req.header('Authorization');
        const user = jwt.verify(token,process.env.JWT_TOKEN);
        User.findOne({_id : user.userid})
        .then(user => {
            req.user = user;
            next();
        })
    }
    catch(err){
        return res.status(401).json({status:false});
    }
}
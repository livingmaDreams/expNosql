const Download = require('../models/download');
const Expense = require('../models/expenses.js');
const User = require('../models/users.js');
const aws = require('aws-sdk');

exports.getDownloadLinks = async (req,res,next) =>{
  try{
    const data = await Download.find({userId:req.user._id})
        res.status(200).json({links:data})
    }
    catch(err){res.status(404).json({status:'Something went wrong'})};

}

function uploadToS3(data,filename){
   
    const BUCKET_NAME=process.env.BUCKET_NAME;
    const IAM_USER_KEY=process.env.IAM_USER_KEY;
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET;

    let s3Bucket = new aws.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET
    });
  
   

    var params = {
      Bucket: BUCKET_NAME,
      Key:filename,
      Body:data,
      ACL: 'public-read'
    };

    return new Promise((res,rej) =>{
        s3Bucket.upload(params,(err,s3res) =>{
            if(err)
            rej(err)
            else
            res(s3res.Location);
        });
    })
 
}
exports.createLink = async (req,res,next) =>{
    try{
    const exp = await Expense.find({userId:req.user._id});
    const jsonExp = JSON.stringify(exp);
    const userId = req.user._id;
    const filename = `expense${userId}/${new Date()}.txt`;
    const fileUrl = await uploadToS3(jsonExp,filename);
    const download = new Download({link:fileUrl,userId:userId,date: new Date()})
     await download.save();
     res.status(200).json({url: fileUrl,status:'success'});
    }
    catch(err){
        res.status(500).json({status:'false',message:err})
    }
    
}
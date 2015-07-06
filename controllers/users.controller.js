/**
 * Created by sharadau on 2/5/2015.
 */
var mongoose = require('mongoose'),
    Users = mongoose.model('Users');

exports.list=function(req,res,next){

    Users.find(function(err, users){
        if(err){
            next(err);
        }
         res.send(users);
    })
};

exports.create=function(req,res){
    var user = new Users (req.body);


    user.save(function(err){
        if(err){
            res.status(400).send(err.err);
        }
        else{
            res.send(user);
        }
    })
};

exports.userById=function(req,res,next,id){
console.log("userById");
    Users.findOne({_id:id},function(err,user){
        if(err){
            next(err);
        }
        if(user){
            req.user=user;
            next();
        }
        else{
            var error={
                error:"User not found"
            };
            res.status(404).send(error);
        }
    });
};
exports.getUserByEmailId=function(req,res,next,emailId){
    console.log("getUserByEmailId:"+emailId);
    Users.findOne({emailId:emailId},function(err,user){
        if(err){
            next(err);
        }
        if(user){
            req.user=user;
            next();
        }
        else{
            var error={
                error:"User not found"
            };
            res.status(404).send(error);
        }
    });
};

exports.getUserByType=function(req,res,next,user_type){
console.log("getUserByType");
    Users.find({user_type:user_type},function(err,user){
        if(err){
            next(err);
        }
        if(user){
            req.user=user;
            next();
        }
        else{
            var error={
                error:"User not found"
            };
            res.status(404).send(error);
        }
    });
};

exports.read=function(req,res){
    res.send(req.user);
};

exports.delete=function(req,res){
    var user = req.user;

    user.remove(function(err){
        if(err){
            console.log(err);
            res.status(400).send(err.err);
        }
        else{
            res.send(user);
        }
    })
};
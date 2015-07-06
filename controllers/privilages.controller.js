/**
 * Created by sharadau on 31-03-2015.
 */
/**
 * Created by sharadau on 2/5/2015.
 */
var mongoose = require('mongoose'),
    Privilages = mongoose.model('Privilages');


exports.list=function(req,res,next){

    Privilages.find(function(err, Privilages){
        if(err){
            next(err);
        }
        res.send(Privilages);
    })
};

exports.create=function(req,res){
    console.log("create Privilage");
    var privilage = new Privilages (req.body);

    privilage.save(function(err){
        if(err){
            console.log("error:"+err);
        }
        else{
            console.log("Added Privilage");
        }
    })
};

exports.privilageById=function(req,res,next,id){
    Privilages.findOne({_id:id},function(err,privilage){
        if(err){
            next(err);
        }
        if(privilage){
            req.privilage=privilage;
            next();
        }
        else{
            var error={
                error:"Privilage not found"
            };
            res.status(404).send(error);
        }
    });
};
exports.privilageForUserType=function(req,res,next,userType){
    console.log("in privilageForUserType:"+userType);
    if(userType == 'admin') {
        Privilages.find({admin: 'yes'}, function (err, privilage) {
            if (err) {
                next(err);
            }
            if (privilage) {
                req.privilage = privilage;
                next();
            }
            else {
                var error = {
                    error: "privilage not found"
                };
                res.status(404).send(error);
            }
        });
    }else if(userType == 'sales_person') {
        Privilages.find({sales_person: 'yes'}, function (err, privilage) {
            if (err) {
                next(err);
            }
            if (privilage) {
                req.privilage = privilage;
                next();
            }
            else {
                var error = {
                    error: "privilage not found"
                };
                res.status(404).send(error);
            }
        });
    }else if(userType == 'participant') {
        Privilages.find({participant: 'yes'}, function (err, privilage) {
            if (err) {
                next(err);
            }
            if (privilage) {
                req.privilage = privilage;
                next();
            }
            else {
                var error = {
                    error: "privilage not found"
                };
                res.status(404).send(error);
            }
        });
    }else if(userType == 'others') {
        Privilages.find({others: 'yes'}, function (err, privilage) {
            if (err) {
                next(err);
            }
            if (privilage) {
                req.privilage = privilage;
                next();
            }
            else {
                var error = {
                    error: "privilage not found"
                };
                res.status(404).send(error);
            }
        });
    }else if(userType == 'CEO_CTO') {
        Privilages.find({CEO_CTO: 'yes'}, function (err, privilage) {
            if (err) {
                next(err);
            }
            if (privilage) {
                req.privilage = privilage;
                next();
            }
            else {
                var error = {
                    error: "privilage not found"
                };
                res.status(404).send(error);
            }
        });
    }
};


exports.read=function(req,res){
    res.send(req.privilage);
};


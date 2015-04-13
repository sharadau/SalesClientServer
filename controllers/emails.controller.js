/**
 * Created by sharadau on 01-04-2015.
 */
/**
 * Created by sharadau on 2/5/2015.
 */
var mongoose = require('mongoose'),
    Emails = mongoose.model('Emails');

exports.list=function(req,res,next){

    Emails.find(function(err, emails){
        if(err){
            next(err);
        }
        res.send(emails);
    })
};
exports.read=function(req,res){
    res.send(req.emails);
};
exports.create=function(req,res){
    var emails = new Emails (req.body);
    // TODO: Add to project
    console.log("in cntrlr: "+emails);
    emails.save(function(err){
        if(err){
            res.status(400).send(err.err);
            console.log(err);
        }
        else{
            res.send(emails);
        }
    })
};

exports.getEmailsForProspectStage=function(req,res,next,prospect_id){
    console.log("getEmailsForProspectStage "+"prospect id: "+prospect_id );

    var params = prospect_id.split("_");
    console.log("reg parm:"+params);
    Emails.find({prospect_id:params[0],stage:params[1]},function(err,emails){

        if(err){
            next(err);
        }
        if(emails){
            req.emails=emails;
            next();
        }
        else{
            var error={
                error:"emails not found for prospect stage "+prospect_id
            };
            res.status(404).send(error);
        }
    });
};




/**
 * Created by sharadau on 01-04-2015.
 */
/**
 * Created by sharadau on 2/5/2015.
 */
var mongoose = require('mongoose'),
    Emails = mongoose.model('Emails');

var config = require('../config/config-dev');

exports.list=function(req,res,next){

    Emails.find(function(err, emails){
        if(err){
            next(err);
        }
        res.send(emails);
    })
};
exports.emailById=function(req,res,next,id){
    Emails.findOne({_id:id},function(err,emails){
        if(err){
            next(err);
        }
        if(emails){
            req.emails=emails;
            next();
            ///res.send(organization);
        }
        else{
            var error= { error:"email not found"};
            res.status(404).send(error);
        }
    });
};
exports.uncategorizedList=function(req,res,next){
    console.log("uncategorizedList ");
    //Emails.find({stage: "0"}, function (err, emails) {
    Emails.find({prospect_id:"",stage: "0"}, function (err, emails) {
    //Emails.find(function(err, emails){
        if(err){
            next(err);
        }
        res.send(emails);
    })
};
exports.uncategorizedListForProspect=function(req,res,next,prospect_id){
console.log("uncategorizedListForProspect : "+prospect_id);
    //Emails.find({stage: "0"}, function (err, emails) {
    Emails.find({prospect_id:prospect_id,stage: "0"}, function (err, emails) {
        //Emails.find(function(err, emails){
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
if(res.flag != "1") {
    var mailOpts, smtpConfig;
    var nodemailer = require('nodemailer');

    transport = nodemailer.createTransport('direct', {
        //debug: true //this!!!
    });

   /* smtpConfig = nodemailer.createTransport('SMTP', {
        service: 'Gmail',
        auth: {
            user: "presalesuser@synerzip.com",
            pass: "sales@synerzip"
        }
    });*/
//construct the email sending module
    /*mailOpts = {
        // from: "sharada.umarane@gmail.com",
        from: req.body.name + ' &lt;' + req.body.from + '&gt;',
        to: req.body.to,
        //replace it with id you want to send multiple must be separated by ,(comma)
        subject: req.body.subject,
        //text: "test email"
        text: req.body.message,
        cc: "presalesuser@synerzip.com"
    };*/
    transport.sendMail({
        from: req.body.from, // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line
        text: req.body.message, // plaintext body
        cc: config.presalesEmailId
    }, console.error);
//send Email
   /* transport.sendMail(mailOpts, function (error, response) {
//Email not sent
        if (error) {
            console.log(error);
            res.end("Email send Failed");
        }
//email sent successfully
        else {
           // res.end("Email sent successfully");
            console.log("Email sent successfully");
        }
    });*/
}
    emails.save(function(err){
        if(err){
          //  res.status(400).send(err.err);
            console.log(err);
        }
        else{
           // res.send(emails);
            console.log("Email saved");
        }
    })
};

exports.getEmailsForProspectStage=function(req,res,next,prospect_id){
    var params = prospect_id.split("_");
   /* if(params[1] == 0)
    {
        console.log("getEmailsForProspect uncategorized " + prospect_id);
        Emails.find({prospect_id: params[0]}, function (err, emails) {

            if (err) {
                next(err);
            }
            if (emails) {
                req.emails = emails;
                next();
            }
            else {
                var error = {
                    error: "emails not found for prospect " + prospect_id
                };
                console.log(error);
                res.status(404).send(error);
            }
        });
    }else {*/
       // console.log("getEmailsForProspectStage " + params[0] + " " + params[1]);
       // Emails.find({prospect_id: params[0], stage: params[1]}, function (err, emails) {
        Emails.find({prospect_id: params[0], stage: params[1]}).sort({'send_date':-1}).find( function (err, emails) {

            if (err) {
                next(err);
            }
            if (emails) {
                req.emails = emails;
                next();
            }
            else {
                var error = {
                    error: "emails not found for prospect stage " + prospect_id
                };
                console.log(error);
                res.status(404).send(error);
            }
        });

    //}
};
exports.getEmailsForProspect=function(req,res,next,prospect_id){
console.log("getEmailsForProspect::: "+prospect_id);

    Emails.find({prospect_id: prospect_id},function(err,emails){

        if(err){
            next(err);
        }
        if(emails){
            req.emails=emails;
            next();
        }
        else{
            var error={
                error:"emails not found for prospect "+prospect_id
            };
            console.log(error);
            res.status(404).send(error);
        }
        //res.send(emails);
    });
};

exports.delete=function(req,res){
    var emails = req.emails;
        emails.remove(function(err){
        if(err){
            console.log(err);
            res.status(400).send(err.err);
        }
        else{
            res.send(emails);
        }
    })
};

exports.update=function(req,res){
    var emails = req.emails;
    var newEmail = req.body;

    for (var i in req.body) {
        emails[i] = JSON.parse(JSON.stringify(req.body[i]));
    }

    emails.save(function(err){
        if(err){
            console.log(err);
            res.status(400).send(err.err);
        }
        else{
            res.send(emails);
        }
    })

};




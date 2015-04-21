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

    var mailOpts, smtpConfig;
    var nodemailer = require('nodemailer');
    smtpConfig = nodemailer.createTransport('SMTP', {
        service: 'Gmail',
        auth: {
            user: "sharada.umarane@synerzip.com",
            pass: "sharada_1210"
        }
    });
//construct the email sending module
    mailOpts = {
        // from: "sharada.umarane@gmail.com",
        from: req.body.name + ' &lt;' + req.body.from + '&gt;',
        to: req.body.to,
        //replace it with id you want to send multiple must be separated by ,(comma)
        subject: req.body.subject,
        //text: "test email"
        text: req.body.message,
        cc: req.body.cc
    };
//send Email
    smtpConfig.sendMail(mailOpts, function (error, response) {
//Email not sent
        if (error) {
            console.log(error);
            res.end("Email send Falied");
        }
//email sent successfully
        else {
            res.end("Email sent successfully");
        }
    });
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



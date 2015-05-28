var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    cors = require('cors'),
    multer  = require('multer'),
    maillistener2  = require('mail-listener2'),
    nodemailer = require('nodemailer'),
    querystring = require('querystring'),
    request = require('request'),
    response = require('response'),
    https = require('https');

module.exports=function(){

    var app = express();

    app.use(cors());
    app.use(favicon(path.join(__dirname,'../favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(methodOverride('_method'));
    app.use(cookieParser());
    //app.use(express.static(path.join(__dirname,    '../public/')));
    app.use('/static', express.static(path.join(__dirname,    '../public/')));

    /*Configure the multer.*/

    app.use(multer({ dest: './uploads/',
        rename: function (fieldname, filename) {
            return filename;
        },
        onFileUploadStart: function (file) {
            console.log(file.originalname + ' is starting ...')
        },
        onFileUploadComplete: function (file) {
            console.log(file.fieldname + ' uploaded to  ' + file.path)
            done=true;
        }
    }));

    /*Handling routes.*/


    //mail notifier
    var notifier = require('mail-notifier');

    var imap = {
        user: "presalesuser@synerzip.com",
        //user: "sharada.umarane@synerzip.com",
        password: "sales@synerzip",
        //password: "sharada_1210",
        host: "imap.gmail.com",
        port: 993,
        tls: true,
        markSeen: true,
       // searchFilter: ["UNSEEN","SEEN", "FLAGGED"], // the search filter being used after an IDLE notification has been retrieved
        tlsOptions: { rejectUnauthorized: false }
    };
    notifier(imap).on('attachment',function(mail) {
    console.log(" on attachemnt:"+attachment.path);
    });
    /*var emailArray = new Array();
    var emailNameArray = new Array();
    var uemailNameArray = [];
    var uemailArray = [];*/

    notifier(imap).on('mail',function(mail){
        var areaMapping = new Array;

        areaMapping[0] = new Array();
        areaMapping[1] = new Array();
        areaMapping[2] = new Array();

        areaMapping[0][0] = 'subu@synerzip.com';
        areaMapping[1][0] = 'hemant@synerzip.com';
        areaMapping[2][0] = 'ashish.shanker@synerzip.com';
        areaMapping[0][1] = 'Bay Area';
        areaMapping[1][1] = 'Texas';
        areaMapping[2][1] = 'Texas';

        var subject = mail.subject;
        var from = mail.from;
       // var date = mail.date.getDate()+"-"+mail.date.getMonth()+"-"+mail.date.getFullYear()+" "+mail.date.getHours()+":"+mail.date.getMinutes()+":"+mail.date.getSeconds();
        var date = mail.date.toDateString();
        var to = mail.to;
        var message = mail.text;
        var cc = '';
        if(typeof mail.cc == "String")
        {
            cc = mail.cc;
        }
        console.log("GOT MAIL on: " +mail.date.toDateString());
       //if email is not generated with sales dashboard
        if(typeof mail.message != "string")
        {
            mail.message = '';
        }
        console.log("check note:"+mail.message.toLowerCase().search("Please note this email is generated using Presales Dashboard"));
        if (mail.message.toLowerCase().search("Please note this email is generated using Presales Dashboard") == -1) {
            //put all emails in db
            var emails = require('../controllers/emails.controller');

            var body = {
                "subject": mail.subject,
                // "to":tos,
                "from": from[0].address,
                "from_name": from[0].name,
                "send_date": date,
                "cc": cc,
                "message": message,
                "contents": message,
                "stage": 0
            };
            var req = {
                "body": body
            };


            //search for prospect
            request('http://localhost:3000/api/projects', {}, function (err, res, body) {
                //request('http://desolate-crag-3719.herokuapp.com/api/projects', {}, function(err, res, body) {

                var prospects = JSON.parse(body);
                var prospectFlag = 0;

                //add prospect id
                for (i = 0; i < prospects.length; i++) {
                    if (subject.toLowerCase().search(prospects[i].name.toLowerCase()) != -1) {
                        console.log("Found prospect in subject with id:" + prospects[i]._id + " name:" + prospects[i].name);
                        req.body.prospect_id = prospects[i]._id;
                        console.log("current stage:"+prospects[i].state_id);
                        req.body.stage = prospects[i].state_id;
                        prospectFlag = 1;
                        break;
                    } else if (typeof message == "string") {

                        if (message.toLowerCase().search(prospects[i].name.toLowerCase()) != -1) {
                            console.log("Found prospect in message with id:" + prospects[i]._id + " name:" + prospects[i].name);
                            req.body.prospect_id = prospects[i]._id;
                            req.body.stage = prospects[i].state_id;
                            prospectFlag = 1;
                            break;
                        }
                    }
                }
                if (prospectFlag == "1") {
                    if (typeof mail.attachments == "object") {
                        //update prospect stage and end date
                        updateProspectStage(prospects[i], prospects[i]._id, date, "Converted", "6");
                        prospects[i].end_date = mail.date.toDateString();
                        updateProspectEndDate(prospects[i], prospects[i]._id);
                    }
                    //add the start_date
                    if (typeof prospects[i].start_date != 'date') {
                        console.log("set start date:" + mail.date.toDateString());
                        prospects[i].start_date = mail.date.toDateString();
                        //update prospect for start date
                        updateProspectStartDate(prospects[i], prospects[i]._id);
                    }
                    //add the initiated by
                    if (typeof prospects[i].initiatedBy != 'string' || prospects[i].initiatedBy == '' ) {
                        console.log("set initiated By:" + mail.from[0].address);
                        if(mail.from[0].address == 'subu@synerzip.com' || mail.from[0].address == 'hemant@synerzip.com' || mail.from[0].address == 'ashish.shanker@synerzip.com')
                        {
                            prospects[i].initiatedBy = mail.from[0].name;

                            //update prospect for start date
                            updateProspectInitiatedBy(prospects[i], prospects[i]._id);
                        }
                    }
                    //add area depend on sales person
                    if (typeof prospects[i].area != 'string' || prospects[i].area == '') {
                        prospects[i].area = '';
                        console.log("set area");
                        for (j = 0; j < areaMapping.length; j++) {
                            if (mail.from[0].address == areaMapping[j][0]) {
                                prospects[i].area = areaMapping[j][1];
                                //update prospect for area
                                updateProspectArea(prospects[i], prospects[i]._id);
                                break;
                            }
                        }


                    }

                }
                var res = {
                    "flag": "1"
                };

                //add participants
                var tos = '';
                var ccs = '';

                //from
                if (from[0].address != 'presalesuser@synerzip.com' && from[0].address != 'presales@synerzip.com' && typeof req.body.prospect_id == "number") {
                    addParticpant(from[0].address, from[0].name, req.body.prospect_id);
                    // emailNameArray[emailNameArray.length] = from[0].name;
                    // emailArray[emailArray.length] = from[0].address;

                }
                //to
                mail.to.forEach(function (toUser) {
                    tos += toUser.address + ";";

                    if (toUser.address != 'presalesuser@synerzip.com' && toUser.address != 'presales@synerzip.com' && typeof req.body.prospect_id == "number") {
                        //console.log("add to:" + toUser.address + " to prospect:" + req.body.prospect_id);
                        addParticpant(toUser.address, toUser.name, req.body.prospect_id);
                        // emailNameArray[emailNameArray.length] = toUser.name;
                        //emailArray[emailArray.length] = toUser.address;
                    }
                });
                //cc
                if (typeof mail.cc == "object") {
                    mail.cc.forEach(function (ccUser) {
                        ccs += ccUser.address + ";";

                        if (ccUser.address != 'presalesuser@synerzip.com' && ccUser.address != 'presales@synerzip.com' && typeof req.body.prospect_id == "number") {
                          //  console.log("add cc:" + ccUser.address + " to prospect:" + req.body.prospect_id);
                            addParticpant(ccUser.address, ccUser.name, req.body.prospect_id);
                            // emailNameArray[emailNameArray.length] = ccUser.name;
                            //emailArray[emailArray.length] = ccUser.address;
                        }
                    });
                }
                /*
                 console.log("email arr:"+emailArray);

                 emailArray.forEach(function(item) {
                 if(uemailArray.indexOf(item) < 0) {
                 uemailArray.push(item);
                 }
                 });
                 console.log("email unique arr:"+uemailArray);

                 console.log("email name arr:"+emailNameArray);


                 emailNameArray.forEach(function(item) {
                 if(uemailNameArray.indexOf(item) < 0) {
                 uemailNameArray.push(item);
                 }
                 });
                 console.log("email unique arr:"+uemailNameArray);

                 uemailArray.forEach(function(emailId,i)
                 {
                 console.log("call for addparticipant :"+emailId+" name:"+uemailNameArray[i]+" prospect:"+req.body.prospect_id);
                 addParticpant(emailId,uemailNameArray[i],req.body.prospect_id);
                 });*/
                tos.substring(0, (tos.length - 1));
                req.body.to = tos;
                req.body.cc = ccs;

                //console.log(req.body);
                emails.create(req, res);

            });

            //console.log("data : "+prospects);

            /* performRequest('/api/projects', 'GET', function(data) {
             console.log('data:', data);
             // getCards();
             });*/
            //var projects = require('../controllers/projects.controller');

            //var prospectList =  projects.list(req,res,'');
            //console.log("Project"+prospectList);

        }
    }).start();

    function updateProspectStage(project, prospect_id, end_date, state, state_id)
    {

        var projects = require('../controllers/projects.controller');
       /* var body ={
           // "_id":prospect_id,
            "end_date":end_date,
            "state":state,
            "state_id":state_id
        };
        var req = {
            "body":body
            //"project":JSON.parse(prj)
        };
        var res = {
            "flag":"1"
        };*/
        //request.put('http://localhost:3000/api/projects/updateStage/'+prospect_id, {multipart:[{body:body}]}, function(err, res, body) {
           // console.log("get project:" + body);
        //});
        request({
            method: 'PUT',
            uri: 'http://localhost:3000/api/projects/updateStage/' + prospect_id,
            //uri: 'http://desolate-crag-3719.herokuapp.com/api/projects/updateStage/' + prospect_id,
            form:
                {
                        state: 'Converted',
                        state_id: '6'
                }
        }, function (error, response, body) {
            if(response.statusCode == 201){
             console.log("prospect stage updated");
              //  console.log('document saved as: http://mikeal.iriscouch.com/testjs/'+ rand);
            } else {
                console.log('error: '+ response.statusCode + " "+error);
                //console.log(body);
            }
        })
          //  console.log("asdsd"+typeof  JSON.parse(project));
        //projects.updateStage(req, res);

    };
    function updateProspectStartDate(project, prospect_id)
    {
console.log("set start date:"+project.start_date);

        var projects = require('../controllers/projects.controller');

        request({
            method: 'PUT',
            uri: 'http://localhost:3000/api/projects/' + prospect_id,
            //uri: 'http://desolate-crag-3719.herokuapp.com/api/projects/' + prospect_id,
            form:
            {
                start_date: project.start_date
            }
        }, function (error, response, body) {
            if(response.statusCode == 201){
                console.log("prospect start date updated");
                //  console.log('document saved as: http://mikeal.iriscouch.com/testjs/'+ rand);
            } else {
                console.log('error: '+ response.statusCode + " "+error);
               // console.log(body);
            }
        })
        //  console.log("asdsd"+typeof  JSON.parse(project));
        //projects.updateStage(req, res);

    };
    function updateProspectEndDate(project, prospect_id)
    {
       // console.log("set end date:"+project.start_date);

        var projects = require('../controllers/projects.controller');

        request({
            method: 'PUT',
            uri: 'http://localhost:3000/api/projects/' + prospect_id,
            //uri: 'http://desolate-crag-3719.herokuapp.com/api/projects/' + prospect_id,
            form:
            {
                end_date: project.end_date
            }
        }, function (error, response, body) {
            if(response.statusCode == 201){
                console.log("prospect end date updated");
                //  console.log('document saved as: http://mikeal.iriscouch.com/testjs/'+ rand);
            } else {
                console.log('error: '+ response.statusCode + " "+error);
                //console.log(body);
            }
        })
        //  console.log("asdsd"+typeof  JSON.parse(project));
        //projects.updateStage(req, res);

    };
    function updateProspectArea(project, prospect_id)
    {
//console.log("updateProspectArea"+project.area);
        var projects = require('../controllers/projects.controller');
        request({
            method: 'PUT',
            uri: 'http://localhost:3000/api/projects/' + prospect_id,
            //uri: 'http://desolate-crag-3719.herokuapp.com/api/projects/' + prospect_id,
            form:
            {
                area: project.area
            }
        }, function (error, response, body) {
            if(response.statusCode == 201){
                console.log("prospect area updated to "+project.area);
                //  console.log('document saved as: http://mikeal.iriscouch.com/testjs/'+ rand);
            } else {
                console.log('error: '+ response.statusCode + " "+error);
                //console.log(body);
            }
        })
        //  console.log("asdsd"+typeof  JSON.parse(project));
        //projects.updateStage(req, res);

    };
    function updateProspectInitiatedBy(project, prospect_id)
    {
        //console.log("update prospect:"+project);

        var projects = require('../controllers/projects.controller');

        request({
            method: 'PUT',
            uri: 'http://localhost:3000/api/projects/' + prospect_id,
            //uri: 'http://desolate-crag-3719.herokuapp.com/api/projects/' + prospect_id,
            form:
            {
                initiatedBy: project.initiatedBy
            }
        }, function (error, response, body) {
            if(response.statusCode == 201){
                console.log("prospect initated By updated");
            } else {
                console.log('error: '+ response.statusCode + " "+error);
               // console.log(body);
            }
        })

    };
    function addParticpant(address, name, p_id )
    {
        var participants = require('../controllers/participants.controller');

        //check if participant exists or not
        request('http://localhost:3000/api/participants/prospect/'+p_id, function(err, res, body) {
        //request('http://desolate-crag-3719.herokuapp.com/api/participants/prospect/'+p_id, function(err, res, body) {
            //console.log("particiapants:"+JSON.stringify(body)+"for project:"+p_id);
            var emails = JSON.parse(body);
            var existsFlag = 0;

            emails.forEach(function(participant){
                //console.log("existing email: "+participant.email + " add : " + address);
                if(participant.email == address)
                {
                    //console.log("do not add email:"+address);
                    existsFlag = 1;
                }
            });
            if(existsFlag == 0)
            {
                //console.log("add email:"+address);
                if(name == ''){
                    name = address;
                }
                var body ={
                    "name":name,
                    "email":address,
                    "prospect_id":p_id,
                    "_id" : getUniqueTime()
                };
                var req = {
                    "body":body
                };
                var res = {
                    "flag":"1"
                };
                participants.create(req,res);
            }
        });

    };
    var getUniqueTime = function() {
        var time = new Date().getTime();
        while (time == new Date().getTime());
        return new Date().getTime();
    };
  /*  function performRequest(endpoint, method, data, success) {
        var dataString = JSON.stringify(data);
        var headers = {};

        if (method == 'GET') {
            endpoint += '?' + querystring.stringify(data);
        }
        else {
            headers = {
                'Content-Type': 'application/json'
               // 'Content-Length': dataString.length
            };
        }
        var options = {
            host: "desolate-crag-3719.herokuapp.com",
            path: endpoint,
            method: method,
            headers: headers
        };

        var req = https.request(options, function(res) {
            res.setEncoding('utf-8');

            var responseString = '';

            res.on('data', function(data) {
                responseString += data;
            });

            res.on('end', function() {
                //console.log(responseString);
                var responseObject = JSON.parse(responseString);
                success(responseObject);
            });
        });
//console.log("datastring"+dataString);
  //      req.write(dataString);
        req.end();
    }*/

   /* notifier(imap).on("attachment", function(attachment) {
        console.log(attachment.path);
    }).start();*/
    /*end mail notifier*/


    return app;
}

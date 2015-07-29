var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    cors = require('cors'),
    multer  = require('multer'),
   // maillistener2  = require('mail-listener2'),
    nodemailer = require('nodemailer'),
    querystring = require('querystring'),
    request = require('request'),
    response = require('response'),
    https = require('https');
    var config = require('./config-dev');

/*var GoogleContacts = require('google-contacts').GoogleContacts;
var c = new GoogleContacts({
    token: '688990567774-hpk2p1u3p1b9cen043bk55pd5mivq23a.apps.googleusercontent.com'
});
c.on('error', function (e) {
    console.log('error', e);
});
c.on('contactsReceived', function (contacts) {
    console.log('contacts: ' + contacts);
});
c.on('contactGroupsReceived', function (contactGroups) {
    console.log('groups: ' + contactGroups);
});
c.getContacts('thin', 100);
//c.getContactGroups('thin', 200);
*/
module.exports=function(){

    var app = express();
    var base_url = config.base_url;
    var upload_url = config.upload_url;
    //var base_url = 'http://lit-wave-1072.herokuapp.com';
    //var upload_url = './static';


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

    app.use(multer({ dest: upload_url+'/uploads/',
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
    var emailAccount = config.presalesEmailId;
    var emailAccountPwd = config.presalesEmailPwd;
    var imap = {
        user: emailAccount,
        //user: "salestool1@synerzip.com",
        //password: "synerzip123",
        password: emailAccountPwd,
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

        console.log("Mail notifier started!!!");


            var subject = mail.subject;
            var from = mail.from;
           // var date = mail.date.getDate()+"-"+mail.date.getMonth()+"-"+mail.date.getFullYear()+" "+mail.date.getHours()+":"+mail.date.getMinutes()+":"+mail.date.getSeconds();
            var date = mail.date.toLocaleString();
            var to = mail.to;
            var message = mail.text;
            var cc = '';
            if(typeof mail.cc == "String")
            {
                cc = mail.cc;
            }
            console.log("GOT MAIL on: " +date);
       //if email is not generated with sales dashboard
        if(typeof mail.message != "string")
        {
            mail.message = '';
        }
        console.log("check note:"+mail.text.match("Please note this email is generated using Presales Dashboard"));
        console.log("html:"+ typeof mail.html);
        if (mail.text.match("Please note this email is generated using Presales Dashboard") == null || ( typeof mail.html == 'string')) {
            //put all emails in db
            console.log("mail sent from personal account");
            var emails = require('../controllers/emails.controller');

            var body = {
                "subject": mail.subject,
                // "to":tos,
                "from": from[0].address,
                "from_name": from[0].name,
                "send_date": mail.date.toLocaleString(),
                "cc": cc,
                "message": message,
                "contents": message,
                "stage": 0
            };

            var req = {
                "body": body
            };


            //search for prospect
            request(base_url+'/api/projects', {}, function (err, res, body) {

                var prospects = JSON.parse(body);
                var prospectFlag = 0;
                var prospectFound = '';
                //add prospect id
                for (i = 0; i < prospects.length; i++)
                {
                    if(typeof subject == 'string')
                    {
                        console.log("prospect:"+prospects[i].name+" subject:"+subject);
                        console.log("subject.length - (prospects[i].name.length+2:"+(subject.length - (prospects[i].name.length+1)));
                        console.log("subject.index+prospects[i].name:"+(subject.indexOf(" "+prospects[i].name)));
                        if ((subject.toLowerCase().indexOf(prospects[i].name.toLowerCase() +" ") == 0) || (subject.indexOf(" "+prospects[i].name)!= -1 && (subject.indexOf(" "+prospects[i].name) == (subject.length - (prospects[i].name.length+1)))) || (subject.length == prospects[i].name.length && subject.toLowerCase() == prospects[i].name.toLowerCase()) || (subject.toLowerCase().search(" "+prospects[i].name.toLowerCase()+" ") != -1) )
                        {
                            console.log("Found prospect in subject with id:" + prospects[i]._id + " name:" + prospects[i].name);
                            req.body.prospect_id = prospects[i]._id;
                            console.log("current stage:"+prospects[i].state_id);
                            req.body.stage = prospects[i].state_id;
                            prospectFlag = 1;
                            prospectFound = prospects[i]._id;
                            break;
                        }
                    }
                    if (typeof message == "string")
                    {
                        console.log("prospect:"+prospects[i].name+" message:"+message);
                        console.log("message.length - (prospects[i].name.length+2:"+(message.length - (prospects[i].name.length+2)));
                        console.log("message.index+prospects[i].name:"+(message.indexOf(" "+prospects[i].name)));
                        //console.log("message.toLowerCase().indexOf(prospects[i].name.toLowerCase():"+(message.toLowerCase().indexOf(prospects[i].name.toLowerCase())));
                        if ((message.toLowerCase().indexOf(prospects[i].name.toLowerCase() +" ") == 0) || (message.indexOf(" "+prospects[i].name)!= -1 && (message.indexOf(" "+prospects[i].name) == (message.length - (prospects[i].name.length+2)))) || (message.length == prospects[i].name.length && message.toLowerCase() == prospects[i].name.toLowerCase()) || (message.toLowerCase().search(" "+prospects[i].name.toLowerCase()+" ") != -1))
                        {
                            console.log("Found prospect in message with id:" + prospects[i]._id + " name:" + prospects[i].name);
                            req.body.prospect_id = prospects[i]._id;
                            req.body.stage = prospects[i].state_id;
                            prospectFlag = 1;
                            prospectFound = prospects[i]._id;
                            break;
                        }
                    }
                }

                //add participants
                var tos = '';
                var ccs = '';
                var nonSynerzipId = false;
                //to
                mail.to.forEach(function (toUser) {
                    tos += toUser.address + ";";

                    if (toUser.address != emailAccount && toUser.address != config.presalesEmailId && toUser.address != 'presales@synerzip.com' && typeof req.body.prospect_id == "number") {
                        console.log("add to:" + toUser.address + " to prospect:" + req.body.prospect_id);
                        addParticpant(toUser.address, toUser.name, prospectFound);
                        //check if one of the email id is non synerzip
                        var emailPart = '';
                        if(toUser.address.toLowerCase().search('synerzip.com') == -1)
                        {
                            console.log("found id without synerzip.com");
                            nonSynerzipId = true;

                        }
                    }
                });
                if (prospectFlag == "1") {


                    console.log("stage:"+prospects[i].state_id);
                    console.log("prospectFound:"+prospectFound);
                    req.body.cycle_id = prospects[i].cycle_id;
                    req.body.cycle_no = prospects[i].cycle_no;
console.log("mail.attachments[0].fileName:"+mail.attachments[0].fileName);
console.log(" prospects[i].state_id < 6:"+ (prospects[i].state_id < 6));
console.log(" nonSynerzipId:"+ nonSynerzipId);
                    if (typeof mail.attachments == "object") {

                        console.log("attachment:"+JSON.stringify(mail.attachments[0].fileName));
                        if(mail.attachments[0].fileName.toLowerCase().search('engagement') != -1) {
                            console.log("found engagement letter");
                            //update prospect stage and end date
                            updateProspectStage(prospects[i], prospects[i]._id, date, "Converted", "6");
                            //update cycle state
                            updateCycleStage(prospects[i].cycle_id,6);
                            prospects[i].end_date = mail.date.toDateString();
                            updateProspectEndDate(prospects[i], prospects[i]._id);
                            //add engagement letter - engagementLetter
                            prospects[i].engagementLetter = mail.attachments[0].fileName;
                            updateProspectEngagementLetter(prospects[i], prospects[i]._id);
                            require("fs").writeFile('./uploads/'+mail.attachments[0].fileName, mail.attachments[0].content, 'base64', function(err) {
                                console.log(err);
                            });
                        }else if(mail.attachments[0].fileName == 'invite.ics' && prospects[i].state_id < 6 && nonSynerzipId == true){
                            console.log("found calendar invite");
                            updateProspectStage(prospects[i], prospects[i]._id, date, "Converted", "6");
                            //update cycle state
                            updateCycleStage(prospects[i].cycle_id,6);
                        }
                    }else if(prospects[i].state_id < 3)
                    {
                        console.log("update state id to 3 as its initiation email");
                        updateProspectStage(prospects[i], prospects[i]._id, date, "Internal Preparation", "3");
                        //update cycle state
                        updateCycleStage(prospects[i].cycle_id,3);
                    }
                    //add the start_date
                    if (typeof prospects[i].start_date != 'date') {
                        console.log("set start date:" + mail.date.toDateString());
                        prospects[i].start_date = mail.date.toDateString();
                        //update prospect for start date
                        updateProspectStartDate(prospects[i], prospects[i]._id);
                    }


                    //add the initiated by
                    console.log("type of :"+typeof prospects[i].initiatedBy);
                    console.log("ini by:"+ prospects[i].initiatedBy);
                    if (typeof prospects[i].initiatedBy != 'string' || prospects[i].initiatedBy == '' ) {

                        //retrieve sales persons
                        var areaMapping = new Array;
                        var saleFlag = false;
                        console.log("check initiated by")
                        request(base_url+'/api/users/user_type/'+'1', {}, function (err, res, body) {
                            var salesPersons = JSON.parse(body);
                            console.log(JSON.parse(body));
                            for (i = 0; i < salesPersons.length; i++) {
                                console.log("sales p:"+salesPersons[i].name);
                                areaMapping[i] = new Array();
                                areaMapping[i][0] = salesPersons[i].emailId;
                                areaMapping[i][1] = salesPersons[i].area;
                                if(mail.from[0].address == salesPersons[i].emailId){
                                    saleFlag = true;
                                    console.log("set initiated By:" + mail.from[0].address);
                                    if(saleFlag)
                                    {
                                        //prospects[i].initiatedBy = mail.from[0].name;
                                        //update prospect for start date
                                        updateProspectInitiatedBy(mail.from[0].name, prospectFound);
                                        console.log("set area");
                                        updateProspectArea(salesPersons[i].area,prospectFound);
                                        console.log("add sales person as participant");
                                        addSalesParticpant(mail.from[0].address, mail.from[0].name, req.body.prospect_id);

                                    }
                                    break;
                                }
                            }
                        });

                    }
                    //add area depend on sales person
                   /* if (typeof prospects[i].area != 'string' || prospects[i].area == '') {
                        prospects[i].area = '';
                        console.log("set area");
                        for (j = 0; j < areaMapping.length; j++) {
                            if (mail.from[0].address == areaMapping[j][0]) {
                                prospects[i].area = areaMapping[j][1];
                                //update prospect for area
                                updateProspectArea(prospects[i].area, prospects[i]._id);
                                break;
                            }
                        }


                    }*/
                    //find client URL
                    var calendarInvite = 0;
                    if (typeof mail.attachments == "object" && mail.attachments[0].fileName != 'invite.ics'){
                        calendarInvite = 1;
                    }
                    if (typeof prospects[i].companyURL != 'string' || prospects[i].companyURL == '' && calendarInvite == 0) {
                        prospects[i].companyURL = '';
                        console.log("set client URL");
                        //search link in content
                        if (message.toLowerCase().search('www.') != -1) {
                            var position = 0;
                            for(var s=0;s<message.toLowerCase().search('www.');s++) {

                                console.log("search position:"+position);
                                var start = message.indexOf('www.',position);
                                var end = message.indexOf('.com',position);
                                var url1 = message.substring(start, end);
                                var url = url1 + '.com';
                                console.log("search if innvite:"+url1.toLowerCase().search('hangouts'));
                                console.log("url1:" + url1 + " url:" + url + " start:" + start + " end:" + end);
                                if (url1 != 'www.facebook' && url1 != 'www.linkedin' && url1 != 'www.synerzip' && url1 != 'www.twitter' && url1.length < 40) {
                                    //update client URL
                                    console.log("set client URL" + url);
                                    prospects[i].companyURL = url;
                                    updateClientURL(prospects[i], prospects[i]._id);
                                    break;
                                }
                                position = end+4;

                            }
                        }
                    }
                }else{

                    console.log("No prospect found");
                }
                var res = {
                    "flag": "1"
                };



                //from
                if (from[0].address != emailAccount && from[0].address != config.presalesEmailId && from[0].address != 'presales@synerzip.com' && typeof req.body.prospect_id == "number") {
                    addParticpant(from[0].address, from[0].name, req.body.prospect_id);
                    // emailNameArray[emailNameArray.length] = from[0].name;
                    // emailArray[emailArray.length] = from[0].address;

                }
                //to
               /* mail.to.forEach(function (toUser) {
                    tos += toUser.address + ";";

                    if (toUser.address != emailAccount && toUser.address != config.presalesEmailId && toUser.address != 'presales@synerzip.com' && typeof req.body.prospect_id == "number") {
                        //console.log("add to:" + toUser.address + " to prospect:" + req.body.prospect_id);
                        addParticpant(toUser.address, toUser.name, req.body.prospect_id);
                        // emailNameArray[emailNameArray.length] = toUser.name;
                        //emailArray[emailArray.length] = toUser.address;
                    }
                });*/
                //cc
                if (typeof mail.cc == "object") {
                    mail.cc.forEach(function (ccUser) {
                        ccs += ccUser.address + ";";

                        if (ccUser.address != config.presalesEmailId && ccUser.address != emailAccount &&  ccUser.address != 'presales@synerzip.com' && typeof req.body.prospect_id == "number") {
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

    function updateCycleStage(cycle_id, stage)
    {
        console.log("in updateCycleStage:"+cycle_id + " "+stage);
        var cycles = require('../controllers/cycles.controller');

        request({
            method: 'PUT',
            uri: base_url+'/api/cycles/' + cycle_id,
            form:
            {
                current_state: stage
            }
        }, function (error, response, body) {
            if(response.statusCode == 201){
                console.log("cycle stage updated");
            } else {
                console.log('error: '+ response.statusCode + " "+error);
            }
        })
    }
    function updateProspectStage(project, prospect_id, end_date, state, state_id)
    {
        var projects = require('../controllers/projects.controller');

        console.log("in updateCycleStage:"+prospect_id+" state:"+state);
        request({
            method: 'PUT',
            uri: base_url+'/api/projects/updateStage/' + prospect_id,
            form:
                {
                        state: state,
                        state_id: state_id
                }
        }, function (error, response, body) {
            if(response.statusCode == 201){
             console.log("prospect stage updated:"+prospect_id+" st:"+state);
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
            uri: base_url+'/api/projects/' + prospect_id,
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

    function updateProspectEngagementLetter(project, prospect_id)
    {
         console.log("updateProspectEngagementLetter:"+project.engagementLetter);

        var projects = require('../controllers/projects.controller');

        request({
            method: 'PUT',
            uri: base_url+'/api/projects/' + prospect_id,
            form:
            {
                engagementLetter: project.engagementLetter
            }
        }, function (error, response, body) {
            if(response.statusCode == 201){
                console.log("prospect engagement letter updated");
            } else {
                console.log('error: '+ response.statusCode + " "+error);
            }
        })

    };
    function updateProspectEndDate(project, prospect_id)
    {
       // console.log("set end date:"+project.start_date);

        var projects = require('../controllers/projects.controller');

        request({
            method: 'PUT',
            uri: base_url+'/api/projects/' + prospect_id,
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
    function updateProspectArea(area, prospect_id)
    {
console.log("updateProspectArea"+area);
        var projects = require('../controllers/projects.controller');
        request({
            method: 'PUT',
            uri: base_url+'/api/projects/' + prospect_id,
            form:
            {
                area: area
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
    function updateProspectInitiatedBy(initiatedBy, prospect_id)
    {
        console.log("update prospect for initiated by:"+initiatedBy+" project:"+prospect_id);

        var projects = require('../controllers/projects.controller');

        request({
            method: 'PUT',
            uri: base_url+'/api/projects/' + prospect_id,
            form:
            {
                initiatedBy: initiatedBy
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
    function updateClientURL(project, prospect_id)
    {
        console.log("updateClientURL"+project.companyURL);
        var projects = require('../controllers/projects.controller');
        request({
            method: 'PUT',
            uri: base_url+'/api/projects/' + prospect_id,
            form:
            {
                companyURL: project.companyURL
            }
        }, function (error, response, body) {
            if(response.statusCode == 201){
                console.log("prospect company url updated to "+project.companyURL);
                //  console.log('document saved as: http://mikeal.iriscouch.com/testjs/'+ rand);
            } else {
                console.log('error: '+ response.statusCode + " "+error);
                //console.log(body);
            }
        })

    };
    function addSalesParticpant(address, name, p_id )
    {
        var participants = require('../controllers/participants.controller');
        console.log("addSalesParticpant");
        //check if participant exists or not
        request(base_url+'/api/participants/prospect/'+p_id, function(err, res, body) {
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
                    "_id" : getUniqueTime(),
                    "initiatedProspect" : '1'
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
    function addParticpant(address, name, p_id )
    {
        var participants = require('../controllers/participants.controller');
            console.log("addParticpant");
        //check if participant exists or not
        request(base_url+'/api/participants/prospect/'+p_id, function(err, res, body) {
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

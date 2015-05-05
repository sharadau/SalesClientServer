/**
 * Created by sharadau on 31-03-2015.
 */
/**
 * Created by sharadau on 2/5/2015.
 */
var mongoose = require('mongoose'),
    Participants = mongoose.model('Participants');


exports.list=function(req,res,next){

    Participants.find(function(err, participants){
        if(err){
            next(err);
        }
        res.send(participants);
    })
};

exports.create=function(req,res){
    console.log("create participant");
    var participant = new Participants (req.body);
    // TODO: Add to project
    /*var newProjects = req.body.projects || [];

    for (idx = 0; idx < newProjects.length; idx ++){
        // add this employee to project.participants
        Projects.findOne({name:newProjects[idx]},function(err,project){
            if(err){
                next(err);
            }
            if(project){
                project.participants.push(employee.name);

                project.save(function(err){
                    if(err){
                        console.log(err);
                        //res.status(400).send(err.err);
                    }
                    else{
                        //res.send(employee);
                    }
                });
            }
            else{
                var error={
                    error:"Project not found"
                };
                //res.status(404).send(error);
            }
        });
    }
*/
    participant.save(function(err){
        if(err){
            //res.status(400).send(err.err);
            console.log("error:"+err);
        }
        else{
            //res.send(participant);
            console.log("Added participant");
        }
    })
};

exports.participantById=function(req,res,next,id){
    console.log("participantById");
    Participants.findOne({_id:id},function(err,participant){
        if(err){
            next(err);
        }
        if(participant){
            req.participant=participant;
            next();
        }
        else{
            var error={
                error:"Todo not found"
            };
            res.status(404).send(error);
        }
    });
};
exports.participantByProspectId=function(req,res,next,id){
    console.log("participantByProspectId"+id);
    Participants.find({prospect_id:id},function(err,participant){
        if(err){
            next(err);
        }
        if(participant){
            req.participant=participant;
            next();
        }
        else{
            var error={
                error:"Participant not found"
            };
            res.status(404).send(error);
        }
    });
};
exports.participantStartsWith=function(req,res,next,name){
    Participants.find({name:new RegExp(name, 'i')})
        .exec(function(err, participant) {
            if(err){
                next(err);
            }
            if(participant){
                req.participant=participant;
                next();
            }else{
                console.log("Participant not found");
                res.status(400).send("Participant not found");

            }
        });
}
/*
 exports.employeeStartsWith1=function(req,res,next,name){
 console.log("employeeStartsWith+" + name);

 Participants.find({name:new RegExp(name, 'i')},function(err,employee){
 // Participants.find({ name: { $regex: /^man/ }},function(err,employee){
 if(err){
 next(err);
 }
 if(employee){
 req.employee=employee;
 next();
 }
 else{
 var error={
 error:"Employee not found with name "+name
 };
 res.status(404).send(error);
 }
 });
 };
 */
exports.read=function(req,res){
    res.send(req.participant);
};

exports.delete=function(req,res){
    var participant = req.participant;
    // TODO remove from project
    var oldProjects = participant.projects || [];
    for (var idx = 0; idx < oldProjects.length; idx ++){
        // remove this participant from project.participant
        Projects.findOne({name:oldProjects[idx]},function(err,project){
            if(err){
                next(err);
            }
            if(project){
                project.participants.splice(project.participants.indexOf(participant.name),1);

                project.save(function(err){
                    if(err){
                        console.log(err);
                        //res.status(400).send(err.err);
                    }
                    else{
                        //res.send(participant);
                    }
                });
            }
            else{
                var error={
                    error:"Project not found"
                };
                //res.status(404).send(error);
            }
        });
    }

    participant.remove(function(err){
        if(err){
            console.log(err);
            res.status(400).send(err.err);
        }
        else{
            res.send(participant);
        }
    })
};

exports.update=function(req,res){
    var participant = req.participant;
    var newParticipant = req.body;

    // req.body is new data while participant is old data
    var oldProjects = participant.projects || [];
    var newProjects = req.body.projects || [];
    var idx = 0;
    for (idx = 0; idx < oldProjects.length; idx ++){
        if (-1 === newProjects.indexOf(oldProjects[idx])){
            // remove this participant from project.participants
            Projects.findOne({name:oldProjects[idx]},function(err,project){
                if(err){
                    next(err);
                }
                if(project){
                    project.participants.splice(project.participants.indexOf(newParticipant.name),1);

                    project.save(function(err){
                        if(err){
                            console.log(err);
                            //res.status(400).send(err.err);
                        }
                        else{
                            //res.send(participant);
                        }
                    });
                }
                else{
                    var error={
                        error:"Project not found"
                    };
                    //res.status(404).send(error);
                }
            });
        }
    }
    for (idx = 0; idx < newProjects.length; idx ++){
        if (-1 === oldProjects.indexOf(newProjects[idx])){
            // add this participant to project.participants
            Projects.findOne({name:newProjects[idx]},function(err,project){
                if(err){
                    next(err);
                }
                if(project){
                    project.participants.push(newParticipant.name);

                    project.save(function(err){
                        if(err){
                            console.log(err);
                            //res.status(400).send(err.err);
                        }
                        else{
                            //res.send(participant);
                        }
                    });
                }
                else{
                    var error={
                        error:"Project not found"
                    };
                    //res.status(404).send(error);
                }
            });
        }
    }


    for (var i in req.body) {
        participant[i] = JSON.parse(JSON.stringify(req.body[i]));
    }

    participant.save(function(err){
        if(err){
            console.log(err);
            res.status(400).send(err.err);
        }
        else{
            res.send(participant);
        }
    })

};

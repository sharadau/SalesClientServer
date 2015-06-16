/**
 * Created by sharadau on 15-06-2015.
 */

var mongoose = require('mongoose'),
    Cycles = mongoose.model('Cycles');


exports.list=function(req,res,next){

    Cycles.find(function(err, cycles){
        if(err){
            next(err);
        }
        res.send(cycles);
    })
};

exports.create=function(req,res){
    console.log("create cycle");
    var cycle = new Cycles (req.body);

    cycle.save(function(err){
        if(err){
            console.log("error:"+err);
        }
        else{
            //res.send(cycle);
            console.log("Added cycle");
        }
    })
};

exports.cycleById=function(req,res,next,id){
    console.log("cycletById");
    Cycles.findOne({_id:id},function(err,cycle){
        if(err){
            next(err);
        }
        if(cycle){
            req.cycle=cycle;
            next();
        }
        else{
            var error={
                error:"cycle not found"
            };
            res.status(404).send(error);
        }
    });
};
exports.cycleByProspectId=function(req,res,next,id){
    console.log("cycleByProspectId"+id);
    Cycles.find({prospect_id:id},function(err,cycle){
        if(err){
            next(err);
        }
        if(cycle){
            req.cycle=cycle;
            next();
        }
        else{
            var error={
                error:"cycle not found"
            };
            res.status(404).send(error);
        }
        //res.send(cycle);
    });
};


exports.read=function(req,res){
    console.log("in read:"+req.cycle);
    res.send(req.cycle);
};

exports.delete=function(req,res){
    var cycle = req.cycle;
    // TODO remove from project
    /*var oldProjects = participant.projects || [];
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
*/
    cycle.remove(function(err){
        if(err){
            console.log(err);
            res.status(400).send(err.err);
        }
        else{
            res.send(cycle);
        }
    })
};

exports.update=function(req,res){
    var cycles = req.cycle;
    var newCycles = req.body;

    for (var i in req.body) {
        cycles[i] = JSON.parse(JSON.stringify(req.body[i]));
    }

    cycles.save(function(err){
        if(err){
            console.log(err);
            res.status(400).send(err.err);
        }
        else{
            res.send(cycles);
        }
    })

};


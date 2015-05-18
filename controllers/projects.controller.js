/**
 * Created by sharadau on 2/5/2015.
 */
var mongoose = require('mongoose'),
    Projects = mongoose.model('Projects'),
    Employees = mongoose.model('Employees'),
    Organizations = mongoose.model('Organizations');

exports.list=function(req,res,next){
    console.log("list");
    Projects.find(function(err, projects){
        if(err){
            console.log("Error");
            next(err);
        }
         res.send(projects);
    })
};

exports.create=function(req,res){
    var projects = new Projects (req.body);
    // TODO: Add to Employee

    var newEmployees = req.body.employees || [];

    for (idx = 0; idx < newEmployees.length; idx ++){
        // add this employee to project.employees
        Employees.findOne({name:newEmployees[idx]},function(err,employee){
            if(err){
                next(err);
            }
            if(employee){
                employee.projects.push(projects.name);

                employee.save(function(err){
                    if(err){
                        console.log("emp save error:"+err);
                        //res.status(400).send(err.err);
                    }
                    else{
                        //res.send(employee);
                    }
                });
            }
            else{
                var error={
                    error:"Employee not found"
                };
                //res.status(404).send(error);
            }
        });
    }


    // TODO add this project to new organization
    console.log(projects);
    /*Organizations.findOne({name:projects.organization},function(err,org){
        org.projects.push(projects.name);
        org.save(function(err){ });
    });*/


    projects.save(function(err){
        console.log(err);
        if(err){
            res.status(400).send(err.err);
        }
        else{
            res.send(projects);
        }
    })
};

exports.projectById=function(req,res,next,id){
    Projects.findOne({_id:id},function(err,project){
        if(err){
            next(err);
        }
        if(project){
            req.project=project;
            next();
        }
        else{
            var error={
                error:"project not found with id"+id
            };
            res.status(404).send(error);
        }
    });
};

exports.read=function(req,res){
    res.send(req.project);
};

exports.delete=function(req,res){
    var project = req.project;

    // TODO remove from employee
    /*var oldEmployees = project.employees || [];
    for (var idx = 0; idx < oldEmployees.length; idx ++){
        // remove this employee from project.employees
        Employees.findOne({name:oldEmployees[idx]},function(err,employee){
            if(err){
                next(err);
            }
            if(employee){
                employee.projects.splice(employee.projects.indexOf(project.name),1);

                employee.save(function(err){
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
                    error:"Employee not found"
                };
                //res.status(404).send(error);
            }
        });
    }*/


    // TODO remove this project from older organization
   // Organizations.findOne({name:project.organization},function(err,org){
     //   org.projects.splice(org.projects.indexOf(project.name), 1);
       // org.save(function(err){ });
    //});

    project.remove(function(err){
        if(err){
            console.log(err);
            res.status(400).send(err.err);
        }
        else{
            res.send(project);
        }
    })
};

exports.update=function(req,res){
    var project = req.project;
console.log("update prospect");
    var newProject = req.body;

    // req.body is new data while employee is old data
    var oldEmployees = project.employees || [];
    var newEmployees = req.body.employees || [];
    var idx = 0;
    for (idx = 0; idx < oldEmployees.length; idx ++){
        if (-1 === newEmployees.indexOf(oldEmployees[idx])){
            // remove this employee from project.employees
            Employees.findOne({name:oldEmployees[idx]},function(err,employee){
                if(err){
                    next(err);
                }
                if(employee){
                    employee.projects.splice(employee.projects.indexOf(newProject.name),1);

                    employee.save(function(err){
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
                        error:"Employee not found"
                    };
                    //res.status(404).send(error);
                }
            });
        }
    }
    for (idx = 0; idx < newEmployees.length; idx ++){
        if (-1 === oldEmployees.indexOf(newEmployees[idx])){
            // add this employee to project.employees
            Employees.findOne({name:newEmployees[idx]},function(err,employee){
                if(err){
                    next(err);
                }
                if(employee){
                    employee.projects.push(newProject.name);

                    employee.save(function(err){
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
    }
/*
    // TODO remove this project from older organization
    Organizations.findOne({name:project.organization},function(err,org){
        org.projects.splice(org.projects.indexOf(project.name), 1);
        org.save(function(err){ });
    });
    // TODO add this project to new organization
    Organizations.findOne({name:newProject.organization},function(err,org){
        org.projects.push(project.name);
        org.save(function(err){ });
    });

*/

    for (var i in req.body) {
        project[i] = JSON.parse(JSON.stringify(req.body[i]));
    }
    project.save(function(err){
        if(err){
            console.log(err);
            res.status(400).send(err.err);
        }
        else{
            res.send(project);
            console.log("project updated:"+project);
        }
    })

};


exports.updateStage=function(req,res){

    var project = req.project;
    var newProject = req.body;

    project.state = newProject.state;
    project.state_id = newProject.state_id;
    console.log("updateStage:"+req.body.state_id);
    /*project.update({_id:project._id }, {state: newProject.stage}, function(err) {
        if(err){
            console.log(err);
            res.status(400).send(err.err);
        }
        else{
            console.log("success");
            res.send(project);
        }
    });*/
    project.save(function (err, project) {
        if(err){
            console.log("Unable to save project.");
            console.log(err);
            res.status(400).send(err.err);
        }else{
            res.send(project);
        }
    });
};
exports.getProjectForMonth=function(req,res,next,monyear){

    console.log("getProjectForMonth");
    console.log("month"+monyear);

    monthyear = monyear.split("::");

    console.log("month:"+monthyear[0]+" year:"+monthyear[1]);

    var year = monthyear[1];

    var monthMapping = new Array();

    monthMapping[0] = new Array();
    monthMapping[1] = new Array();
    monthMapping[2] = new Array();
    monthMapping[3] = new Array();
    monthMapping[4] = new Array();
    monthMapping[5] = new Array();
    monthMapping[6] = new Array();
    monthMapping[7] = new Array();
    monthMapping[8] = new Array();
    monthMapping[9] = new Array();
    monthMapping[10] = new Array();
    monthMapping[11] = new Array();
    monthMapping[12] = new Array();

    monthMapping[0][0] = 'Jan';
    monthMapping[0][1] = year + ',1,1';
    monthMapping[0][2] = year + ',1,31';
    monthMapping[1][0] = 'Feb';
    monthMapping[1][1] = year + ',2,1';
    monthMapping[1][2] = year + ',2,28';
    monthMapping[2][0] = 'Mar';
    monthMapping[2][1] = year + ',3,1';
    monthMapping[2][2] = year + ',3,31';
    monthMapping[3][0] = 'Apr';
    monthMapping[3][1] = year + ',4,1';
    monthMapping[3][2] = year + ',4,30';
    monthMapping[4][0] = 'May';
    monthMapping[4][1] = year + ',5,1';
    monthMapping[4][2] = year + ',5,31';
    monthMapping[5][0] = 'Jun';
    monthMapping[5][1] = year + ',6,1';
    monthMapping[5][2] = year + ',6,30';
    monthMapping[6][0] = 'Jul';
    monthMapping[6][1] = year + ',7,1';
    monthMapping[6][2] = year + ',7,31';
    monthMapping[7][0] = 'Aug';
    monthMapping[7][1] = year + ',8,1';
    monthMapping[7][2] = year + ',8,31';
    monthMapping[8][0] = 'Sep';
    monthMapping[8][1] = year + ',9,1';
    monthMapping[8][2] = year + ',9,30';
    monthMapping[10][0] = 'Oct';
    monthMapping[10][1] = year + ',10,1';
    monthMapping[10][2] = year + ',10,31';
    monthMapping[11][0] = 'Nov';
    monthMapping[11][1] = year + ',11,1';
    monthMapping[11][2] = year + ',11,30';
    monthMapping[12][0] = 'Dec';
    monthMapping[12][1] = year + ',12,1';
    monthMapping[12][2] = year + ',12,31';

    for(i=0;i<12;i++)
    {
        if(monthyear[0] == monthMapping[i][0])
        {
            start = monthMapping[i][1];
            end = monthMapping[i][2];
        }
    }
console.log("start:"+start+" end:"+end);
    Projects.find({"start_date": {"$gte": start, "$lt": end}}, function(err, projects){
        if(err){
            console.log("Error:"+err);
            next(err);
        }
        res.send(projects);
    });

    /*Projects.find({"start_date": {"$gte": start, "$lt": end}}, function(err, projects){
        if(err){
            next(err);
        }
        if(projects){
            req.projects=projects;
            next();
        }
        else{
            var error={
                error:"projects not found"
            };
            res.status(404).send(error);
        }
    });
*/
};

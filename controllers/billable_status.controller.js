/**
 * Created by sharadau on 2/5/2015.
 */
var mongoose = require('mongoose'),
    BillableStatus = mongoose.model('billable_status');

exports.list=function(req,res,next){

    BillableStatus.find(function(err, billable_status){
        if(err){
            next(err);
        }
         res.send(billable_status);
    })
};
exports.read=function(req,res){
    res.send(req.weeklyStats);
};
exports.create=function(req,res){
    var billablests = new BillableStatus (req.body);
    // TODO: Add to project

    billablests.save(function(err){
        if(err){
            res.status(400).send(err.err);
        }
        else{
            res.send(billablests);
        }
    })
};

exports.getWeeklyStatsForOrg=function(req,res,next,orgId){
//exports.getWeeklyStatsForOrg=function(req,res,next,fromDate,toDate,orgId,prjId){
  //  BillableStatus.findOne({org_id:orgId,prj_id:prgId,from_date:fromDate},function(err,stats){
    BillableStatus.findOne({org_id:orgId},function(err,stats){

        if(err){
            next(err);
        }
        console.log('org:'+stats);
        if(stats){
            req.weeklyStats=stats;
            next();
        }
        else{
            var error={
                error:"stats not found for org "+orgId
            };
            res.status(404).send(error);
        }
    });
};



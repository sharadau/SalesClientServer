/**
 * Created by sharadau on 2/5/2015.
 */
var billable_status = require('../controllers/billable_status.controller');

module.exports=function(app){

    app.route('/api/billable_status')
        .get(billable_status.list)
        .post(billable_status.create);

   /* app.route('/api/billable_status/:fromDate/:toDate/:orgId/:prjId')
        .get(billable_status.getWeeklyStatsForOrg);

    app.param(['fromDate','toDate','orgId','prjId'],billable_status.getWeeklyStatsForOrg);
    */
    app.route('/api/billable_status/:orgId')
        .get(billable_status.read);
        //.put(billable_status.update)
        //.delete(billable_status.delete);

    app.param('orgId',billable_status.getWeeklyStatsForOrg);
};
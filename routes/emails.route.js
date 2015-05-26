/**
 * Created by sharadau on 01-04-2015.
 */
/**
 * Created by sharadau on 2/5/2015.
 */
var emails = require('../controllers/emails.controller');

module.exports=function(app){

    app.route('/api/emails')
        .post(emails.create);
    app.route('/api/emails/update/:eId')
        .get(emails.read)
        .put(emails.update)
    app.route('/api/emails/ulist')
        .get(emails.uncategorizedList);
    app.route('/api/emails/view/:pId')
        //.get(emails.list)
        .get(emails.read);
    app.route('/api/emails/:prospectIdStage')
        .get(emails.read);
    /*app.route('/api/emails/uncategorizedEmailsForProspect/:prospect_id')
     .get(emails.read);*/

    app.param('prospectIdStage',emails.getEmailsForProspectStage);
    app.param('pId',emails.getEmailsForProspect);
    app.param('eId',emails.emailById);
    // app.param('prospect_id',emails.uncategorizedListForProspect);


};
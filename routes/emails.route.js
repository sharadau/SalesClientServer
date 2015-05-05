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
    app.route('/api/emails/view/:pId')
        .get(emails.list);
    app.route('/api/emails/:prospectIdStage')
        .get(emails.list)
        .get(emails.read);

    app.param('prospectIdStage',emails.getEmailsForProspectStage);
    app.param('pId',emails.getEmailsForProspect);

};
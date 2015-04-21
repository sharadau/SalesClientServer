/**
 * Created by sharadau on 01-04-2015.
 */
/**
 * Created by sharadau on 2/5/2015.
 */
var emails = require('../controllers/emails.controller');

module.exports=function(app){

    app.route('/api/emails')
        .get(emails.list)
        .post(emails.create);
    app.route('/api/emails/:prospectIdStage')
        .get(emails.read);
    /*app.route('/api/sendemail')
        .post(emails.create);*/
    app.param('prospectIdStage',emails.getEmailsForProspectStage);

};
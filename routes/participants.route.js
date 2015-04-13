/**
 * Created by sharadau on 31-03-2015.
 */
/**
 * Created by sharadau on 2/5/2015.
 */
var participants = require('../controllers/participants.controller');

module.exports=function(app){

    app.route('/api/participants')
        .get(participants.list)
        .post(participants.create);

    app.route('/api/participants/:participantId')
        .get(participants.read)
        .put(participants.update)
        .delete(participants.delete);
    app.route('/api/participants/prospect/:prospectId')
        .get(participants.read)
        .get(participants.list);
    app.route('/api/participants/name/:name')
        .get(participants.read);

    app.param('participantId',participants.participantById);
    app.param('prospectId',participants.participantByProspectId);
    app.param('name',participants.participantStartsWith);

};
/**
 * Created by sharadau on 31-03-2015.
 */
/**
 * Created by sharadau on 2/5/2015.
 */
var privilages = require('../controllers/privilages.controller');

module.exports=function(app){

    app.route('/api/privilages')
        .get(privilages.list)
        .post(privilages.create);

    app.route('/api/privilages/:privilageId')
        .get(privilages.read);
    app.route('/api/privilages/usertype/:usertype')
        .get(privilages.read);
        //.get(privilages.list);

    app.param('privilageId',privilages.privilageById);
    app.param('usertype',privilages.privilageForUserType);

};
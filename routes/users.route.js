/**
 * Created by sharadau on 2/5/2015.
 */
var users = require('../controllers/users.controller');

module.exports=function(app){

    app.route('/api/users')
        .get(users.list)
        .post(users.create);

    app.route('/api/users/:uId')
        .get(users.read)
        .delete(users.delete);
    app.route('/api/users/user_type/:user_type')
        .get(users.read);
        //.get(employees.employeeStartsWith);

    app.param('uId',users.userById);
    app.param('user_type',users.getUserByType);

};
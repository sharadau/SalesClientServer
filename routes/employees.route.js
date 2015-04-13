/**
 * Created by sharadau on 2/5/2015.
 */
var employees = require('../controllers/employees.controller');

module.exports=function(app){

    app.route('/api/employees')
        .get(employees.list)
        .post(employees.create);

    app.route('/api/employees/:empId')
        .get(employees.read)
        .put(employees.update)
        .delete(employees.delete);
    app.route('/api/employees/name/:name')
        .get(employees.read);
        //.get(employees.employeeStartsWith);

    app.param('empId',employees.employeeById);
    app.param('name',employees.employeeStartsWith);

};
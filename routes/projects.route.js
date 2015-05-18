/**
 * Created by sharadau on 2/5/2015.
 */
var projects = require('../controllers/projects.controller');

module.exports=function(app){

    app.route('/api/projects')
        .get(projects.list)
        .post(projects.create);

    app.route('/api/projects/:prjId')
        .get(projects.read)
        .put(projects.update)
        .delete(projects.delete);

    app.route('/api/projects/updateStage/:prjId')
        .get(projects.read)
        .put(projects.updateStage);
    app.route('/api/projects/getProjectForMonth/:month')
        .get(projects.list)
        .get(projects.getProjectForMonth);

    app.param('prjId',projects.projectById);
    app.param('month',projects.getProjectForMonth);

};
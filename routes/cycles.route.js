/**
 * Created by sharadau on 15-06-2015.
 */

var cycles = require('../controllers/cycles.controller');

module.exports=function(app){

    app.route('/api/cycles')
        .get(cycles.list)
        .post(cycles.create);

    app.route('/api/cycles/:cycleId')
        .get(cycles.read)
        .put(cycles.update)
        .delete(cycles.delete);
    app.route('/api/cycles/prospect/:prospectId')
        .get(cycles.read)
        .get(cycles.list);

    app.param('cycleId',cycles.cycleById);
    app.param('prospectId',cycles.cycleByProspectId);

};

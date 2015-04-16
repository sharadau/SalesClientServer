/**
 * Created by sharadau on 14-04-2015.
 */
/**
 * Created by sharadau on 2/5/2015.
 */
var fileupload = require('../controllers/fileupload.controller');

module.exports=function(app){

    app.route('/api/fileupload')
        .get(fileupload.list)
        .post(fileupload.create);
};

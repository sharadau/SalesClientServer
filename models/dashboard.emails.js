/**
 * Created by sharadau on 01-04-2015.
 */
/**
 * Created by sharadau on 2/5/2015.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EmailsSchema = new Schema({
    subject:{
        type:String,
        required:true
    },
    send_date:{
        type:String,
        required:false
    },
    contents:{
        type:String,
        required:false
    },
    from:{
        type:String,
        required:true
    },
    to:{
        type:String,
        required:true
    },
    prospect_id:{
        type:Number,
        required:true
    },
    stage:{
        type:String,
        required:true
    }
});
mongoose.model('Emails',EmailsSchema);

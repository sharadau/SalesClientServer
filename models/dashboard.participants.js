/**
 * Created by sharadau on 31-03-2015.
 */
/**
 * Created by sharadau on 2/5/2015.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ParticipantsSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:false
    },
    _id:{
        type:Number,
        required:false
    },
    prospect_id:{
        type:Number,
        required:false
    },
    prospect:{
        type:String,
        required:false
    }
});
mongoose.model('Participants',ParticipantsSchema);
/**
 * Created by sharadau on 15-06-2015.
 */
/**
 * Created by sharadau on 2/5/2015.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CyclesSchema = new Schema({
    name:{
        type:String,
        required:false
    },
    prospect:{
        type:String,
        required:false
    },
    prospect_id:{
        type:Number,
        required:true
    },
    _id:{
        type:Number,
        required:true
    },
    start_date:{
        type:String,
        required:false
    },
    end_date:{
        type:String,
        required:false
    },
    status:{
        type:String,
        required:false
    },
    cycle_no:{
        type:Number,
        required:false
    },
    current_state:{
        type:Number,
        required:false
    }
});
mongoose.model('Cycles',CyclesSchema);

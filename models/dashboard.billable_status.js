/**
 * Created by sharadau on 2/5/2015.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BillableStatusSchema = new Schema({
    emp_id:{
        type:Number,
        required:true
    },
    from_date:{
        type:Date,
        required:false
    },
    to_date:{
        type:Date,
        required:false
    },
    status:{
        type:Number,
        required:true
    },
    org_id:{
        type:Number,
        required:true
    },
    prj_id:{
        type:Number,
        required:true
    }
});
mongoose.model('billable_status',BillableStatusSchema);
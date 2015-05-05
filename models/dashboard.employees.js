/**
 * Created by sharadau on 2/5/2015.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EmployeesSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    organization:{
        type:String,
        required:false
    },
    projects:{
        type:[String],
        required:false
    },
    skills:{
        type:[String],
        required:false
    },
    _id:{
        type:Number,
        required:true
    },
    billable: {
        type: Boolean,
        required:false,
        default: false
    },
    prospect_id:{
        type:Number,
        required:false
    },
    emailId:{
        type:String,
        required:false
    },
    type:{
        type:Number, //1-Sales, 2-engineering, 3-CEO, 4-CTO
        required:false
    },
    area:{
        type:String,
        required:false
    }
});
mongoose.model('Employees',EmployeesSchema);
/**
 * Created by sharadau on 31-03-2015.
 */
/**
 * Created by sharadau on 2/5/2015.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PrivilagesSchema = new Schema({
    functionality:{
        type:String,
        required:true
    },
    admin:{
        type:String,
        required:false
    },
    sales_person:{
        type:String,
        required:false
    },
    participant:{
        type:String,
        required:false
    },
    others:{
        type:String,
        required:false
    },
    CEO_CTO:{
        type:String,
        required:false
    }
});
mongoose.model('Privilages',PrivilagesSchema);
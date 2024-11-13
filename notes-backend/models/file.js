const mongoose=require('mongoose');

const fileSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    fileContent:{
        type:String,
        default: ''
    },
    parentFolder:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"folder",
        required:false
    },
    itemType:{
        type:String,
        default:"file"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    }
});
module.exports=mongoose.model('file',fileSchema);
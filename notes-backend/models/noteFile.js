const mongoose=require('mongoose');

const noteFileSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    notes:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        require:'true'
    }
    
})
module.exports=mongoose.model('noteFile',noteFileSchema);
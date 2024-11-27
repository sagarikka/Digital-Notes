const mongoose=require('mongoose');

const folderSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    contents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'file', // Reference to the file model
        }
        // {
        //     item: {
        //         type: mongoose.Schema.Types.ObjectId,
        //         refPath: 'contents.itemType' // Dynamic reference based on item type
        //     },
        //     itemType: {
        //         type: String,
        //         required: true,
        //         enum: ['file', 'folder'] // Possible models
        //     }
        // }

    ],
    // parentFolder:{
    //     type:String
    // },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    }
});

module.exports=mongoose.model('folder',folderSchema);
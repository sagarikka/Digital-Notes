const mongoose=require('mongoose');

const usersSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    userName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
});
const UsersModel=mongoose.model('users',usersSchema);
module.exports=UsersModel;
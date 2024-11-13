const router=require('express').Router();
const bcrypt=require('bcrypt');
const {getToken}=require("../utils/helpers");
const users=require("../models/users")

router.post("/signup",async (req,res)=>{
    const {email,userName,password}=req.body;
    try{
        //check if any fiels is empty
        if(!userName.trim() || !email.trim() || !password.trim()){
            return res.status(300).json({message:"please enter all the require data"});
        }
        //check if username length is greater than 12
        if(userName.length>12 ){
            return res.status(300).json({message:"usename should be of 12 character"})
        }
        //check if user already exist
        const founduser=await users.findOne({userName},{timeout:30000});
        if(founduser){
            console.log(founduser);
            return res.status(400).json({message:"user already exist"});
        }
    
        // Check if password is strong (at least 8 characters, contains a number and a letter)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if(!passwordRegex.test(password)){
            return res.status(400).json({message:"Password must be at least 8 characters long and contain at least one letter and one number"});
        };
    
        //hash the password
        const hashedPassword=await bcrypt.hash(password,10);
        const newUserData={userName,email,password:hashedPassword};
    
        //create a new user
        const newUser =await users.create(newUserData);
        console.log(newUser);
        //generate a token
        const token=await getToken(newUser);
    
        //add token to the existing user
        const userToReturn=newUser.toJSON();  //[...newuser.toJSON(),token] we cant do this cause toJSON return a object and we cant spread it inside an array
        userToReturn.token=token;
    
        //delete the password and return it to the user
        delete userToReturn.password;
        return res.status(200).json(userToReturn);
    }
    catch(error){
        console.log("error in signup route",error);
        return res.status(500).json({message:"error in signup",error});
    }
    
})


//login route
router.post("/login",async(req,res)=>{
    const {userProfile,password}=req.body;
try{
    //find the user
    const founduser=await users.findOne({
       $or: [
                { userName: userProfile }, // Check for username
                { email: userProfile } // Check for email
            ]
    }).maxTimeMS(30000);

    //if the user doesn't exist send a message
    if(!founduser){
        return res.status(450).json({message:"invalid userName"})
    }

    //compare the password by bcrypt.compare method and check whether its valid
    const isPasswordValid=await bcrypt.compare(password,founduser.password);
    if(!isPasswordValid){
        return res.status(450).json({message:"invalid pssword"});
    }

    //generate a token and add that to found user and delete the password
    const token=await getToken(founduser);
    const userToReturn=founduser.toJSON();
    userToReturn.token=token;
    delete userToReturn.password;

    //return the user
    return res.status(200).json(userToReturn);
}
catch(error){
    console.log("error in signin:",error);
    res.status(500).json({ message: "error in login",error });
}
   
})
module.exports=router;
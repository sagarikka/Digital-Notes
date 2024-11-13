const express=require("express");
const mongoose=require("mongoose");
const router=require('express').Router();
require("dotenv").config();
const cors=require("cors");
const passport = require("passport");
const JwtStrategy =require('passport-jwt').Strategy;
const ExtractJwt =require('passport-jwt').ExtractJwt;
const users=require("./models/users");
const authAPI =require("./routes/authAPI");
const folderAPI=require("./routes/folderAPI");
const noteFileAPI=require("./routes/noteFileAPI");

const app=express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

mongoose.connect(process.env.MONGO_ROUTE)
.then((x)=>{
    console.log("connected to mongoose database");
})
.catch((err)=>{
    console.log("error while connecting to database",err);
});

//setting passport js for authentication
var opts ={
    jwtFromRequest : ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey : process.env.PASSPORT_SECRET_KEY,
    expiresIn:"30d"
}

passport.use(new JwtStrategy({...opts},function(jwt_payload,done){
    users.findOne({_id : jwt_payload.identifier})
    .then((user)=>{
        if(user){
            console.log('user found',user);
            return done(null,user);
        }
        else{
            console.log('user not found');
            return done(null,false);
        }

    })
    .catch((err)=>{
        console.log('Error in finding user',err);
        return done(err,false);
    });
}));

app.use("/auth",authAPI);
app.use("/create",folderAPI);
app.use("/note",noteFileAPI);
app.use("/files",express.static("files"));


app.listen(3300,()=>{
    console.log("app is listening on port 3300");
})
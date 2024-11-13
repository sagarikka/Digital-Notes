const router=require('express').Router();
const multer  = require('multer')
const passport=require('passport');
const noteFile = require('../models/noteFile');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./files");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + file.originalname);
    },
  });

const upload = multer({ storage: storage });

router.post("/upload-note",passport.authenticate('jwt',{session:false}), upload.single("file"),async(req,res)=>{
    console.log(req.file);
    const title = req.body.fileName;
    const file = req.file.filename;
    const currentUser=req.user._id; 
    try{
      const createdNote=await noteFile.create({name:title,notes:file,user:currentUser});
      return res.status(200).json(createdNote);
    }
    catch(error){
      console.log("Error during creating file",error);
      return res.status(500).json({message:"Error during creating note"})
    }

});

router.get("/get-note",async(req,res)=>{
  try{
    const notes=await noteFile.find().populate('user');
    return  res.status(200).json(notes);
  }
  catch(error){
    console.log("Error during fetching post from database");
    return res.status(400).json({message:"error during fetching notes from database"});
  }
})

module.exports=router;
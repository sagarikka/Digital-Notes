const router= require('express').Router();
const passport=require('passport');
const folder=require('../models/folder');
const file=require('../models/file');

//CREATE A NEW FOLDER
router.post('/folder',passport.authenticate('jwt',{session:false}),async(req,res)=>{

    const { name } = req.body;
    const userId = req.user._id;
    try{
        const newFolder = new folder({ name, userId });
        await newFolder.save();
        return res.status(200).json(newFolder);
    }
    catch(error){
        console.log("error creating folder",error);
        return res.status(500).json({message:"error in creating file",error})
    }
})

// CREATE A NEW FILE
router.post('/file', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { name, parentFolderId } = req.body;
    const userId = req.user.id; 
    if (!parentFolderId) {
        return res.status(400).json({ message: 'Please select a parent folder' });
    }
    try {
        const newFile = new file({ name, userId, parentFolder: parentFolderId  }); 
            const parentFolder = await folder.findById(parentFolderId);
            parentFolder.contents.push(newFile._id);
            await parentFolder.save();

        await newFile.save();
        return res.status(200).json(newFile);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating file', error });
    }
});

//RETURN ALL FOLDERS
router.get("/allfolder",passport.authenticate('jwt',{session:false}),async (req,res) => {
    const currentUser=req.user._id;
    try{
        const folders = await folder.find({ userId: currentUser}).populate('contents');
        console.log(folders);
        if(!folders || folders.length === 0){
            return res.status(400).json({message:"No document found"});
        }
        return res.status(200).json(folders);
    }
    catch(error){
        console.log("error during finding all post ",error);
        return res.status(500).json({message:"error during finding all folders: "});
    }
})

router.get("/getcontent/:id",passport.authenticate("jwt",{session:false}), async(req,res) =>{
    const {id}=req.params;
    try{
        const fileContent=await file.findOne({_id:id});
        console.log(fileContent);
        return res.status(200).json(fileContent);
    }
    catch(error){
        console.log("error during finding files content",error);
        return res.status(500).json({message:"Error finding "})
    }
})

router.put("/updatecontent/:id",passport.authenticate('jwt',{session:false}),async(req,res) => {
    const {id} = req.params;
    const {updatedValue} = req.body;
    try{
        const updatedDocument = await file.findByIdAndUpdate(
            id,
            {fileContent:updatedValue},
            {new:true} //Returns the updated document
        );  

        if(!updatedDocument){
            return res.status(400).json({message:"Document not found"});
        }

        res.status(200).json(updatedDocument);
    }
    catch(error){
        console.log("Error updating document: ",error);
        res.status(500).json({message:'Error updating document',error});
    }
})


module.exports=router;
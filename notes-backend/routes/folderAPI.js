const router= require('express').Router();
const passport=require('passport');
const folder=require('../models/folder');
const file=require('../models/file');

router.post('/folder',passport.authenticate('jwt',{session:false}),async(req,res)=>{
    const { name , parentFolderId}=req.body;
    const userId = req.user._id;
    try{
        const newFolder = new folder({name,userId, itemType: 'folder' ,parentFolder:parentFolderId});
        if(parentFolderId){
            const parentFolder =await folder.findById(parentFolderId);
            parentFolder.contents.push({ item: newFolder._id, itemType: 'folder' });
            await parentFolder.save();
        }
        await newFolder.save();
        return res.status(200).json(newFolder);
    }
    catch(error){
        console.log("error creating folder",error);
        return res.status(500).json({message:"error in creating file",error})
    }
})

// Create a new file
router.post('/file', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { name, parentFolderId } = req.body;
    const userId = req.user.id; // Extract the user ID from the authenticated user

    try {
        const newFile = new file({ name, userId, parentFolder: parentFolderId  }); // Set the user ID

        if (parentFolderId) {
            const parentFolder = await folder.findById(parentFolderId);
            parentFolder.contents.push( { item: newFile._id, itemType: 'file' } ); // Assuming contents is used for both files and folders
            await parentFolder.save();
        }

        await newFile.save();
        return res.status(200).json(newFile);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating file', error });
    }
});

router.get("/allfolder",passport.authenticate('jwt',{session:false}),async (req,res) => {
    const currentUser=req.user._id;
    try{
        const folders=await folder.find({userId:currentUser,parentFolder:null}).populate('contents.item');
        console.log(folders);
        if(!folders){
            return res.status(400).json({message:"No document found"});
        }
        const filteredFolders = folders.map(folder => ({
            ...folder.toObject(),
            contents: folder.contents.filter(content => content.item !== null) // Keep only contents with non-null item
        }));
        const files=await file.find({parentFolder:null,userId:currentUser});
        if(folders.length === 0 && files.length === 0){
            return res.status(400).json({message:"No document found"});
        }
        const response={
            folders:filteredFolders,
            files
        }
        return res.status(200).json(response);
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
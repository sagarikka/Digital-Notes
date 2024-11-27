import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Link,useNavigate } from 'react-router-dom'
import Folder from '../components/Folder';
import { makeAuthenticatedGetRequest, makeAuthenticatedPostRequest } from './helper';
function NavbarContainer({children}) {
  const [folderData,setFolderData]=useState([]);
  const [newfile,setNewfile]=useState("");
  const [empty_text,setEmpty_text]=useState(false)
  const [isOpen,setIsOpen]=useState(false);
  const [selectedFolder,setSelectedFolder]=useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFolderStructure,setNewFolderStructure]=useState([]);
  const [error,setError]=useState(null);
  const [selectError,setSelectError]=useState(null);
  const navigate = useNavigate();


  useEffect(()=>{
    const getData = async()=>{
      try{
        const response = await makeAuthenticatedGetRequest("/create/allfolder");
        console.log("response",response);
        if(response.message){
          setError(response.message);
          return response;
        }
        setFolderData(response);
        return response;
      }
      catch(err){
        console.log("error during fetching folders:",err);
        return err;
      }
    }
    getData();
  },[newFolderStructure])
  
  const handleFileClick = (file) => {
    setSelectedFile(file);
    navigate('/home');
  };

 
  //ADD A NEW FOLDER
  const handleCreateNewFolder =async() =>{
    if(newfile===""){
      setEmpty_text(true);
      return;
    }
      const newFolder =await makeAuthenticatedPostRequest("/create/folder",{name:newfile})
      console.log("newFolder",newFolder)
      setNewFolderStructure(newFolder);
    // }
    setEmpty_text(false);
    setNewfile('');
  }

  //ADD A NEW FILE
  const handleCreateNew=async() =>{
    if(newfile===""){
      setEmpty_text(true);
      return;
    }
    console.log(selectedFolder);
      const addedFile=await makeAuthenticatedPostRequest("/create/file",{name:newfile,parentFolderId:selectedFolder});
      if(addedFile.message){
        setSelectError(addedFile.message);
         return;
      }
      console.log("added file",addedFile);
      setSelectError(null)
      setNewFolderStructure(addedFile);
      setSelectedFolder(null);
    setEmpty_text(false)
    setNewfile('');
  }

  const navToggle=()=>{
    setIsOpen(!isOpen);
  }
  return (
    <div className='nav-container'>
        <div className='nav-header'>
            <div ><Link to="/home"><Icon icon="streamline-emojis:sunflower-2" className='header_logo' width={`45px`}/></Link></div>
            <div className='brand_name'>LearnLog</div>
        </div>
        <div className='nav-body'>
            {!isOpen && <div className='nav-toggle-open' onClick={(e=>{e.preventDefault(); navToggle();})}><Icon icon="heroicons-solid:menu-alt-2" /></div>}
            <div className={`body-left ${isOpen && 'body-left-open'}`} >
              <div className='bar-head' >
                <input type='text' placeholder='New file/folder name' className='file-input' value={newfile} onChange={e => setNewfile(e.target.value)}/>
                <Icon icon="fluent:add-square-24-regular" className='icon' width={20} onClick={e => handleCreateNew()}/>
                <Icon icon="fluent:folder-add-24-regular" className='icon' width={20} onClick={e => handleCreateNewFolder()}/>
                {isOpen&&<div className={`nav-toggle-close`} onClick={(e)=>{e.preventDefault(); navToggle();}} ><Icon icon="mingcute:close-fill" /></div>}
              </div>
              {!folderData?<div>no document found</div>:
                <div style={{margin:'2rem 0'}} className='folder-structure'>
                {error && <div style={{ color: 'red', fontWeight: '500' }}>{error}</div>}
                {selectError && <div style={{ color: 'red', fontWeight: '500' }}>{selectError}</div>}
                {empty_text && <div style={{ color: 'red', fontWeight: '500' }}>enter File/Folder name</div>}
    
                {folderData?.map((item) => (
                  <Folder key={item._id}
                    folder={item}
                    setSelectedFolder={setSelectedFolder}
                    selectedFolder={selectedFolder}
                    onFileClick={handleFileClick}
                    selectedFile={selectedFile}
                  />
                ))}
                <div className='ai-button'><Icon icon="streamline-emojis:sunflower-2" className='header_logo' width={`20px`}/><div>AI</div></div>
                </div>
              }
              
            </div>
            <div className='body-right '>
                {children}
            </div>   
        </div>
    </div>
  )
}

export default NavbarContainer

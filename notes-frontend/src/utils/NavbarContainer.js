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
    //ADD A FOLDER WITH A PARENT FOLDER
    if(selectedFolder){
      const newFolder =await makeAuthenticatedPostRequest("/create/folder",{name:newfile,parentFolderId:selectedFolder})
      console.log("newFolder",newFolder)
      setNewFolderStructure(newFolder);
      setSelectedFolder(null);
    } else { //FOLDER WITHOUT A PARENTFOLDER
      const newFolder =await makeAuthenticatedPostRequest("/create/folder",{name:newfile})
      console.log("newFolder",newFolder)
      setNewFolderStructure(newFolder);
    }
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
    //ADD A FILE WITH A PARENTFOLDER
    if(selectedFolder){
      const addedFile=await makeAuthenticatedPostRequest("/create/file",{name:newfile,parentFolderId:selectedFolder});
      console.log("added file",addedFile);
      setNewFolderStructure(addedFile);
      setSelectedFolder(null);
    } else { //ADD A FILE WITHOUT A PARENT FOLDER 
      const addedFile=await makeAuthenticatedPostRequest("/create/file",{name:newfile});
      console.log("added file",addedFile);
      setNewFolderStructure(addedFile);
    }
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
                
                {empty_text && <div style={{ color: 'red', fontWeight: '500' }}>enter File/Folder name</div>}

                {folderData?.folders?.map((item) => (
                  <Folder key={item._id}
                    folder={item}
                    setSelectedFolder={setSelectedFolder}
                    selectedFolder={selectedFolder}
                    onFileClick={handleFileClick}
                    selectedFile={selectedFile}
                  />
                ))}

                {folderData?.files?.map((item) => (
                  <div className='alone-file' key={item._id}>
                    <div>
                      <Link to={`/file/${item._id}`} 
                            style={{ textDecoration: 'none', color: selectedFile === item ? '#4B0082' : 'black' }}
                            onClick={() => handleFileClick(item)}>
                        📝{item.name}
                      </Link>
                    </div>
                  </div>
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

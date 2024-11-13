import NavbarContainer from '../utils/NavbarContainer'
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { makeAuthenticatedPostRequest, makeUnAuthenticatedGetRequest } from '../utils/helper';
import { Link } from 'react-router-dom';


function Home() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [fileName,setFileName]=useState('');
  const [file,setFile]=useState(null);
  const [newFile,setNewFile]=useState(null);
  const [error,setError]=useState("");

  useEffect(()=>{
    const getData=async()=>{
      try{
        const response=await makeUnAuthenticatedGetRequest("/note/get-note");
        setPdfFiles(response);
        console.log("notes",response);
      }
      catch(err){
        console.log("error during fetching notes",err);
        return err;
      }
    }
    getData(); 
  },[newFile])

   const handleButtonClick = () => {
    fileInputRef.current.click();
   };
  
  const handleUploadPDF = async(e) => {
    if (!file) {
      setError('Please select a PDF file to upload.');
      return;
    }
    if (!fileName.trim()) {
      setError('Please enter a file name.');
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    console.log(formData);
    try{
      const response=await makeAuthenticatedPostRequest('/note/upload-note',formData,true);
      console.log(response);
      if(response.message){
        setError(response.message);
        setFileName("");
        setFile(null);
        return;
      }
      setNewFile(response);
      setError("");
      setFileName("");
      setFile(null);
      return;
    }
    catch(err){
      console.log("error during craetinf note file",err);
      return err;
    }
  };

  

  return (
    <NavbarContainer>
    <div className="home-container">
        {/* Hidden file input for PDF upload */}
        <div>
        <input placeholder='Enter file name...' className='file-name' autoFocus value={fileName} onChange={(e)=>{setFileName(e.target.value)}}/>
        <input
           type="file"
           accept="application/pdf"
           style={{ display: 'none' }}
           onChange={(e)=>{setFile(e.target.files[0])}}
           ref={fileInputRef}
         />
         
         {/* Button to trigger file upload */}
         <button className="upload-btn" onClick={handleButtonClick}> 
           <Icon icon="material-symbols:upload-file-rounded" width={24} />
           {file?file.name:"Post Your Notes PDF"}
         </button>
         <input type='submit'className='btn ' style={{padding:'4px 6px'}} onClick={(e)=>{e.preventDefault(); handleUploadPDF();}}/>
         {error&&<div style={{color:'red', fontWeight:'500',fontSize:'small'}}>{error}</div>}
      </div>
      <div className="pdf-grid">
        {pdfFiles.map((file) => (
          <div key={file._id} className="pdf-item">
            <iframe
              src={`http://localhost:3300/files/${file.notes}`}
              title={`PDF-${file.name}`}
              className="pdf-preview"
            ></iframe>
            <div className="pdf-details">
              <div className="pdf-info">
                <Link to={`http://localhost:3300/files/${file.notes}`} >
                <span className="pdf-name" >{file.name}</span>
                </Link>
                {/* <a href={`http://localhost:3300/files/${file.notes}`} download={file.name} className="download-icon">
                  <Icon icon="material-symbols:download" width={24} />
                </a> */}
              </div>
              <div className="uploader-info">
                <div className="uploader-avatar">{file.user.userName[0]}</div>
                <span className="uploader-name">{file.user.userName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

     
    </div>
    </NavbarContainer>
  );
}

export default Home;

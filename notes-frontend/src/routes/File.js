import React, { useRef, useState, useMemo, useEffect  } from 'react'
import NavbarContainer from '../utils/NavbarContainer'
import JoditEditor from 'jodit-react';
import { useParams } from 'react-router-dom';
import { makeAuthenticatedGetRequest, makeAuthenticatedPutRequest } from '../utils/helper';

function File() {
  const [content,setConent]=useState('');
  const editor=useRef(null);
  const {id}=useParams();
  console.log("Id",id);

  useEffect(()=>{
    const getData=async()=>{
      try{
        const response=await makeAuthenticatedGetRequest(`/create/getcontent/${id}`);
        console.log("fetch content response",response);
        setConent(response.fileContent);
      }
      catch(err){
        console.log("error fetching the files content",err);
        return err;
      }
    }
    getData();
  },[ id])
 
  const updateContent = async(newContent)=>{
    setConent(newContent);
    const response=await makeAuthenticatedPutRequest(`/create/updatecontent/${id}`,{updatedValue:newContent})
    console.log("update response",response);
    if(response.message){
      console.log(response.message);
    }
  }

  const config = useMemo(() => ({
    readonly: false,
    height: '100vh',
    placeholder:  '' 
  }), []); 
  

 

  return (
    <NavbarContainer>
        <div className='file-page'>
          <JoditEditor 
          ref={editor}
          value={content}
          onChange={newContent=>updateContent(newContent)}
          config={config}
          />
        </div>
    </NavbarContainer>
  )
}

export default File

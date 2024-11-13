import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import AuthInput from '../components/AuthInput'
import AuthPassword from '../components/AuthPassword'
import { Icon } from '@iconify/react/dist/iconify.js'
import { makeUnAuthenticatedPostRequest } from '../utils/helper'
import { useCookies } from 'react-cookie'

function Signup() {
  const [userName,setUserName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [cookie,setCookie]=useCookies(["noteToken"]);
  const navigate=useNavigate();

   console.log(userName,email,password);
   
  const Submit = async ()=>{
    try{
      const response=await makeUnAuthenticatedPostRequest("/auth/signup",{userName,email,password})
      console.log(response);
      if(response.message){
        setError(response.message);
        return response.message;
      }
      console.log(response)
      const token=response.token;
      const date=new Date();
      date.setDate(date.getDate()+30);
      setCookie("noteToken",token,{path:"/",expires:date})
      navigate('/home');
      return response;
    }
    catch(err){
      console.log("error in Signup route: ",err);
     
      return err;
    }
  }
  return (
    <div className='signup'>
    <div ><Link to="/"><Icon icon="streamline-emojis:sunflower-2" className='header_logo' width={`45px`}/></Link></div>
      <div className='signup-container'>
        <div className='signup-left-side'>
          <div><Link to='/login' className='signup-login'>Login</Link></div>
          <div><Link to='/signup' className='signup-signup'>Signup</Link></div>
        </div>
        <div className='signup-right-side'>
          <AuthInput setplaceholder="Email" value={email} setValue={setEmail}/>
          <AuthInput setplaceholder="UserName" value={userName} setValue={setUserName}/>
          <AuthPassword value={password} setValue={setPassword}/>
          <div className='btn btn-lg' onClick={(e)=>{e.preventDefault(); Submit()}}>Signup</div>
          <div><span className='line'></span>OR<span className='line'></span></div>
          <div className='signup-text'>Already have an account? <Link to='/login'>Login</Link></div>
          {error&&<div style={{color:'red', fontWeight:'bold', fontSize:'small'}} >{error}</div>}
        </div>
      </div>
    </div>
  )
}

export default Signup

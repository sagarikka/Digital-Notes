import React, { useState } from 'react'
import AuthInput from '../components/AuthInput'
import AuthPassword from '../components/AuthPassword'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useCookies } from 'react-cookie'
import { makeUnAuthenticatedPostRequest } from '../utils/helper'

function Login() {
  const [userProfile,setUserProfile]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [cookie,setCookie]=useCookies(["noteToken"]);
  const navigate=useNavigate();

  const Submit=async()=>{
    const response = await makeUnAuthenticatedPostRequest("/auth/login",{userProfile,password});
    if(response.message){
      setError(response.message);
      return response.message;
    }
    console.log(response);
    const token=response.token;
    const date=new Date();
    date.setDate(date.getDate()+30);
    setCookie("noteToken",token,{expires:date});
    navigate('/home');
    return response;
  }

  return (
    <div className='signup'>
    <div ><Icon icon="streamline-emojis:sunflower-2" className='header_logo' width={`45px`}/></div>
    <div className='signup-container'>
      <div className='signup-left-side'>
        <div><Link to='/signup' className='signup-login'>Signup</Link></div>
        <div><Link to='/login' className='signup-signup'>Login</Link></div>
      </div>
      <div className='signup-right-side'>
        <AuthInput setplaceholder="Email/UserName" value={userProfile} setValue={setUserProfile}/>
        <AuthPassword value={password} setValue={setPassword}/>
        <div className='btn btn-lg' onClick={(e)=>{e.preventDefault(); Submit();}}>Login</div>
        <div><span className='line'></span>OR<span className='line'></span></div>
        <div className='signup-text'>Don't have an account? <Link to='/signup'>Signup</Link></div>
        {error&&<div style={{color:'red', fontWeight:'bold', fontSize:'small'}} >{error}</div>}
      </div>
    </div>
  </div>
  )
}

export default Login

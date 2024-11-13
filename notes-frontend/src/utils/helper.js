import { json } from "react-router-dom";

export const makeUnAuthenticatedGetRequest=async(route)=>{
    try{
        const response=await fetch("http://localhost:3300"+route,{
            method:'GET',
            headers:{
                'Content-type':'application/json'
            }
        });
        const formattedResponse =await response.json();
        return formattedResponse;
    }
    catch(error){
        console.log("error in making un authenticated post request",error);
        throw error;
    }
}

export const makeUnAuthenticatedPostRequest = async(route,data)=>{
    const response =await fetch("http://localhost:3300"+route,{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(data)
    });
   
    const formattedResponse=await response.json();
    return formattedResponse;
}

 export const makeAuthenticatedGetRequest=async(route)=>{
    const token=getToken("noteToken");
    try{
        const response=await fetch("http://localhost:3300"+route,{
            method:'GET',
            headers:{
                'Content-type':'application/json',
                'Authorization':'Bearer '+token
            }
        });
        if(!response.ok){
            throw new Error (`HTTP error! status: ${response.status}`);
        }
        const formattedResponse=await response.json();
        return formattedResponse;
    }
    catch(error){
        console.log("error during authenticated get request:",error);
        throw error;
    }
}

export const makeAuthenticatedPostRequest = async(route,data,isFormData=false) => {
    const token=getToken("noteToken");
    try{
        const response = await fetch("http://localhost:3300"+route,{
            method:'POST',
            headers:{
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                'Authorization':"Bearer "+token
            },
            body: isFormData ? data : JSON.stringify(data),
        });
        const formattedResponse=await response.json();
        return formattedResponse;
    }
    catch(error){
        console.log("error during authenticated post request",error)
        throw error;
    }
}

export const makeAuthenticatedPutRequest = async(route,data) => {
    const token=getToken("noteToken");
    try{
        const response = await fetch("http://localhost:3300"+route,{
            method:'PUT',
            headers:{
                'Content-type':'application/json',
                'Authorization':"Bearer "+token
            },
            body:JSON.stringify(data)
        });
        const formattedResponse=await response.json();
        return formattedResponse;
    }
    catch(error){
        console.log("error during authenticated post request",error)
        throw error;
    }
}

export const getToken=(tokenName)=>{
    const cookies = document.cookie.split(';');
    for(let i=0;i<cookies.length;i++){
        const cookie=cookies[i].trim();
        if(cookie.startsWith(`${tokenName}=`)){
            const tokenValue=cookie.substring(tokenName.length+1);
            return tokenValue;
        }
    }
}
import axios from 'axios';


export async function getRSAKeyPair(wId,domainurl,sub_skill) {
   try {
       
 let res=await axios.get(`/bot/api/${wId}/generateRSAKeyPair?domainurl=${domainurl}&sub_skill=${sub_skill}`)

   return res.data

    }
 catch (error) {
    return {success:false} 
}
  }

export const getOauthTokens=async(wId,sessionId)=>{
    try{
let res=await axios.get(`/bot/api/${wId}/generateOAuthTokens/${sessionId}`)
if(res.data.success){
    // return res.data.url
    return res.data
}
else{
    // return null
    return res.data
}


     }
  catch (error) {
     return {success:false} 
 }
}

export const validateDomainUrl=async(wId,domainurl)=>{
    try{
let res=await axios.get(`/bot/api/${wId}/validatedomainurl?domainurl=${domainurl}`)
if(res.data.success){
    return res.data
}
else{
    // return false
    return res.data
}
}
  catch (error) {
     return false
 }
}






export const getOauthTokensForUsers=async(wId,sub_skill)=>{
    try{
    let res=await axios.get(`/bot/api/${wId}/generateOauthTokensForUsers?sub_skill=${sub_skill}`)
if(res.data.success){
    return res.data.url
}

 return null
     }
  catch (error) {
     return {success:false} 
 }
}



export const guestOauthTokensForUsers = async (wId, sub_skill,queryParams) => {
    let queryString = ""
    if (queryParams.view) queryString += `&view=${queryParams.view}`
    if (queryParams.channel_id) queryString += `&channel_id=${queryParams.channel_id}`
    if (queryParams.channel_name) queryString += `&channel_name=${queryParams.channel_name}`
    if (queryParams.channel_type) queryString += `&channel_type=${queryParams.channel_type}`

    try {
        let res = await axios.get(`/bot/api/${wId}/guest/generateOauthTokensForUsers?sub_skill=${sub_skill}${queryString}`)
        if (res.data.success) {
            return res.data.url 
        }

        return null
    }
    catch (error) {
        return { success: false }
    }
}




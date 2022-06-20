import axios from 'axios';


export async function getRSAKeyPairForCloud(wId, domainurl,sub_skill) {
    try {

        let res = await axios.get(`/bot/api/${wId}/generateRSAKeyPairForCloud?domainurl=${domainurl}&sub_skill=${sub_skill}`)

        return res.data

    }
    catch (error) {
        return { success: false }
    }
}

export const getOauthTokensForCloud = async (wId, sessionId) => {
    try {
        let res = await axios.get(`/bot/api/${wId}/generateOAuthTokensForCloud/${sessionId}`)
        if (res.data.success) {
            // return res.data.url
            return res.data
        }
        else {
            // return null
            return res.data
        }


    }
    catch (error) {
        return { success: false }
    }
}

export const validateDomainUrl = async (wId, domainurl) => {
    try {
        let res = await axios.get(`/bot/api/${wId}/validatedomainurl?domainurl=${domainurl}`)
        if (res.data.success) {
            return res.data
        }
        else {
            // return false
            return res.data
        }
    }
    catch (error) {
        return false
    }
}






export const getOauthTokensForCloudUsers = async (wId,sub_skill) => {
    try {
        let res = await axios.get(`/bot/api/${wId}/generateOauthTokensForCloudUsers?sub_skill=${sub_skill}`)
        if (res.data.success) {
            return res.data.url
        }
        else return false
    }
    catch (error) {
        return false
    }
}




export const getGuestOauthTokensForCloudUsers = async (wId, sub_skill,queryParams) => {
    try {
        let queryString = ""
        if (queryParams.view) queryString += `&view=${queryParams.view}`
        if (queryParams.channel_id) queryString += `&channel_id=${queryParams.channel_id}`
        if (queryParams.channel_name) queryString += `&channel_name=${queryParams.channel_name}`
        if (queryParams.channel_type) queryString += `&channel_type=${queryParams.channel_type}`

        let res = await axios.get(`/bot/api/${wId}/guest/generateOauthTokensForCloudUsers?sub_skill=${sub_skill}${queryString}`)
        if (res.data.success) {
            return res.data.url
        }
        else return false
    }
    catch (error) {
        return false
    }
}

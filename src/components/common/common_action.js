import axios from 'axios';
import { SET_WORKSPACE, SET_USER,SET_USERS, SET_APPBAR_VIEW, SET_USER_WORKSPACE, SET_TEAM, UPDATE_ASSISTANT_NAME,USER_WORKSPACE_MEMBERSHIP } from './type';
// import {getAssisantSkills} from "../skills/skills_action"

export function setAppbarView(view) {
  return {
    type: SET_APPBAR_VIEW,
    view
  };
}

export function setWorkspace(workspace) {
  return {
    type: SET_WORKSPACE,
    workspace
  };
}

export function setUserWorkspaces(workspaces) {
  return {
    type: SET_USER_WORKSPACE,
    workspaces
  };
}

export function setUser(user) {
  return {
    type: SET_USER,
    user
  };
}
export function setSlackUsers(users){
  return{
   type:SET_USERS,
   users
  }

}

export function setTeamDetails(team) {
  return {
    type: SET_TEAM,
    team
  }
}
export function updateAssistantName(newName) {
  return {
    type: UPDATE_ASSISTANT_NAME,
    newName
  }
}

export function setUserWorkspaceMembership(usermembership) {
  return {
    type: USER_WORKSPACE_MEMBERSHIP,
    usermembership
  }
}


export function getUserWorkspaces(wId) {
  return dispatch => {
    // return axios.get('/api/workspace/'+id).then(res => {
    return axios.get('/api/workspaces').then(res => {
      if (res.data.success) {
        dispatch(setUserWorkspaces(res.data.workspaces));
      }
      return res;
    })     
  }
}

export function getWorkspace(wId) {
  return dispatch => {
    // return axios.get('/api/workspace/'+id).then(res => {
    return axios.get('/api/'+wId+'/workspace').then(res => {
      if (res.data.success) {
        dispatch(setWorkspace(res.data.workspace));
      }else{
        dispatch({type:"ERROR",payload:res.data})
      }
      return res;
    }).catch(err => {
      if(err.error !== "cancel"){
        dispatch({type:"ERROR",payload:{message:err.message,type:err.type}})
      }
      console.error(err)
      return err;
    })
  }
}

export function switchToRecentWorkspace() {
  return dispatch => {
    return axios.get('/api/workspaces').then(res => {
      if (res.data.success) {
        dispatch(setUserWorkspaces(res.data.workspaces))
        if(res.data.workspaces[0]) {
          // getAssisantSkills(res.data.workspaces[0]._id)
          dispatch(setWorkspace(res.data.workspaces[0]))
          localStorage.setItem("userCurrentWorkspaceId", res.data.workspaces[0]._id)
        }
      }
      return res;
    })     
  }
}

// export function getTeamInfo(id) {
//   return dispatch => {
//     return axios.get('/api/workspace/'+id+"/team").then(res => {
//       if (res.data.success) {
//         dispatch(setTeam(res.data.workspace));
//       }else{
//         dispatch({type:"ERROR",payload:res.data})
//       }
//       return res;
//     }).catch(err => {
//       if(err.error !== "cancel"){
//         dispatch({type:"ERROR",payload:{message:err.message,type:err.type}})
//       }
     
//       return err;
//     })
//   }
// }
export function  getProfileinfo() {
  return dispatch => {
    return axios.get('/api/getProfileinfo').then(res => {
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        localStorage.setItem("trooprUserId",res.data.user._id);
      }
      return res;
    });
  }
}


export function getAllSlackUsers(wId){
return dispatch=>{
return axios.get(`/bot/slack/getAllUsers/${wId}`).then(res=>{
if(res.data.success){
dispatch(setSlackUsers(res.data.users))
}
})
}
}



export function sendWelcomeMessageToUser(wId){

return axios.get(`/bot/api/slack/${wId}/sendWelcomeMessage`).then(res=>{

})

}

export const getChannelInfo= async(wId,channelId)=>{
 let info=await  axios.get(`/bot/api/${wId}/getChannelInfo/${channelId}`) 
 if(info.data.success){
   return info.data&&info.data.channelName
 }
 return null
}

export const sendUserActivity=async(wId,userId,path)=>{
let data={
  userId,
  path
}


 axios.post(`/bot/api/${wId}/webappactivity`,data)

}

export function  sendUserFeedback(data) {
  return dispatch => {
    return axios.post(`/bot/api/feedback`,data).then(res => {
      return res;
    });
  }
}

export function SyncSlackUser(workspace_id,useremail){

  return axios.get(`/bot/api/syncSlackUser?workspace_id=${workspace_id}&slackUserEmail=${useremail}`).then(res=>{
    return res.data
  }
  )

}

export function getUserWorkspaceMembership(wId) {
  return dispatch => {
    // return axios.get('/api/workspace/'+id).then(res => {
    return axios.get(`/api/${wId}/getWorkspaceMembership`).then(res => {
      if (res.data.success) {
        dispatch(setUserWorkspaceMembership(res.data.user));
      }
      return res;
    })     
  }
}
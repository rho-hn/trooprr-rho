import axios from 'axios';

import { SET_PROJECT_MEMBERS, DELETE_PROJECT_MEMBER, ADD_PROJECT_MEMBER, DELETE_PROJECT_INVITE, ADD_PROJECT_SHARE_URL, ADD_PROJECT_INVITE, SET_PROJECT_INVITES } from './types';

export function setProjectMembers(members) {
  return {
    type: SET_PROJECT_MEMBERS,
    members
  };
}

export function removeMember(id) {
  return {
    type: DELETE_PROJECT_MEMBER,
    id
  };
}
export function addProjectMember(member) {
  return {
    type: ADD_PROJECT_MEMBER,
    member
  };
}
export function projectShareUrl(url) {
  return {
    type: ADD_PROJECT_SHARE_URL,
    url
  }
}
export function setProjectInvites(invites) {
  return {
    type: SET_PROJECT_INVITES,
    invites
  };
}
export function insertProjectInvite(invite) {
  return {
    type: ADD_PROJECT_INVITE,
    invite
  };
}
export function removeProjectInvite(id) {
  return {
    type: DELETE_PROJECT_INVITE,
    id
  };
}

export function setToProjectAdmin(member, value){
  return {
    type: 'SET_PROJECT_ADMIN',
    member,
    value
  } 
}

export function setProjectAdmin(userId, body,wId){
  return dispatch => {
    // return axios.put(`/api/userProjectMembership/${userId}`,body).then(res => {
    return axios.put(`/api/${wId}/squad_membership/${userId}`,body).then(res => {
      if(res.data.success){
        dispatch(setToProjectAdmin(userId, body.role));
      }
    })
  }
}

export function getMembers(sid,wId) {
  return dispatch => {
    // return axios.get('/api/project/'+id+'/membership').then(res => {
    return axios.get('/api/'+wId+'/squad/'+sid+'/membership').then(res => {
      if (res.data.success) {
        dispatch(setProjectMembers(res.data.members));
      }
      return res;
    }).catch(err => {
      if(err.response.data.error === 'No such user'){
       dispatch({ type: 'PROJECT_ACCESS_DENIED', projectAccess: false })
       console.error(err)
       
      }
      return err;
    }) 
  }
}
export function getProjectInvites(id,wId) {
  return dispatch => {
    // return axios.get('/api/project/'+id+'/invites').then(res => {
    return axios.get('/api/'+wId+'/squad/'+id+'/invites').then(res => {
      if (res.data.success) {
        dispatch(setProjectInvites(res.data.invites));
      }
      return res;
    }).catch(err => {
      if(err.response.data.error === 'No such user'){
       dispatch({ type: 'PROJECT_ACCESS_DENIED', projectAccess: false })
       console.error(err)
       
      }
      return err;
    }) 
  }
}

export function addMember(id, name, workspace_id, email,chatClient) {
  
  return dispatch => {
    // return axios.post('/api/project/'+id+'/membership', { name: name, workspace_id: workspace_id._id, user: email }).then(res => {
    return axios.post('/api/'+workspace_id+'/squad/'+id+'/membership', { name: name, workspace_id: workspace_id, user: email }).then(res => {
      if (res.data.success) {
        if (res.data.member) {
         
          dispatch(addProjectMember(res.data.member))
        }else{
     
          dispatch(insertProjectInvite(res.data.invite));
        }
            
          }
    
  return res;
      
      
    });
  }
}

export function deleteMember(smid,wId) {
  return dispatch => {
    // return axios.delete('/api/deleteMembership/' + id).then(res => {
    return axios.delete('/api/'+wId+'/squad_membership/' + smid).then(res => {
      if (res.data.success) {
        dispatch(removeMember(smid));
      }
      return res;
    });
  }
}


export function generateProjectShareUrl(workspace_id, project_id) {
  return dispatch => {
    // return axios.post('/api/project_invite_token', { workspace_id: workspace_id, project_id: project_id }).then(res => {
    return axios.post('/api/'+workspace_id+'/squad_inviteUrl', { workspace_id: workspace_id, project_id: project_id }).then(res => {
      if (res.data.success) {
        dispatch(projectShareUrl(res.data.url));
      }
      return res;
    });
  }
}
export function getProjectShareUrl(sid,wId) {
  return dispatch => {
    // return axios.get('/api/' + id + '/project_invite_token').then(res => {
    return axios.get('/api/' + wId + '/squad/'+sid+'/squad_inviteUrl').then(res => {
      if (res.data.success) {
        dispatch(projectShareUrl(res.data.url));
      }
      return res;
    });
  }
}

export function deleteProjectInvite(siId,wId) {
  // console.log("kjdsadl")
  return dispatch => {
    // return axios.delete('/api/projectInvite/' + id ).then(res => {
    return axios.delete('/api/'+wId+'/squadInvite/' + siId ).then(res => {
      if (res.data.success) {
        dispatch(removeProjectInvite(siId));
      }
      return res;
    });
  }
}


import axios from 'axios';
import { insertProject } from'../../../projectActions.js'
import {insertWorkspace } from '../../../../workspace/workspaceActions';
import { removeWorkspaceInvite} from '../../../../workspace/pending/workspaceInviteActions';


import { SET_USER_PROJECT_INVITES, DELETE_USER_PROJECT_INVITE } from './types';

export function setProjectInvites(invites) {
  return {
      type: SET_USER_PROJECT_INVITES,
      invites
  };
}

export function removeProjectInvite(id) {
  return {
      type:  DELETE_USER_PROJECT_INVITE,
      id
  };
}

export function getProjectInvites(wId) {
  return dispatch => {
    // return axios.get('/api/getInvitedUserProjects').then(res => {
    return axios.get('/api/'+wId+'/squad_getInvitedUserSquads').then(res => {

      if (res.data.success) {
        dispatch(setProjectInvites(res.data.projects));
      }
      return res;
    });
  }
}

export function addProjectMember(invite,wId) {
  
  return dispatch => {
    // return axios.put('/api/project/'+invite.project_id._id+'/membership',{invite:invite}).then(res => {
    return axios.put('/api/'+wId+'/squad/'+invite.project_id._id+'/membership',{invite:invite}).then(res => {
      if (res.data.success) {
       
        dispatch(removeProjectInvite(invite._id));
      
          if(res.data.workspace_membership){
              dispatch(insertWorkspace(res.data.member.project_id.workspace_id))
                  if(res.data.workspace_membership.status==="updated"){

                    dispatch(removeWorkspaceInvite(res.data.workspace_membership.membership._id))
                  }
                
          }
        dispatch(insertProject(res.data.member.project_id))
      }
      return res;
    });
  }
}

export function deleteProjectInvite(id) {
  // console.log("getting called====>");
  return dispatch => {
    return axios.delete('/api/project/'+id+'/membership').then(res => {
      if (res.data.success) {
        dispatch(removeProjectInvite(id));
      }
      return res;
    });
  }
}
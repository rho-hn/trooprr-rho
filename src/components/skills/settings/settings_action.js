import axios from 'axios';
import { GET_LAUNCHER_DATA,
         GET_USER_DATA,
         UPDATE_USER_ACTIONS, 
         UPDATE_ACTIONS_DATA,
         GET_SKILLS_ACTION, 
         GET_RESET_DATA } 
from './type';

export function getLauncherData( alldata ) {
  return {
    type:GET_LAUNCHER_DATA,
    alldata
  };
}

export function getuserData( userdata ) {
  return {
    type:GET_USER_DATA,
    userdata
  };
}

export function getResetuserData( resetdata ) {
  return {
    type: GET_RESET_DATA,
    resetdata
  };
}


export function updateAllActionData( userAction ) {
  return {
    type: UPDATE_ACTIONS_DATA,
    userAction
  }
}

export function updateUserActionsData( userActions ) {
  return {
    type: UPDATE_USER_ACTIONS ,
    userActions
  }
}

export function getSkillActions( skillActions ) {
  return {
    type: GET_SKILLS_ACTION,
    skillActions
  }
}

export function SkillsAction( id ) {
   return dispatch => {
    //  return axios.get('/api/workspace/'+id+'/launcherskillactions')
     return axios.get('/api/workspace/'+id+'/launcherskillactions')
                 .then(res => {
                   if (res.data.success) {
                    dispatch(getSkillActions(res.data.action));
                   }
      return res;
    });
  }
}

//Get all the actions
export function getAllData( id ) {
   return dispatch => {
     return axios.get('/api/workspace/'+id+'/launcheractions')
                 .then(res => {
                   if (res.data.success) {
                     dispatch(getLauncherData(res.data.buttons));
                   }
      return res;
    });
  }
}

//Get user based actions
export function getAllUserActions( id ) {
   return dispatch => {
     return axios.get('/api/workspace/'+id+'/actions')
                 .then(res => {
                   if(res.data.success) {
                    dispatch(getuserData(res.data.userData));
                   }
       return res;
    });
  }
}

//Reset User Selected actions to default
export function getResetUserActions( id ) {
   return dispatch => {
     return axios.get('/api/workspace/'+id+'/resetActions')
                 .then(res => {
                   if(res.data.success) {
                     dispatch(getResetuserData(res.data.userData));
                   }
      return res;
    });
  }
}

//Update user based actions
export function updateUserActions( id, data ) {
   return dispatch => {
     return axios.post('/api/workspace/'+id+'/updateUserActions',data)
                 .then(res => {
                    if(res.data.success) {
                      dispatch(updateAllActionData(data.userActions.actionIds));
                      dispatch(updateUserActionsData(res.data.savedMemberAction.actions));
                    }
      return res;
    });
  }
}

//Remove user based actions
export const removeUserAction = ( id, actionId ) => {
   return dispatch => {
     return axios.put('/api/workspace/'+id+'/removeUserAction',{ actionId })
                 .then(res => {
                   if (res.data.success) {
                     dispatch(updateAllActionData(res.data.actions));
                     dispatch(updateUserActionsData(res.data.memberAction.actions));
                   }
      return res;
    });
  }
}


//Use the URL to bypass CORS issue : - 
import axios from 'axios';
import { 
      SET_GUEST_MANAGER,
      SET_GUEST_USERS,
      EDIT_GUEST_USERS

   
     } 
from './types';


  export function  setGuestManager(manager) {


    return {
      type: SET_GUEST_MANAGER,
      manager
    };
  }


  export function  setGuestUsers(jiraGuestUsers) {


    return {
      type: SET_GUEST_USERS,
      jiraGuestUsers
    };
  }


  export function  editGuestUser(jiraGuestUsers) {

    return {
      type: EDIT_GUEST_USERS,
      jiraGuestUsers
    };
  }


  





export function getJiraGuestManager(id){
return dispatch => {    
     return axios.get(`/bot/api/${id}/jira_guest_manager`)
              .then(res =>{
                if(res.data.success){
                     dispatch(setGuestManager(res.data.jira_guest_manager))
                 }
      return res;
    })
 }
}

export function addJiraGuestManager(id,data){
return dispatch =>{    
       return axios.post(`/bot/api/${id}/jira_guest_manager`,data)
                .then(res => {
                  if(res.data.success){
                    dispatch(setGuestManager(res.data.jira_guest_manager))
                   }
        return res;
      })
   }
  }

export  function revokeJiraGuestManager(id,mId){
    return dispatch =>{    
           return axios.delete(`/bot/api/${id}/jira_guest_manager/${mId}`)
                    .then(res => {
                      if(res.data.success){
                        dispatch(setGuestManager({}));
                        dispatch(setGuestUsers([]));
                       }
            return res;
          })
       }
      }


      export  function getJiraGuestUsers(id,mId){
        return dispatch =>{    
               return axios.get(`/bot/api/${id}/jira_guest_users/${mId}`)
                        .then(res => {
                          if(res.data.success){
                            
                            dispatch(setGuestUsers(res.data.jira_guest_users))
                           }
                return res;
              })
           }
          }

    
          export  function updateJiraGuestUser(id,gUId,data){
            return dispatch =>{    
                   return axios.put(`/bot/api/${id}/jira_guest_users/${gUId}`,data)
                            .then(res => {
                              if(res.data.success){
                                
                                dispatch(editGuestUser(res.data.jira_guest_user))
                               }
                    return res;
                  })
               }
                    

            }
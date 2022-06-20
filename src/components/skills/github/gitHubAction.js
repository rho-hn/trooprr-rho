import axios from 'axios';


import { 
    SET_AUTOMATIONS,
    UPDATE_AUTOMATIONS,SET_AUTOMATION,ADD_AUTOMATION,DELETE_AUTOMATION,SET_REPOS,SET_GITHUB_PROJECTS,SET_GITHUB_COLUMNS,SET_REPO_LABELS,SET_REPO_ASSIGNABLEUSERS,
    SET_ORG_REPO_PROJECTS,SHOW_SET_V3_MILESTONES,SET_REPO_PROJECTS,SET_ORG_PROJECTS
     } from './types';


export function setAutomations(automations) {
  return {
    type: SET_AUTOMATIONS,
    automations
  };
}

export function editAutomations(automation) {
    return {
      type: UPDATE_AUTOMATIONS,
      automation
    };
  }
  export function setAutomation(automation) {
    return {
      type: SET_AUTOMATION,
      automation
    };
  }

  export function addAutomation(automation) {
    return {
      type: ADD_AUTOMATION,
      automation
    };
  }

export function removeAutmation(id){
    return {
        type: DELETE_AUTOMATION,
        id
      };

}

export function setRepos(repos){
    return {
        type: SET_REPOS,
        repos
      };

}
export function setProjects(projects){
    return {
        type: SET_GITHUB_PROJECTS,
        projects
      };

}
export function setOrgRepoProjects(projects){
  return {type:SET_ORG_REPO_PROJECTS,
  projects
  }
}
export function setColums(columns){
    return {
        type: SET_GITHUB_COLUMNS,
        columns
      };

}

export function setRepoLabels(labels){
    return {
        type: SET_REPO_LABELS,
        labels
      };

}
export function setRepoAssignableUsers(users){
    return {
        type: SET_REPO_ASSIGNABLEUSERS,
        users
      };

}

export function deleteGitProjConfig(deletedId){
  return{
    type:"DELETE_GIT_PROJECT_CONFIG",
    deletedId
  }
}

export function deleteProjectInputs(deletedInput){
  return{
    type:"DELETE_GIT_PROJECT_INPUTS",
    deletedInput
  }
}

export function showErrorModal(showModal){
  return{
    type:"SHOW_ERROR_MODAL",
    showModal
  }
}

export function setMileStones(mileStones){
  return{
    type:"SHOW_SET_MILESTONES",
    mileStones
  }
}

export function setv3Milestones(mileStones){
  return {
    type:SHOW_SET_V3_MILESTONES,
    payload:mileStones
  }
}
export function setRepoProjects(projects){
  return {
    type:SET_REPO_PROJECTS,
    projects
  }
}
export function setOrgRepoProject(projects){
  return {
    type:SET_ORG_PROJECTS,
    projects
  }
}






export function getAutomations(wId) {
  return dispatch => {
    return axios.get("/bot/api/workspace/"+wId+"/github/getWorkspaceAutomation")
                .then(res => {
                    if (res.data.success ) {
          
                        dispatch(setAutomations(res.data.automations))
                    }
                    return res;
                    });
                }
    }


export function addAutomationApi(wId,data) {
  return dispatch => {
    return axios.post('/bot/api/workspace/'+wId+'/github/addAutomation', data)
                .then(res => {
                  
                if (res.data.success ) {
                    dispatch(addAutomation(res.data.automation))
                  
                
                  }
                  
                  return res;
    });
  }
}

export function updateAutomation(wId,id,data) {
  return dispatch => {
    return axios.put("/bot/api/workspace/"+wId+"/github/"+id+"/updateAutomation", data)
                .then(res => {
                    if (res.data.success) {
                    
                        dispatch(editAutomations(res.data.automation));
                    }
      return res;

    });

  }
}

export function deleteAutomation(wId,id) {
    return dispatch => {
      return axios.delete("/bot/api/workspace/"+wId+"/github/"+id+"/removeAutomation")
                  .then(res => {
                      if (res.data.success  ) {
                      
                          dispatch(removeAutmation(id));
                      }
        return res;
  
      });
  
    }
  }

export function getOrganistaionProject(wId) {
    return dispatch => {
  
    return axios.get('/bot/api/workspace/'+wId+'/github/getOrgProjects').then(res => {
      // var token=localStorage.token
     
    if(res.data.success){
        dispatch(setOrgRepoProject(res.data.projects));
             

      }  
      return res
    });}
  }

  export function getRepoProject(wId,repoId) {
    return dispatch => {
    return axios.get('/bot/api/workspace/'+wId+'/github/'+repoId+'/getRepoProjects').then(res => {

     
    if(res.data.success){
      // console.log("res=====>",res.data);
      
        dispatch(setRepoProjects(res.data.projects));
             

      }  
      return res
    });}
  }

  export function getOrgAndRepoProject(wId){
// console.log("checkkiinnggg");

    return dispatch=>{
    return axios.get(`/bot/api/workspace/${wId}/github/getAllProjects`).then(res=>{
    
      
if(res.data.success){
dispatch(setOrgRepoProjects(res.data.projects))
}
  })
    }
  }

  export function getMileStone(wId,repoId,skill_id) {
    return dispatch => {
    return axios.get('/bot/api/workspace/'+wId+'/github/'+repoId+'/skillId/'+skill_id+'/getMileStones').then(res => {

     
    if(res.data.success){
        dispatch(setMileStones(res.data.data));
             

      }  
      return res
    });}
  }
export function getv3Milestones(wId,repoId){
  // console.log("comee");
  
return dispatch=>{
return axios.get(`/bot/api/workspace/${wId}/github/${repoId}/getv3milestones`).then(res=>{
  if(res.data.success){
    dispatch(setv3Milestones(res.data.milestones))
  }
})

}
}
  

  export function getRepoLabels(wId,repoId) {
    return dispatch => {
    return axios.get('/bot/api/workspace/'+wId+'/github/'+repoId+'/getRepoLabels').then(res => {

     
    if(res.data.success){
        dispatch(setRepoLabels(res.data.labels));
             

      }  
      return res
    });}
  }
  export function getRepoAssignableUsers(wId,repoId) {
    return dispatch => {
    return axios.get('/bot/api/workspace/'+wId+'/github/'+repoId+'/getRepoAssignableUsers').then(res => {

     
    if(res.data.success){
        dispatch(setRepoAssignableUsers(res.data.users));
             

      }  
      return res
    });}
  }


  export function getRepos(wId) {

    return dispatch => {
    return axios.get('/bot/api/github/'+wId+'/getRepos').then(res => {
      // var token=localStorage.token
     
    if(res.data.success){
        dispatch(setRepos(res.data.repositories));
             

      }  
      return res
    });}
  }


export const getProjectColumns = (wId,pId,type)  =>{
    return dispatch => {
  return axios.get('/bot/api/workspace/'+wId+'/github/'+pId+'/getProjectColumns').then(res=>{
       if(res.data.success){
         if(type==="projectCard"){
          res.data.columns.push({id:"any",name:"Any"});
          }
         dispatch(setColums(res.data.columns))
       }
       return res;
  })   }       
}




export const setGitHubChannelProjectConfig = (wId,skillId,data) =>{
  let userId = data.user_id;
 return dispatch =>{
   return axios.post("/bot/api/"+wId+"/gitHubProjectConfig/"+skillId+"/"+userId,data)
     .then(res=>{

       return res;


     })
 }
  
}

export const getGitHubChannelProjectConfig = (wId,skillId,channelId,projId) =>{
  let id;
  
  if(projId){
    id=projId
   }else{
    id=""
   }
 return dispatch =>{
   return axios.get("/bot/api/"+wId+"/gitHubProjectConfig/"+skillId+"/"+channelId,{
    params:{
      projId:id
    }
   })
     .then(res=>{

       return res;


     })
 }
} 


export const enableAndDisable = (wId,skillId,data) =>{
  let userId = data.user_id;

  return dispatch =>{
    return axios.post("/bot/api/"+wId+"/enableNotif/"+skillId+"/"+userId,data)
    .then(res=>{
      return res;
    })
  }

}

export const deleteInputs = (wId,skillId,channelId,data) =>{

  return dispatch =>{
    return axios.post("/bot/api/"+wId+"/deleteInputs/"+skillId+"/"+channelId,data).then(res=>{
      // console.log("")
    
      dispatch(deleteProjectInputs(res.data));
      return res;
    })
  }
}

export const deleteConfig = (wId,skillId,channelId,data) =>{
  return dispatch =>{
    return axios.post("/bot/api/"+wId+"/deleteConfig/"+skillId+"/"+channelId,data).then(res=>{
        dispatch(deleteGitProjConfig(res.data));
    })
  }
}

export const deleteGitHubIssueConfig = (wId,skillId,channelId,data) =>{
  return dispatch =>{
    return axios.post("/bot/api/"+wId+"/deleteIssueConfig/"+skillId+"/"+channelId,data).then(res=>{
        dispatch(deleteGitProjConfig(res.data));
    })
  }
}

// export const deleteIssueConfig = (wId,skillId,channelId,data) =>{
//   return dispatch =>{
//     return axios.post("/bot/api/"+wId+"/deleteConfig/"+skillId+"/"+channelId,data).then(res=>{
//       return res;
//     })
//   }
// }
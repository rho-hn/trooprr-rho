import axios from 'axios';

import { SET_PROJECTS, SET_PROJECT, EDIT_PROJECT, DELETE_PROJECT, ADD_PROJECT, SET_VIEW, SET_PROJECT_USER_EMAIL_TASK_SETTING, GET_ARCHIVE_PROJECT, SET_WORKSPACE_PROJECTS, SET_MY_PROJECTS,SET_WORKSPACE_KEYS } from './types';
// import {UPDATE_USER_WORKSPACE_PROJECTS, EDIT_USER_WORKSPACE_PROJECTS,REMOVE_USER_WORKSPACE_PROJECT} from '../workspace/types.js';


export function setProjects(projects) {
  return {
    type: SET_PROJECTS,
    projects
  };
}
export function setTaskView(view) {
  return {
    type: SET_VIEW,
    view
  };
}

export function setProject(project) {
  return {
    type: SET_PROJECT,
    project
  };
}

export function editProject(project) {
  return {
    type: EDIT_PROJECT,
    project
  };
}
export function insertProject(project) {
  return {
    type: ADD_PROJECT,
    project
  };
}
export function removeProject(id) {
  return {
    type: DELETE_PROJECT,
    id
  };
}

export function setProjectUserEmailTaskSetting(setting) {
  return {
    type: SET_PROJECT_USER_EMAIL_TASK_SETTING,
    setting
  };
}

export function setLocalStorageProjects(projectId) {
  return {
    type: 'SET_LOCAL_STORAGE_PROJECT',
    projectId
  }
}

export const setRecentProjects = (projects) => {
  return {
    type: 'SET_RECENT_PROJECTS',
    projects
  }
}

export const setWorkspaceProjects = (projects) => {
  return {
    type: SET_WORKSPACE_PROJECTS,
    projects
  }
}

export function recentProjects(sId,wId) {
  return dispatch => {
    return axios.post(`/api/${wId}/squad/${sId}/updateRecentSquad`, {})
      .then(res => {
        if (res.data.success) {
          dispatch(setRecentProjects(res.data.recentProjects));
        }
        return res;
      })
  }
}

export function getRecentProjects(wId) {
  return dispatch =>{
    // return axios.get('/api/getRecentProjects/user')
    return axios.get('/api/'+wId+'/squads_recent')
                .then(res =>{
                  if(res.data.success){
                    dispatch(setRecentProjects(res.data.recentProjects));
                  }
                  return res;
                })
  }
}

export function deleteRecentProject(wId,sId) {
  return dispatch =>{
    // return axios.get('/api/getRecentProjects/user')
    return axios.post(`/api/${wId}/squad/${sId}/deleteRecentSquad`, {})
                .then(res =>{
                  if(res.data.success){
                    dispatch(setRecentProjects(res.data.recentProjects));
                  }
                  return res;
                })
  }
}

// export function getProjects(id) {
//   return dispatch => {
//     return axios.get('/api/projects').then(res => {
//       if (res.data.success) {
//         dispatch(setProjects(res.data.projects));
//         for (var i in res.data.projects) {
//           if (res.data.projects[i].type && res.data.projects[i].type == 'initiative') {
//             dispatch({ type: 'SET_INITIATIVE', payload: res.data.projects[i] })
//             break;
//           }
//         }
//       }
//       return res;
//     });
//   }
// }


export function getProjects(id) {

  // console.log("get user projects is called",id);
  return dispatch => {

    // return axios.get(`/api/workspace/${id}/getUserWorkspaceProjects`).then(res => {
    return axios.get(`/api/${id}/squads`).then(res => {

      if (res.data.success) {
        dispatch(setProjects(res.data.projects));
      }
      return res;
    });
  }
}



export function searchProjects(value) {
  return {
    type: 'SEARCH_PROJECTS',
    payload: value
  }
}

export function clearSearch() {
  return {
    type: 'CLEAR_SEARCH'
  }
}

export function addProject(id, projData) {
  return dispatch => {
    // return axios.post('/api/newProject/' + id, projData).then(res => {
    return axios.post('/api/'+id+'/squad', projData).then(res => {

      if (res.data.success) {
        res.data.project["filter_value"] = '';
        // res.data.project['total_tasks'] = 0
        dispatch(insertProject(res.data.project));
        // const obj = {};
        // obj.name = res.data.project.name;
        // obj._id = res.data.project._id;
        // obj.filter_value = '';
        // dispatch({type:UPDATE_USER_WORKSPACE_PROJECTS,project:obj})
        
      }
      return res;
    });
  }
}
export function import_project(wid, projData) {
  return dispatch => {
    // return axios.post("/api/" + id + "/importProject", projData).then(res => {
    return axios.post("/api/" + wid + "/importProject", projData).then(res => {
      if (res.data.success) {
        dispatch(insertProject(res.data.project));
      }
      return res;
    });
  }
}








export function getProject(id,wId) {
  return dispatch => {
    // return axios.get('/api/project/' + id).then(res => {
    return axios.get('/api/'+wId+'/squad/' + id).then(res => {
      if (res.data.success) {
        dispatch(setProject(res.data.project));
      }
      return res;
    }).catch(err => {
      dispatch({ type: 'ERROR', payload:{message:"not member of this project",type:"PROJECT_MEMBERSHIP"} })
      // console.log("---------------- Errrrrrorrrrrr----",err);
      // if (err.response && err.response.data.error === 'No such user') {
      //   dispatch({ type: 'PROJECT_ACCESS_DENIED', projectAccess: false })

      // }
      console.error(err)
      return err;
    })
  }
}

export function updateProject(id, projData,wId) {
  return dispatch => {
    // return axios.put('/api/project/' + id, projData).then(res => {
    return axios.put('/api/'+wId+'/squad/' + id, projData).then(res => {
      if (res.data.success) {
        dispatch(editProject(res.data.project));
        dispatch(setProject(res.data.project));
        if (res.data.availability) {
          dispatch({ type: 'GET_ARCHIVE_PROJECT', projects: res.data });
          // dispatch({type:REMOVE_USER_WORKSPACE_PROJECT,id})
        } else {
          dispatch(editProject(res.data.project));
        }
      }
      return res;
    });
  }
}

export const updateNextSprint = (sprint) => {
  return {
    type: 'UPDATE_NEXT_SPRINT',
    payload: sprint
  }
}

export function deleteProject(sid,wId) {
  return dispatch => {
    // return axios.delete('/api/project/' + id).then(res => {
    return axios.delete('/api/'+wId+'/squad/' + sid).then(res => {
      if (res.data.success) {
        dispatch(removeProject(sid));
        dispatch(setProject({}));
      }
       return res;
      // dispatch(sendDeleteProjectToaster())
    });
  }
}

export function sendDeleteProjectToaster(){
 return{
  type:'PROJECT_NOT_DELETED'
 } 

}
export function leaveProject(sid,wId) {
  return dispatch => {
    // return axios.delete('/api/project/' + id + '/leaveProject').then(res => {
    return axios.delete('/api/'+wId+'/squad/' + sid + '/leave').then(res => {
      if (res.data.success) {

        dispatch(removeProject(sid));
        // dispatch({type:REMOVE_USER_WORKSPACE_PROJECT,id})
      }

      return res;
    });
  }
}
export function moveProject(id, projData) {
  return dispatch => {
    return axios.put('/api/project/' + id + '/moveProject', projData).then(res => {
      if (res.data.success) {
        dispatch(editProject(res.data.project));
        dispatch(setProject(res.data.project));
      }
      return res;
    });
  }
}
export function getProjectUserEmailTaskSetting(id, projData,wId) {
  // console.log("getprojectuseremailtasksetting===========>",id,projData);
  return dispatch => {
    // return axios.get('/api/project/' + id + '/projectUserEmailTask', projData).then(res => {
    return axios.get('/api/'+wId+'/squad/' + id + '/projectUserEmailTask', projData).then(res => {
      if (res.data.success) {
        // console.log("return mdata",res.data)
        dispatch(setProjectUserEmailTaskSetting(res.data.setting));

      }
      return res;
    }).catch(err => {
      if (err.response.data.error === 'No such user') {
        dispatch({ type: 'PROJECT_ACCESS_DENIED', projectAccess: false })

      }
      console.error(err)
      return err;
    })
  }
}
export function updateProjectUserEmailTaskSetting(id,eId,data,wId) {
  return dispatch => {
   
    // return axios.put('/api/project/' + id + '/updateProjectUserEmailTaskSetting/'+ eId, data).then(res => {
    return axios.put('/api/'+wId+'/squad/' + id + '/updateUserEmailTaskSetting/'+ eId, data).then(res => {
      
      if (res.data.success) {
        dispatch(setProjectUserEmailTaskSetting(res.data.setting));
      }

    });
  }
}
export const addCustomAttribute = (id, data,wId) => {
  return dispatch => {
    // return axios.put('/api/project/' + id + '/custom_attributes', data).then(res => {
    return axios.put('/api/'+wId+'/squad/' + id + '/custom_attributes', data).then(res => {

      if (res.data.success) {
        dispatch(editProject(res.data.project));
        dispatch(setProject(res.data.project));
      }
      return res;
    })
  }
}


export const deleteCustomAttribute = (id, caid,wId) => {
  return dispatch => {
    // return axios.delete('/api/project/' + id + '/custom_attributes/' + attribute_id).then(res => {
    return axios.delete('/api/'+wId+'/squad/' + id + '/custom_attribute/' + caid).then(res => {
      if (res.data.success) {
        dispatch(editProject(res.data.project));
        dispatch(setProject(res.data.project));
      }
      return res;
    })
  }
}

export const editCustomAttribute = (id, data,wId) => {
  return dispatch => {
    // return axios.put('/api/project/' + id + '/edit_custom_attribute', data).then(res => {
    return axios.put('/api/'+wId+'/squad/' + id + '/custom_attribute', data).then(res => {
      // console.log("this is actions data",res)

      if (res.data.success) {
        dispatch(editProject(res.data.project));
        dispatch(setProject(res.data.project));
      }
      return res;
    })
  }
}

export const completeSprint = (project) => {
  project["status"] = 'completed';
  return dispatch => {
    return axios.put(`/api/project/${project._id}`, project).then(res => {
      if (res.data.success) {
        dispatch({ type: 'COMPLETE_SPRINT', payload: res.data.project })
      }
      return res;
    })
  }
}



export const getProjectActivities = (squad_id, skip, limit,wId) => {
  // console.log("Red==========>",project_id,skip,limit)
  if (squad_id) {
    return dispatch => {
      // return axios.get(`/api/project/${project_id}/activities?skip=${skip}&limit=${limit}`).then(res => {
      return axios.get(`/api/${wId}/squad/${squad_id}/activities?skip=${skip}&limit=${limit}`).then(res => {
        if (res.data.success) {
          
          dispatch({ type: 'SAVE_PROJECT_ACTIVITIES', payload: res.data })
        } else {
          dispatch({ type: 'SAVE_PROJECT_ACTIVITIES', payload: [] })
        }
        return res;
      }).catch(e => {
        dispatch({ type: 'SAVE_PROJECT_ACTIVITIES', payload: [] })
        console.error(e)
        return e;
      })
    }
  } else {
    return dispatch => {
      dispatch({ type: 'SAVE_PROJECT_ACTIVITIES', payload: [] })
    }
  }
}

export const removeProjectActivities = () => {
  return {
    type: 'REMOVE_PROJECT_ACTIVITIES'
  }
}



export const archiveProject = (id,wId) => {
  return dispatch => {
    // return axios.put(`/api/project/${id}/archive`).then(res => {
    return axios.put(`/api/${wId}/squad/${id}/archive`).then(res => {
      if (res.data.success) {
        dispatch({ type: 'ARCHIVE_PROJECT', payload: res.data.project })
      } else {
        dispatch({ type: 'ARCHIVE_PROJECT', payload: null })
      }
      return res;
    }).catch(e => {
      dispatch({ type: 'ARCHIVE_PROJECT', payload: null })
      console.error(e)
      return;
    })
  }
}


export const getArchiveProjects = () => {
  return dispatch => {
    return axios.get('/api/project/getArchiveProjects')
      .then(res => {
        if (res.data.success) {
          dispatch({ type: 'GET_ARCHIVE_PROJECT', projects: res.data.projects });
        }
        return res;
      })
  }
}




export const updateProjectFilterValue = (data, sid,wId) => {
  return dispatch => {
    // return axios.put('/api/setFilterValue/' + id, data)
    return axios.put('/api/'+wId+'/squad/' + sid+'/updateFilter', data)
      .then(res => {
        if (res.data.success) {
          dispatch({ type: 'SET_PROJECT_FILTER_VALUE', payload: res.data.userProjectMembership })
        }
        return res;
      });
  }
}

export const getWorkspaceProjects = (id) => {
  return dispatch => {
    // return axios.get(`/api/workspace/${id}/all_projects`).then(res => {
    return axios.get(`/api/${id}/squads_all`).then(res => {
      if (res.data.success) {
        dispatch(setWorkspaceProjects(res.data.projects));
      }
      return res;
    })
  }
}

export const getMyProjects = () => {
  return dispatch => {
    return axios.get(`/api/get_my_projects`).then(res => {
      if (res.data.success) {
        dispatch({ type: SET_MY_PROJECTS, myProjects: res.data.myProjects })
      }
      return res;
    })
  }
}


export const getWorkspaceProjectKeys=(wId)=>{
  return dispatch => {
    return axios.get(`/api/${wId}/projectkeys`).then(res => {
      if (res.data.success) {
        dispatch({type:SET_WORKSPACE_KEYS,keys:res.data.keys})
      }
      return res;
    })
  }

}



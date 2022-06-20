import axios from 'axios';
import { editTask, setTask } from '../tasks/task/taskActions.js';
// import { editMyTask } from '../myspace/tasks/mytaskActions.js';

import { SET_SIDEBAR, DELETE_TASK_COMMENT, UPDATE_CHECKLIST_ITEM,SET_CHAT_CLIENT, SET_CHANNEL, SET_TASK_COMMENTS,ADD_TASK_COMMENT,SET_MESSAGES, ADD_MESSAGE ,SET_RELATION, SET_TWILIO_CHANNELS_INIT, SAVE_ACTIVITIES,SET_CHECKLIST_ITEMS,ADD_CHECKLIST_ITEM,DELETE_CHECKLIST_ITEM} from './types';

export function setSidebar(sidebar, isFilterSidebar,isTeamSyncFileter, isMySpaceTeamSyncFilter, isWorkspaceTeamSyncFilter, isWorkspaceAnalyticsFilter) {
	return {
	  	type: SET_SIDEBAR,
	  	sidebar,
      isFilterSidebar,
      isTeamSyncFileter,
      isMySpaceTeamSyncFilter,
      isWorkspaceTeamSyncFilter,
      isWorkspaceAnalyticsFilter

	};
}

export function setTaskComments(comments) {
	return {
	  	type:  SET_TASK_COMMENTS,
	  comments

	};
}
export function addCommentTask(comment) {
	return {
	  	type:  ADD_TASK_COMMENT,
	  comment

	};
}






export function emailTaskRelation(relation) {
  return {
      type: SET_RELATION,
      relation
  };
}
//set Checklist
export function setChecklist(checklistItems) {

  return {
      type: SET_CHECKLIST_ITEMS,
      checklistItems,
    
  };
}
//add new checklist item
export function addChecklist(checklistItem) {

  return {
      type: ADD_CHECKLIST_ITEM,
      checklistItem,
    
  };
}

export function editChecklistItem(checklistItem) {

  return {
      type: UPDATE_CHECKLIST_ITEM,
      checklistItem,
    
  };
}
export function removeChecklistItem(id) {

  return {
      type: DELETE_CHECKLIST_ITEM,
      id,
    
  };
}

// export function checkDeletedTask(){
//   // console.log("ldwjhgcjjkdlmsa=====>")
//   return{
//     type:"CHECK_DELETED_TASK"
//   }
// }


export function addTaskAttribValue(wId,id,location,data) {
  return dispatch => {
    // return axios.put('/api/workspace/'+wId+'/'+id+'/custom_attribute',data ).then(res => {
    return axios.put('/api/'+wId+'/task/'+id+'/custom_attribute',data ).then(res => {

      if (res.data.success) {
      if(location){
        // dispatch(editMyTask(res.data.task));
        dispatch(setTask(res.data.task));
      }else{
        dispatch(editTask(res.data));
      }
       
      }
      return res;
    }) 
    
}
}

export function addChecklistItem(wId,tid,location,checklistItem) {
  return dispatch => {
    // return axios.post('/api/workspace/'+wId+'/createTaskChecklistItem/'+id,checklistItem ).then(res => {
    return axios.post('/api/'+wId+'/subtask/task/'+tid,checklistItem ).then(res => {

      if (res.data.success) {
      dispatch(addChecklist(res.data.taskChecklistItem));
      // if(location){
        // dispatch(setTask(res.data.task));
      // }else{
        dispatch(editTask(res.data, res.data.task.isActive));
      // }
       
      }
      return res;
    }) 
    
}
}


export function getChecklistItems(wId,tid) {
  return dispatch => {
// return axios.get('/api/workspace/'+wId+'/getTaskChecklist/'+id).then(res => {
return axios.get('/api/'+wId+'/task/'+tid+'/subtasks').then(res => {
 if (res.data.success) {
  dispatch(setChecklist(res.data.taskChecklistItems));
      }
      return res; 
    }) 
 
}
}
export function updateChecklist(wId,stid,data) {
  return dispatch => {
// return axios.put('/api/workspace/'+wId+'/updateTaskChecklistItem/'+id,data).then(res => {
return axios.put('/api/'+wId+'/subtask/'+stid,data).then(res => {
 if (res.data.success) {
  dispatch(editChecklistItem(res.data.taskChecklistItem));
  
      }

      return res; 
    }) 
 
}

}
export function  deleteCheckListItem(wId,sid,location){
  return dispatch => {
    // return axios.delete('/api/workspace/'+wId+'/removeChecklistItem/'+id).then(res => {
    return axios.delete('/api/'+wId+'/subtask/'+sid).then(res => {
     if (res.data.success) {
               dispatch(removeChecklistItem(sid));
                // if(location){
                //   dispatch(setTask(res.data.task));
                // }else{
                  dispatch(editTask(res.data,res.data.task.isActive ));
                // }
        }
    
          return res; 
        }) 
     
    }

}
export function  deleteCheckList(wId,id,location){
  return dispatch => {
    // return axios.delete('/api/workspace/'+wId+'/removeAllChecklistItems/'+id).then(res => {
    return axios.delete('/api/'+wId+'/task/'+id+'/subtasks').then(res => {
     if (res.data.success) {
    
      dispatch(setChecklist(res.data.task.checklist));
      if(location){
        // dispatch(editMyTask(res.data.task));
        dispatch(setTask(res.data.task));
      }else{
        dispatch(editTask(res.data));
      }
          }
    
          return res; 
        }) 
     
    }

}




export function addFollowers(wId,state,id, task){
  return dispatch => {
    return axios.post('/api/'+wId+'/task/'+id+'/addfollowers', task).then(res => {
      if(res.data.success){
            if(state){
              //  dispatch(editMyTask(res.data.task));
                // dispatch(setTask(res.data.task));
                dispatch(editTask(res.data,res.data.task.isActive));
            }else{
              dispatch(editTask(res.data));
            }
      }
        return res;
      
    })
  }
}

export function removeFollowers(wId,state, id, task){
  return dispatch => {
    // return axios.post('/api/workspace/'+wId+'/task/'+id+'/removeFollowers', task).then(res => {
    return axios.post('/api/'+wId+'/task/'+id+'/removeFollowers', task).then(res => {
      if(res.data.success){
            if(state){
              //  dispatch(editMyTask(res.data.task));
                // dispatch(setTask(res.data.task));
                dispatch(editTask(res.data,res.data.task.isActive));

            }else{
              dispatch(editTask(res.data));
            }
      }
        return res;
    })
  }
}





export function sendMessage(data) {
  return dispatch => {
    return axios.post('/api/chat', data);
  }
}

export function getStatuses(id) {
  return dispatch => {
    return axios.get('/api/project/'+id+'task_section').then(res => {
      if(res.data.success){

      }
    }).catch(err => {
      if(err.response.data.error === 'No such user'){
       dispatch({ type: 'PROJECT_ACCESS_DENIED', projectAccess: false })
       
      }
      console.error(err)
      return err;
    }) 
  }
}


export function getTaskFile(wId,id,data) {
  // /api/workspace/:wId/task_file/:id/content
  return dispatch => {
    // return axios.get('/api/workspace/'+wId+'/attachments/'+id+'/content').then(res => {
    return axios.get('/api/'+wId+'/taskFile/'+id+'/content').then(res => {
        return res;
    });
  }
}

export function getProjectFile(id) {
  return dispatch => {
    return axios.get(`/api/files/${id}/content`).then(res => {
        return res;
    });
  }
}

export function getActivities(wId,id) {
  if(id){
    return dispatch => {
      axios.get('/api/'+wId+'/task/'+id+'/activity').then(res => {
          if(res.data.success){
            dispatch({type:SAVE_ACTIVITIES,payload:res.data.activities});
          }else{
            dispatch({type:SAVE_ACTIVITIES,payload:[]});
          }
      });
    }
  }else{
    return dispatch => {
      dispatch({type:SAVE_ACTIVITIES,payload:[]});
    }
  }
}
export function addTaskComment(wId,id,location, data){
  return dispatch => {
    let jsonData = JSON.parse(data.text);
   
    for(let i=0;i<jsonData.blocks[0].text.length;i++){
        if(jsonData.blocks[0].text.charAt(i) === '@'){
          // return axios.post('/api/workspace/'+wId+'/task/' + id + '/comment', jsonData).then(res => {
          return axios.post('/api/'+wId+'/task/' + id + '/task_comment', jsonData).then(res => {

            // console.log("I am the if statement",res.data);
                    if (res.data.success) {
                      dispatch(addCommentTask(res.data.comment))
              
                      if(location){
                        // dispatch(editMyTask(res.data.task));
                        dispatch(setTask(res.data.task));
                      }else{
                        dispatch(editTask(res.data));
                      }
                    }
                    return res;
                  });
                }
          else{
          // return axios.post('/api/workspace/'+wId+'/task/' + id + '/comment', data).then(res => {
          return axios.post('/api/'+wId+'/task/' + id + '/task_comment', data).then(res => {

            // console.log("I am the else statement",res.data);
            if (res.data.success) {
              dispatch(addCommentTask(res.data.comment))
      
              if(location){
                // dispatch(editMyTask(res.data.task));
                dispatch(setTask(res.data.task));
              }else{
                dispatch(editTask(res.data));
              }
            }
            return res;
          });
        }
    }
  }

    // return axios.post('/api/task/' + id + '/comment', data).then(res => {
    //   console.log("dddddd========================>",res.data)
    //           if (res.data.success) {
    //             dispatch(addCommentTask(res.data.comment))
        
    //             if(location){
    //               dispatch(editMyTask(res.data.task));
    //               dispatch(setTask(res.data.task));
    //             }else{
    //               dispatch(editTask(res.data));
    //             }
    //           }
    //           return res;
    //         });
    //       }
  }

export function getTaskComment(wId,id, data){

  return dispatch => {
    
    // return axios.get('/api/workspace/'+wId+'/task/' + id + '/comment', data).then(res => {
    return axios.get('/api/'+wId+'/task/' + id + '/task_comments', data).then(res => {

      if (res.data.success) {
        dispatch(setTaskComments(res.data.comments));
        
       
      }
      return res;
    });
  }
}

export function deleteTaskComment(wId,id){
  return dispatch =>{
    // return axios.delete('/api/workspace/'+wId+'/comment/' + id).then(res =>{
      return axios.delete('/api/'+wId+'/task_comment/' + id).then(res =>{

    // return axios.delete('/api/task/comment/' + id).then(res =>{
      if(res.data.success){
        dispatch({type:DELETE_TASK_COMMENT,id:id});
      }
      return res;
    })
  }
}


export function getNotifications(){
  return dispatch => {
    return axios.get('/api/notifications').then(res => {
      if(res.data.success){
        dispatch({type:'SET_NOTIFICATIONS',payload:{notifications:res.data.notifications,unseen_count:res.data.unseen_count}})
      }else{
        dispatch({type:'SET_NOTIFICATIONS',payload:null})
      }
      return res;
    }).catch(e  => {
      dispatch({type:'SET_NOTIFICATIONS',payload:null})
      console.error(e)
      return;
    })
  }
}

export function makeNotificationsSeen(){
  return dispatch => {
    axios.put('/api/notifications/seen').then(res => {
        dispatch({type:'UPDATE_UNREAD_NOTIFICATION_COUNT',payload:0})
    }).catch(e => {
      dispatch({type:'UPDATE_UNREAD_NOTIFICATION_COUNT',payload:0})
      console.error(e)
    })
  }
}

export function makeNotificationRead(id){
  return dispatch => {
    axios.put('/api/notifications/read',{id}).then(res => {
      if(res.data.success){
        dispatch({type:'MAKE_NOTIFICATION_AS_READ',payload:res.data.updatedNotification})
      }else{
        dispatch({type:'MAKE_NOTIFICATION_AS_READ',payload:null})
      }
    }).catch(e => {
      dispatch({type:'MAKE_NOTIFICATION_AS_READ',payload:null})
      console.error(e)
    })
  }
}

export function makeGroupNotificationRead(ids){
  return dispatch => {
    axios.put('/api/notifications/group/read',{ids}).then(res => {
      if(res.data.success){
        dispatch({type:'MAKE_GROUP_NOTIFICATION_AS_READ',payload:res.data.readNotifications})
      }else{
        dispatch({type:'MAKE_GROUP_NOTIFICATION_AS_READ',payload:null})
      }
    }).catch(e => {
      dispatch({type:'MAKE_GROUP_NOTIFICATION_AS_READ',payload:null})
      console.error(e)
    })
  }
}


export function markAllAsRead(){
  return dispatch => {
    axios.put('/api/notifications/read/all').then(res => {
      if(res.data.success){
        dispatch({type:'MARK_ALL_AS_READ',payload:true})
      }else{
        dispatch({type:'MARK_ALL_AS_READ',payload:false})
      }
    }).catch(e => {
      dispatch({type:'MARK_ALL_AS_READ',payload:false})
      console.error(e)
    })
  }
}





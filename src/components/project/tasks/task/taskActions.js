import axios from 'axios';

import { REMOVE_TASK_ITEM, SCROLL_TASK_ITEM, REMOVED_ASSIGNEE, GET_FILTER_TASKS, GET_FILTER_BACKLOGTASKS, MAKE_ACTIVE, MAKE_INACTIVE, SET_TASKS, SET_TASK, ADD_TASK, UPDATE_TASK, TASK_MOVE_SPRINT, TASK_MOVE_STATUS, TASK_MOVE_PROJECT, ADD_NEW_STATUS, ADD_NEW_SPRINT_TASKS, DELETE_TASK, UPDATE_TASK_POSITION, SET_TASKS_ON_LOAD, UPDATE_TASKFILE, ARCHIVE_TASK, GET_ARCHIVE_TASK, ARCHIVE_TASKS_BY_SECTION, GET_SEARCHED_TASKS } from './types';
// import {editMyTask} from '../../../myspace/tasks/mytaskActions'


export function setTasks(status, tasks, isBacklog, sprint) {
  return {
    type: SET_TASKS,
    tasks,
    isBacklog,
    status,
    sprint
  };
}

export function setTasksOnLoad(tasks, isBacklog) {
  // console.log("hello this is on load",_obj)
  return {
    type: SET_TASKS_ON_LOAD,
    // payload: {
    tasks,
    isBacklog
    // incomplete_tasks,
    // total_tasks
    // }
  };
}

export function setTask(task) {

  return {
    type: SET_TASK,
    task
  };
}

export function editTask(data, isActive) {
  // console.log("editTask updating task isActive:",isActive)
  return {
    type: UPDATE_TASK,
    status: data.task.status._id,
    index: data.task.position,
    task: data.task,
    isActive,
    sprint:(!isActive)?data.task.sprint?data.task.sprint:"__backlog":data.task.sprint,
    activities: data.activities,
  };
}



export function editTaskFile(status, index, task, file) {
  return {
    type: UPDATE_TASKFILE,
    status,
    index,
    task,
    file
  };
}
export function moveTaskProject(oldTask, newtask) {
  return {
    type: TASK_MOVE_PROJECT,
    oldTask,
    newtask
  };
}

export function moveTaskStatus(status, task) {
  return {
    type: TASK_MOVE_STATUS,
    status,
    task
  };
}

export function moveTaskSprint(oldTask, newtask) {
  return {
    type: TASK_MOVE_SPRINT,
    oldTask,
    newtask
  };
}

export function editTaskPosition(status, index, task, sprint) {
  return {
    type: UPDATE_TASK_POSITION,
    status,
    index,
    task,
    sprint
  };
}

export function removeTask(status, task, isActive, sprint) {
  return {
    type: DELETE_TASK,
    status,
    task,
    isActive,
    sprint
  };
}
export function archivedTask(status, task, isActive, sprint) {
  return {
    type: ARCHIVE_TASK,
    status,
    task,
    isActive,
    sprint
  };
}
export function archiveSectionTasks(status) {
  return {
    type: ARCHIVE_TASKS_BY_SECTION,
    status
  }
}


export function getArchivedTasks(tasks) {
  return {
    type: GET_ARCHIVE_TASK,
    tasks
  };
}

//adds empty task array for new status
export function add_status(status) {
  return {
    type: ADD_NEW_STATUS,
    status,

  };
}

//adds empty task array for new sprint
export function addSprintTasks(sprint) {
  return {
    type: ADD_NEW_SPRINT_TASKS,
    sprint,

  };
}

export function removedAssigneeSuccessfully(task) {
  return {
    type: REMOVED_ASSIGNEE,
    task
  }
}


// export function taskDeletedToaster() {
//   return {
//     type: 'TASK_DELETE_TOASTER'
//   }
// }

// export function setAttachmentsToaster() {
//   return {
//     type: 'ATTACHMENTS_TOASTER'
//   }
// }

// export function deleteStatusCompletely() {
//   return {
//     type: 'DELETE_STATUS_COMPLETELY'
//   }
// }

// export function notAllowStatusDelete() {
//   return {
//     type: 'NOT_ALLOW_SECTION_DELETE'
//   }
// }

// export function notAllowleaveProject() {
//   return {
//     type: 'LEAVE_PROJECT'
//   }
// }

export function scrollForTaskItem(taskId) {
  return {
    type: SCROLL_TASK_ITEM,
    taskId
  }
}

export function clearTaskItem() {
  return {
    type: REMOVE_TASK_ITEM
  }
}

export function getFilteredTasks(id, filteredTasks) {
  return {
    type: GET_FILTER_TASKS,
    filteredTasks,
    taskStatusId: id

  }
}

export function getFilteredBacklogTasks(id, filteredBacklogTasks) {
  return {
    type: GET_FILTER_BACKLOGTASKS,
    filteredBacklogTasks,
    sprintId: id

  }
}

// export function setTaskDeletedNotifToaster() {
//   return {
//     type: 'TOASTER_TASK_DELETED_NOTIFICATION'
//   }
// }

// export function resetToaster() {
//   return {
//     type: 'TOASTER_RESET'
//   }
// }


export function removeDueDate(wId,tId, type) {
  return (dispatch) => {
    // return axios.put('/api/tasks/removedate/' + id, { type }).then(res => {
    return axios.put('/api/'+wId+'/task/'+tId+'/removedate', { type }).then(res => {
      
      if (res.data.success) {
        // console.log("due date ==========================>",res.data)
        if (res.data.task.status) {
          dispatch(editTask(res.data, res.data.task.isActive));

        }
        else {

          // dispatch(editMyTask(res.data.task));
          dispatch(setTask(res.data.task))

        }

      } else {
        return res;
      }
    })
  }
}

// export function removedDueDateSuccessfully(task) {
//   return {
//     type: 'REMOVED_DUE_DATE',
//     task
//   }
// }


export function removeAssignee(wId, id) {
  return (dispatch) => {
    return axios.put("/api/"+wId+"/task/"+id+"/removeassignee").then(res => {
      // console.log("res=======>",res.data.task);
      if (res.data.success) {
        dispatch(editTask(res.data, res.data.task.isActive));

        // dispatch(editMyTask(res.data.task));
        dispatch(setTask(res.data.task))

      }
      else {
        return res;
      }
    });
  }
}


export function getTasks(wId,sId) {
  return dispatch => {

  
    // return axios.get('/api/workspace/'+wId+'/project/'+pId+'/tasks').then(res => {
    return axios.get('/api/'+wId+'/squad/'+sId+'/tasks').then(res => {
      if (res.data.success) {
        let tasks = res.data.tasks
        // let incomplete_tasks = 0
        // let total_tasks = res.data.tasks.length

        let tasks_obj = {}
        for (let j = 0; j < res.data.tasks.length; j++) {
          if (tasks[j].status) {
            if (!tasks_obj[tasks[j].status._id]) {
              tasks_obj[tasks[j].status._id] = [tasks[j]]
            } else {
              tasks_obj[tasks[j].status._id].push(tasks[j]);
            }
            // incomplete_tasks += tasks[j].isCompleted ? 1 : 0

          }
        }
        // let _obj = {
        //   tasks: tasks_obj,
        //   incomplete_tasks: incomplete_tasks,
        //   total_tasks: total_tasks
        // }
        // dispatch(setTasksOnLoad(_obj));
        // setTimeout(() => {
        //   dispatch({ type: 'TOGGLELOADER', payload: false })
        // }, 0)
        dispatch(setTasksOnLoad(tasks_obj))
      }
      // else {
      //   dispatch({ type: "ERROR", payload: res.data })
      // }
      return res;
    }).catch(err => {
      console.error(err)
      // if (err.response && err.response.data.error === 'No such user') {
      //   dispatch({ type: 'PROJECT_ACCESS_DENIED', projectAccess: false })
      // }
      return err;
    })
  }
}

export function getBacklogTasks(wId, pId) {
  return dispatch => {
    // return axios.get("/api/workspace/"+wId+"/task/"+tId ).then(res => {
    return axios.get('/api/'+wId+'/squad/'+pId+'/tasks?isActive=false').then(res => {
      if (res.data.success) {
        // console.log("got backlog tasks:",res.data.tasks.length)
        let tasks = res.data.tasks
        // let incomplete_tasks = 0
        // let total_tasks = res.data.tasks.length

        let tasks_obj = {}
        for (let j = 0; j < res.data.tasks.length; j++) {
          // console.log(`backlog task item sprint:${tasks[j].sprint}`)
          if (tasks[j].sprint) {
            if (!tasks_obj[tasks[j].sprint]) {
              tasks_obj[tasks[j].sprint] = [tasks[j]]
            } else {
              tasks_obj[tasks[j].sprint].push(tasks[j]);
            }
            // incomplete_tasks += tasks[j].isCompleted ? 1 : 0
          } else {
            if (!tasks_obj["__backlog"]) {
              tasks_obj["__backlog"] = [tasks[j]]
            } else {
              tasks_obj["__backlog"].push(tasks[j])
            }
          }
        }
        // console.log(Object.keys(tasks_obj))
        // let _obj = {
        //   tasks: tasks_obj,
        //   incomplete_tasks: incomplete_tasks,
        //   total_tasks: total_tasks
        // }
        // dispatch(setTasksOnLoad(_obj));
        // setTimeout(() => {
        //   dispatch({ type: 'TOGGLELOADER', payload: false })
        // }, 0)
        dispatch(setTasksOnLoad(tasks_obj, true))
      }
      // else {
      //   dispatch({ type: "ERROR", payload: res.data })
      // }
      return res;
    }).catch(err => {
      console.error(err)
      // if (err.response && err.response.data.error === 'No such user') {
      //   dispatch({ type: 'PROJECT_ACCESS_DENIED', projectAccess: false })
      // }
      return err;
    })
  }
}

export function getTask(wId, tId) {
  return dispatch => {
    return axios.get('/api/'+wId+'/task/'+tId).then(res => {
      if (res.data.success) {
        dispatch(setTask(res.data.task));
      }
      // else {
      //   dispatch({ type: "ERROR", payload: res.data })
      // }
      return res;
    });
  }
}

export function addTask(wId, taskData, isBacklog) {
  // console.log("addTask api call isBacklog:", isBacklog)
  // taskData && console.log("taskData:"+JSON.stringify(taskData))
  return dispatch => {
    return axios.post("/api/"+wId+"/task/", taskData).then(res => {
      if (res.data.success) {
        let dispatchObj = {
          type: ADD_TASK,
          status: taskData.status,
          task: res.data.task,
          isBacklog,
          sprint: taskData.sprint
        }
        dispatchObj.sprint = isBacklog?taskData.sprint?taskData.sprint:"__backlog":taskData.sprint
        dispatch(dispatchObj)
      }
      return res;
    });
  }
}

export function updateTask(wId, task, val) {

  let body = (val == 'user_id')?{user_id: task.user_id._id}:{[val]: task[val]}
  return dispatch => {
    return axios.put("/api/" + wId + "/task/" + task._id, body).then(res => {
      if (res.data.success) {
        // if (res.data == 'availability') {
        dispatch(editTask(res.data, res.data.task.isActive))
      }
      return res;
    });
  }
}

export function updateTaskPosition(wId, task, isBacklog) {
  return dispatch => {
    var data={}
    data.position=task.position;
    if(isBacklog){
      if(task.sprint==="__backlog"){
        data.sprint=null;
      }else{
        data.sprint=task.sprint;
      }
    }
    else 
      data.status=task.status;
    return axios.put('/api/'+wId+'/task/' + task._id, data).then(res => {
      if (res.data.success) {
        // console.log("this is the res id",JSON.stringify(res.data));
        if (res.data.task.status) {
          task.sprint = task.isActive?task.sprint:task.sprint?task.sprint:"__backlog"
          dispatch(editTaskPosition(res.data.task.status._id, res.data.task.position, res.data.task, task.sprint));
        }
      }
      return res;
    });
  }
}

export function addTaskFile(wId, id, data, file, task) {
  return dispatch => {
    return axios.post('/api/'+wId+'/task/' + id + '/taskFile', data, {
      onUploadProgress: progressEvent => {
        file.progress = ((progressEvent.loaded * 100) / progressEvent.total);
        file.status = "Progress";
        file.task_id = id;
        file._id = "jji13434"
        file.mime_type = file.type;
        dispatch(editTaskFile(task.status._id, task.position, task, file));
      }
    }).then(res => {
      if (res.data.success) {
        res.data.task.files.forEach(File => {
          if (File.name === file.name) {
            File.progress = 100;
            File.status = "Success";
          }
        });
        dispatch(editTask(res.data, res.data.task.isActive));
      }
      return res;
    });
  }
}

export function taskMove(wId, task, section, data) {
  return dispatch => {
    // console.log("oldTask:"+JSON.stringify(task))
    return axios.post('/api/'+wId+'/task/' + task._id + '/taskMove', data).then(res => {
      if (res.data.success) {
        if(task.project_id._id !== res.data.task.project_id._id) dispatch(moveTaskProject(task, res.data.task))
        else {
          if(task.isActive && (task.status._id !== res.data.task.status._id)) dispatch(moveTaskStatus(task.status._id, res.data.task))
          else if((!(task.isActive)) && (task.sprint !== res.data.task.sprint)) dispatch(moveTaskSprint(task, res.data.task))
          else dispatch(editTask(res.data, res.data.task.isActive))
        }        
      }
      return res;
    });
  }
}

export function deleteTask(wId, task) {

  return dispatch => {
    // return axios.delete('/api/workspace/'+wId+'/task/' + task._id).then(res => {
    return axios.delete('/api/'+wId+'/task/' + task._id).then(res => {
      if (res.data.success) {
        task.sprint = task.isActive?task.sprint:task.sprint?task.sprint:"__backlog"
        dispatch(removeTask(task.status._id, task, task.isActive, task.sprint))
      }
      return res;
    });
  }
}

export function archiveTask(wId, task) {
  return dispatch => {
    // return axios.put('/api/workspace/'+wId+'/task/' + task._id + "/archive")
    return axios.put('/api/'+wId+'/task/' + task._id + "/archive")
      .then(res => {
        if (res.data.success) {
          task.sprint = task.isActive?task.sprint:task.sprint?task.sprint:"__backlog"
          // dispatch(archivedTask(task.status._id, task, task.isActive, task.sprint));
          dispatch(removeTask(task.status._id, task, task.isActive, task.sprint))//TODO: handle archive 
        }
        return res;
      })
  }
}

export function getArchiveTasks(wId, id) {
  return dispatch => {
    // return axios.get('/api/workspace/'+wId+'/task/project/' + id + "/archive")
    return axios.get('/api/'+wId+'/squad/' + id + "/archiveTasks")
      .then(res => {
        if (res.data.success) {
          dispatch(getArchivedTasks(res.data.archivedTasks));
        }
        return res;
      });
  }
}

export function archiveTasksBySection(wId, data, id) {
  return dispatch => {
    // return axios.put('/api/workspace/'+wId+'/tasks/status/'+ id, data)
    return axios.put('/api/'+wId+'/taskStatus/'+ id+'/archiveTasks', data)
    .then(res => {
      if(res.data.success){
        dispatch(archiveSectionTasks(id));
      }
      return res;
    });
  }
}

export function deleteTaskFile(wId,fid,task) {
  return dispatch => {
    // return axios.delete('/api/workspace/'+wId+'/taskFile/' + id).then(res => {
    return axios.delete('/api/'+wId+'/task/'+task._id+'/taskFile/' + fid).then(res => {
      if (res.data.success) {
        dispatch(editTask(res.data, task.isActive)); //TODO: it will work only in active view until api returns task
      }
      return res;
    });
  }
}

export function moveTasksToActive(tasks){
  return{
    type:MAKE_ACTIVE,
    tasks
  }
}

export function moveTasksToInActive(tasks, sprint){
  return{
    type:MAKE_INACTIVE,
    tasks,
    sprint
  }
}

export function moveToActive(wId,pId,data){
 return dispatch=>{
   return axios.put(`/api/${wId}/squad/${pId}/moveTasksToActive`,data).then(res=>{
     if(res.data.success)
      dispatch(moveTasksToActive(data.tasks))
    return res
  })
 }
}

export function moveToInActive(wId,pId,data){
  return dispatch=>{
    return axios.put(`/api/${wId}/squad/${pId}/moveTasksToActive` ,data).then(res=>{
      if(res.data.success)
       dispatch(moveTasksToInActive(data.tasks, data.sprint?data.sprint:"__backlog"))
     return res
   })
  }
 }
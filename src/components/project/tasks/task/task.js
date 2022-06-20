import {
  SET_TASKS,
  SET_TASK,
  ADD_TASK,
  UPDATE_TASK,
  ADD_NEW_STATUS,
  ADD_NEW_SPRINT_TASKS,
  DELETE_TASK,
  UPDATE_TASK_POSITION,
  SET_TASKS_ON_LOAD,
  TASK_MOVE_PROJECT,
  TASK_MOVE_SPRINT,
  TASK_MOVE_STATUS,
  UPDATE_TASKFILE,
  ARCHIVE_TASK,
  GET_ARCHIVE_TASK,
  ARCHIVE_TASKS_BY_SECTION,
  GET_SEARCHED_TASKS,
  MAKE_ACTIVE,
  MAKE_INACTIVE,
  GET_FILTER_TASKS,
  GET_FILTER_BACKLOGTASKS,
  REMOVE_TASK_ITEM,
  SCROLL_TASK_ITEM,
  REMOVED_ASSIGNEE,
  REMOVED_DUE_DATE
} from "./types";

const initialState = {
  tasks: {},
  task: {},
  incomplete_tasks: 0,
  total_tasks: 0,
  // toasterActive: false,
  // attachmentToasterActive: false,
  taskItem: false,
  filteredTasks: {},
  filteredBacklogTasks: {},
  taskSectionId: '',
  archiveTasks: [],
  searchedTasks: {},
  // isTaskDeletedNotif: false,
  deleted: "",
  // deletStatusCompletely:"",
  // notAllowSectionDelete:"",
  projectNotDelete: "",
  // leavingProject:false,
  deletedTask: "",
  backlogTasks: {}
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_TASKS:
      return action.isBacklog ?
        {
          ...state,
          backlogTasks: {
            ...state.backlogTasks,
            [action.sprint]: [...action.tasks]
          }
        } :
        {
          ...state,
          tasks: {
            ...state.tasks,
            [action.status]: [...action.tasks]
          }
        }

    // case "CHECK_DELETED_TASK":
    //   // console.log("mbvbbjklhgbjn===>");
    //   return {
    //     ...state,
    //     deletedTask: "Task has been deleted"

    //   }
    // case "DELETED_SECTION":
    //   return {
    //     ...state,
    //     deleted: action.data
    //   }
    case "SET_SIDEBAR":
      if (action.sidebar == "") {
        return { ...state, task: {} };
      } else {
        return state;
      }
    case SET_TASKS_ON_LOAD:
      return action.isBacklog ?
        {
          ...state,
          backlogTasks: action.tasks,
          // incomplete_tasks: action.payload.incomplete_tasks,
          // total_tasks: action.payload.total_tasks
        } : {
          ...state,
          tasks: action.tasks,
          // incomplete_tasks: action.payload.incomplete_tasks,
          // total_tasks: action.payload.total_tasks
        }
    case SET_TASK:
      return {
        ...state,
        task: action.task
      };
    case ADD_TASK:
      if (action.isBacklog) {
        // console.log("adding to the store backlogTasks")
        if (state.backlogTasks[action.sprint]) {
          return {
            ...state,
            backlogTasks: {
              ...state.backlogTasks,
              [action.sprint]: [action.task, ...state.backlogTasks[action.sprint]],
            }
          };
        } else {
          let new_tasks = { ...state.backlogTasks };
          new_tasks[action.sprint] = [action.task];
          return { ...state, backlogTasks: new_tasks };
        }
      } else {
        if (state.tasks[action.status]) {
          return {
            ...state,
            tasks: {
              ...state.tasks,
              [action.status]: [action.task, ...state.tasks[action.status]],
              total_tasks: state.total_tasks++,
              incomplete_tasks: state.incomplete_tasks++,

            }
          };
        } else {
          let new_tasks = { ...state.tasks };
          new_tasks[action.status] = [action.task];
          return { ...state, tasks: new_tasks };
        }
      }
    case UPDATE_TASK_POSITION:
    if(action.task.isActive){
      return {
        ...state,
        task: state.task && state.task._id === action.task._id
          ? action.task
          : state.task,
        tasks: {
          ...state.tasks,
          [action.status]: state.tasks[action.status].map(task => (task._id === action.task._id ? action.task : task))
        },
        filteredTasks: {
          ...state.filteredTasks,
          [action.status]: state.filteredTasks[action.status]?state.filteredTasks[action.status].map(task => (task._id === action.task._id ? action.task : task)):[action.task]
          // .sort((t1, t2) => t1.position - t2.position)
        },
      }
    }else {
      return {
        ...state,
        task: state.task && state.task._id === action.task._id
          ? action.task
          : state.task,
        backlogTasks: {
          ...state.backlogTasks,
          [action.sprint]: state.backlogTasks[action.sprint].map(task => (task._id === action.task._id ? action.task : task))
        },
        filteredTasks: {
          ...state.filteredTasks,
          [action.sprint]:state.filteredTasks[action.sprint] ?state.filteredTasks[action.sprint].map(task => (task._id === action.task._id ? action.task : task)):[action.task]
          // .sort((t1, t2) => t2.position - t1.position)
        },
      }
    }
    case REMOVED_ASSIGNEE:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.task.status._id]: state.tasks[
            action.task.status._id
          ].map(task => (task._id === action.task._id ? action.task : task))
        },
        task: action.task
      };
    case REMOVED_DUE_DATE:
      return {
        ...state,
        task: action.task,
        tasks: {
          ...state.tasks,
          [action.task.status._id]: state.tasks[action.task.status._id].map(task => (task._id === action.task._id ? action.task : task))
        }
      };

    case UPDATE_TASK:
      // console.log("action in update task : ",action);
      // let new_incomplete_tasks = state.incomplete_tasks;
      // if (action.status) {
      //   if (action.status == "true") {
      //     new_incomplete_tasks--;
      //   } else {
      //     new_incomplete_tasks++;
      //   }
      // }
      if (action.isActive) {
        return {
          ...state,
          task:
            state.task && state.task._id === action.task._id
              ? action.task
              : state.task,
          tasks: {
            ...state.tasks,
            [action.status]: state.tasks[action.status].map(
              (task, idx) => (task._id === action.task._id ? action.task : task)
            )
          },
          // incomplete_tasks: new_incomplete_tasks,
          // archiveTasks: state.archiveTasks.filter((task, index) => task._id !== action.task._id)
        };
      } else {
        // console.log("action.status:"+action.status)
        // console.log("state.tasks:"+state.tasks?JSON.stringify(state.tasks):"Empty")
        return {
          ...state,
          task:
            state.task && state.task._id === action.task._id
              ? action.task
              : state.task,
          backlogTasks: {
            ...state.backlogTasks,
            [action.sprint]: state.backlogTasks[action.sprint].map(
              (task, idx) => (task._id === action.task._id ? action.task : task)
            )
          },
          // incomplete_tasks: new_incomplete_tasks,
        }
      }

    case UPDATE_TASKFILE:
      var new_task = {};
      state.tasks[action.status].map(task => {
        if (task._id === action.task._id) {
          if (task.files.length > 0) {
            task.files.map(taskFile => {
              if (
                taskFile.name === action.file.name &&
                taskFile.status !== "Success"
              ) {
                taskFile.progress = action.file.progress;
                taskFile.status = action.file.status;
              } else {
                var indexs = task.files.find(function (item, i) {
                  return item.name === action.file.name;
                });
                if (!indexs) {
                  task.files.push(action.file);
                }
              }
            });
          } else {
            task.files.push(action.file);
          }
          new_task = task;
        }
      });
      return {
        ...state,
        task:
          state.task && state.task._id === new_task._id ? new_task : state.task,
        tasks: {
          ...state.tasks,
          [action.status]: state.tasks[action.status].map(
            (task, idx) => (task._id === new_task._id ? new_task : task)
          )
        },

      };

    case TASK_MOVE_PROJECT:
     //just remove from current view and close sidebar (?)
      if(action.oldTask.isActive){
        return {
          ...state,
          tasks: {
            ...state.tasks,
            [action.oldTask.status._id]: state.tasks[action.oldTask.status._id].filter(old => old._id !== action.newTask._id)
          },
          task: {}
        }
      } else {
        return {
          ...state,
          backlogTasks: {
            ...state.backlogTasks,
            [action.oldTask.sprint]: state.backlogTasks[action.oldTask.sprint].filter(old => old._id !== action.newTask._id)
          },
          task: {}
        }
      }

    case TASK_MOVE_STATUS:
     //just remove from current view and close sidebar (?)
    //  console.log("deleting from section:"+action.status+" tasks:"+state.tasks[action.status])
    //  console.log("these statuses found in tasks:"+Object.keys(state.tasks).join())
     return {
      ...state,
      tasks: {
        ...state.tasks,
        [action.status]: state.tasks[action.status].filter(
          (oldTask, idx) => oldTask._id !== action.task._id
        ),

        [action.task.status._id]: state.tasks[action.task.status._id] ?
          [
            action.task,
            ...state.tasks[action.task.status._id]
          ]
          // state.tasks[updatedTask.status._id].push(updatedTask).sort((task1, task2) => task2.position - task1.position)
          : [action.task]
      },
      task: action.task
    };

    case TASK_MOVE_SPRINT:
     //just remove from current view and close sidebar (?)
     return {
      ...state,
      backlogTasks: {
        ...state.backlogTasks,
        [action.oldTask.sprint]: state.backlogTasks[action.oldTask.sprint].filter(old => old._id !== action.newTask._id),
        [action.newTask.sprint]: state.backlogTasks[action.newTask.sprint] ?
          [action.newTask, ...state.backlogTasks[action.task.sprint]]
          : [action.newTask]
      },
      task: action.newTask
    };


    // case TASK_MOVE:
    //   console.log("action.task:"+JSON.stringify(action.task))
    //   let updatedTask = action.task
    //   updatedTask.project_id = updatedTask.project_id._id
    //     let task = state.tasks[action.status].find(task => (task._id == updatedTask._id));
    //     console.log("task found:"+JSON.stringify(task))
    //     if (task.project_id !== updatedTask.project_id) {
    //       //just remove from current view and close sidebar (?)
    //       return {
    //         ...state,
    //         tasks: {
    //           ...state.tasks,
    //           [action.status]: state.tasks[action.status].filter(
    //             (oldTask, idx) => oldTask._id !== updatedTask._id
    //           )
    //         },
    //         task: {}
    //       }
    //     } else {
    //       if (task.status._id !== updatedTask.status._id) {
    //         return {
    //           ...state,
    //           tasks: {
    //             ...state.tasks,
    //             [action.status]: state.tasks[action.status].filter(
    //               (oldTask, idx) => oldTask._id !== updatedTask._id
    //             ),

    //             [updatedTask.status._id]: state.tasks[updatedTask.status._id] ?
    //               [
    //                 updatedTask,
    //                 ...state.tasks[updatedTask.status._id]
    //               ]
    //               // state.tasks[updatedTask.status._id].push(updatedTask).sort((task1, task2) => task2.position - task1.position)
    //               : [updatedTask]
    //           },
    //           task: updatedTask
    //         };
    //       } else {
    //         return {
    //           ...state,
    //           tasks: {
    //             ...state.tasks,
    //             [action.status]: state.tasks[action.status].map(oldTask => oldTask._id === updatedTask._id ? updatedTask : oldTask)
    //               // .sort((task1, task2) => task2.position - task1.position)
    //           },
    //           task: updatedTask
    //         };
    //       }
    //     }
    

    case ADD_NEW_STATUS:
      let new_tasks = { ...state.tasks };
      new_tasks[action.status] = [];
      return { ...state, tasks: new_tasks };

    case ADD_NEW_SPRINT_TASKS:
    let new_sprint_tasks = { ...state.backlogTasks }
    new_sprint_tasks[action.sprint] = []
    return { ...state, backlogTasks: new_sprint_tasks }
    
    case DELETE_TASK:
      return action.isActive ?
        {
          ...state,
          tasks: {
            ...state.tasks,
            [action.status]: state.tasks[action.status].filter(
              (task, idx) => task._id !== action.task._id
            )
          }
        } :
        {
          ...state,
          backlogTasks: {
            ...state.backlogTasks,
            [action.sprint]: state.backlogTasks[action.sprint].filter(
              (task, idx) => task._id !== action.task._id
            )
          }
        }

    case GET_ARCHIVE_TASK:
      return {
        ...state,
        archiveTasks: action.tasks
      };

    case ARCHIVE_TASK:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.status]: state.tasks[action.status].filter(
            (task) => task._id !== action.task._id
          )
        }
      };

    case ARCHIVE_TASKS_BY_SECTION:

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.status]: []
        }
      };

    case SCROLL_TASK_ITEM:
      return {
        ...state,
        taskItem: action.taskId
      }
    case REMOVE_TASK_ITEM:
      return {
        ...state,
        taskItem: ''
      }
    case GET_FILTER_TASKS:
      return {
        ...state,
        filteredTasks: {
          ...state.filteredTasks,
          [action.taskStatusId]: action.filteredTasks
        },

      }
    case GET_FILTER_BACKLOGTASKS:
      return {
        ...state,
        filteredBacklogTasks: {
          ...state.filteredBacklogTasks,
          [action.sprintId]: action.filteredBacklogTasks
        },
      }
    // case SET_SEARCHED_TASKS:
    //   let obj = {};
    //   Object.keys(state.tasks).map(status => {
    //     const searchedSectionTasks = state.tasks[status].filter(task => {
    //       return task.name.includes(action.val) && (task.name.includes(" " + action.val) || task.name.indexOf(action.val) === 0);
    //     });
    //     obj[status] = searchedSectionTasks;
    //   })
    //   return {
    //     ...state,
    //     searchedTasks: obj
    //   }

    case MAKE_ACTIVE:
      //remove task from backlog
      let newBacklogTasks = {...state.backlogTasks}
      let newfilteredTasks = {...state.filteredTasks}
      let removedTasks = []
      // let removedFilterTasks = []
      action.tasks.forEach(taskId =>{
        Object.keys(newBacklogTasks).some(sprint =>{
          let matchIndex = newBacklogTasks[sprint].findIndex(task=>task._id===taskId)
          if(matchIndex !== -1){
            removedTasks = removedTasks.concat(newBacklogTasks[sprint].splice(matchIndex,1))
            newBacklogTasks[sprint]=[...newBacklogTasks[sprint]]
            return true;
          } else {return false}
        })
        // Object.keys(newfilteredTasks).some(sprint =>{
        //   let matchIndex = newfilteredTasks[sprint].findIndex(task=>task._id===taskId)
        //   if(matchIndex !== -1){
        //     console.log("found match in backlog section: "+sprint+ " with "+newfilteredTasks[sprint].length+" tasks")
        //     removedFilterTasks = removedFilterTasks.concat(newfilteredTasks[sprint].splice(matchIndex,1))
        //     newfilteredTasks[sprint] = [...newfilteredTasks[sprint]]
        //     return true;
        //   } else {return false}
        // })
      })
   
      //add to active tasks
      // console.log("removed tasks:"+removedTasks.length)      
      let newTasks = {...state.tasks}
      // console.log(" new tasks length:",Object.keys(newTasks).reduce( (totalCount, sId)=>totalCount+(newTasks[sId].length),0 ))
      // console.log("new tasks:"+newTasks.length)
      for (let j = 0; j < removedTasks.length; j++) {
        // console.log("removedTask:",JSON.stringify(removedTasks[j]))
        if (removedTasks[j].status) {
          removedTasks[j].isActive=true
          if (newTasks[removedTasks[j].status._id]) {
            // newTasks[removedTasks[j].status._id].push(removedTasks[j])
            newTasks[removedTasks[j].status._id] = [
              ...newTasks[removedTasks[j].status._id],
              removedTasks[j]
            ]
          } else {
            newTasks[removedTasks[j].status._id] = [removedTasks[j]]
          }
        }
      }    
      // console.log("returning new tasks length:",Object.keys(newTasks).reduce( (totalCount, sId)=>totalCount+(newTasks[sId].length),0 ))
      return {
        ...state,       
        backlogTasks: newBacklogTasks,
        tasks: newTasks,
        filteredTasks: newfilteredTasks
      }

      case MAKE_INACTIVE:
      // console.log("moving tasks in UI action.tasks:", JSON.stringify(action.tasks))
      //remove task from active
      let newTasks2 = {...state.tasks}      
      // let newfilteredTasks = {...state.filteredTasks}
      let removedTasks2 = []
      // let removedFilterTasks = []
      action.tasks.forEach(taskId =>{
        Object.keys(newTasks2).some(status =>{
          let matchIndex = newTasks2[status].findIndex(task=>task._id===taskId)
          if(matchIndex !== -1){
            removedTasks2 = removedTasks2.concat(newTasks2[status].splice(matchIndex,1))
            newTasks2[status]=[...newTasks2[status]]
            return true;
          } else {return false}
        })
      })
   
      //add to inactive tasks
      // console.log("removed tasks:"+JSON.stringify(removedTasks2))
      let newBacklogTasks2 = {...state.backlogTasks}
      // console.log(" new tasks length:",Object.keys(newTasks).reduce( (totalCount, sId)=>totalCount+(newTasks[sId].length),0 ))
      // console.log("new tasks:"+newTasks.length)
      for (let j = 0; j < removedTasks2.length; j++) {
        // console.log("removedTask:",JSON.stringify(removedTasks2[j]))
        removedTasks2[j].sprint=action.sprint
        if (removedTasks2[j].sprint) {
          removedTasks2[j].isActive=false
          if (newBacklogTasks2[removedTasks2[j].sprint]) {
            // newTasks[removedTasks2[j].status._id].push(removedTasks2[j])
            newBacklogTasks2[removedTasks2[j].sprint] = [
              ...newBacklogTasks2[removedTasks2[j].sprint],
              removedTasks2[j]
            ]
          } else {
            newBacklogTasks2[removedTasks2[j].sprint] = [removedTasks2[j]]
          }
        }
      }    
      // console.log("returning new tasks length:",Object.keys(newTasks).reduce( (totalCount, sId)=>totalCount+(newTasks[sId].length),0 ))
      return {
        ...state,       
        backlogTasks: newBacklogTasks2,
        tasks: newTasks2,
        // filteredTasks: newfilteredTasks
      }

    default:
      return state;
  }
};

import { SET_PROJECTS, SET_PROJECT, ADD_PROJECT, EDIT_PROJECT, DELETE_PROJECT, SET_VIEW, SET_PROJECT_USER_EMAIL_TASK_SETTING,GET_ARCHIVE_PROJECT, SET_WORKSPACE_PROJECTS, SET_MY_PROJECTS,SET_WORKSPACE_KEYS } from './types';

const initialState = {
  projects: [],
  project: {},
  view: 'kanban',
  intiative:null,
  project_activities:[],
  total_activities:0,
  chat_messages:null,
  chat_count:0,
  emailTaskSetting:{},
  localStorageProjectsId: [],
  archiveProjects:[],
  projectAccess: true,
  workspaceProjects: [],
  recentProjects:[],
  searchedProjects:[],
  workspacekeys:[]
};

const searchProjectState = {
  searchField: '',
  onSearch: false,
  workspaceSearchField: ''
}


export function searchProj(state = searchProjectState, action = {}){
  // console.log("actions==========>",action)
  switch(action.type){
    case 'SEARCH_PROJECTS':
    return {
      ...state,
      searchField: action.payload,
      onSearch: true,
      workspaceSearchField: action.payload
    }
    case 'CLEAR_SEARCH':
    return{
      ...state,
      searchField: '',
      onSearch: false,
      workspaceSearchField: ''
    }
    default:
      return state;
  }
}

export function projects(state = initialState, action = {}){

  switch (action.type) {
    case SET_PROJECTS:
      return {
        ...state,
        projects: action.projects
      };
    
    case 'SAVE_PROJECT_ACTIVITIES':
      if(action.payload){
        let new_arr = state.project_activities.concat(action.payload.activities)
        return {...state,project_activities:new_arr,total_activities:action.payload.total_activities}
      }else{
        return {...state,project_activities:[],total_activities:0}
      }

    case "REMOVE_PROJECT_ACTIVITIES":
      return {...state,project_activities:[]}

    case SET_PROJECT:

        return {
          ...state,
          project: action.project,

        };


    case 'SET_INITIATIVE':
      return{
        ...state,
        intiative:action.payload
      }
    case SET_VIEW:
      return {
        ...state,
        view: action.view
      };
    case EDIT_PROJECT:
    let  new_proj;
    if(action.project.availability === "archived"){
       new_proj = state.projects.filter((project) => (project._id !== action.project._id));
    }else{
       new_proj =  state.projects.map((project) => {
        if(project._id === action.project._id){
          action.project["total_tasks"] = project.total_tasks; 
          return action.project; 
        }else{
          return project;
        }
     })
    }
      return {
        ...state,
        projects:new_proj 
      };
    case DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter((project) => (project._id !== action.id)),
        archiveProjects: state.archiveProjects.filter((project) => (project._id !== action.id))
      };
    case ADD_PROJECT:
      return {
        ...state,
        projects: [action.project, ...state.projects]
      }
    case 'COMPLETE_SPRINT':
      for(var i in state.projects){
        if(action.payload._id === state.projects[i]._id){
          state.projects[i] = action.payload;
          break;
        }
      }
      let arr = state.projects;
      return{...state,projects:arr};

    case 'UPDATE_NEXT_SPRINT':
      for(var i in state.projects){

        if(state.projects[i]._id == action.payload._id){
          state.projects[i]["status"] = "active"
        }
      }

      let new_projects = state.projects

      return {
        ...state,
        projects:new_projects

      }
      case SET_PROJECT_USER_EMAIL_TASK_SETTING:
      return{
        ...state,
        emailTaskSetting:action.setting
      }
      
    case 'ARCHIVE_PROJECT':
      let projects_with_archived =  state.projects.map(item => {
        if(item._id == action.payload._id){
          item = action.payload;
        }
        return item;
      })
      return {...state,projects:projects_with_archived}

      case 'SET_PROJECT_FILTER_VALUE' :
      let new_projs = state.projects.map((project)=> {
        if(project._id == action.payload.project_id){
          project.filter_value = action.payload.filter_value;
          return project;
        }else{
          return project;
        }
      });
      return{...state, projects:new_projs}



    case 'ADD_CHAT_NOTIFICATIONS':
      if(action.payload){
        return {...state,chat_messages:action.payload.messages,chat_count:action.payload.unread_count}
      }else{
        return state;
      }

    case 'NEW_CHAT_MESSAGE':
      let has_project = false;
      let new_msgs = [];
      state.chat_messages.map(item => {
        if(item.projectId._id == action.payload.notif.projectId._id){
          let ids = item.messages.map(msg => {
            return msg.task_id;
          })
          let index = ids.indexOf(action.payload.message.attributes.task_id);
          if( index == -1 ){
            item.messages.unshift({
              task_id:action.payload.message.attributes.task_id,name:action.payload.message.attributes.taskName,
              updatedAt:new Date()
            });
          }else{
            let splicedMsgs = item.messages.splice(index,1);
            splicedMsgs[0].updatedAt = new Date()
            item.messages.unshift(splicedMsgs[0]);
          }
          item.status = 'unread'
          new_msgs.unshift(item)
          has_project = true;
        }else{
          new_msgs.push(item)
        }
      })
      if(!has_project){
        let newMsg = {
          projectId:action.payload.notif.projectId,
          status:'unread',
          messages:[{
            task_id:action.payload.message.attributes.task_id,
            name:action.payload.message.attributes.taskName,
            updatedAt:new Date()
          }]
        }
        new_msgs.unshift(newMsg);
      }
      return {...state,chat_count:state.chat_count + 1,chat_messages:new_msgs }

      case 'MARK_CHAT_AS_READ':
        let readMsgs = state.chat_messages.map(msg => {
          if(msg.projectId._id == action.payload){
            msg.status = 'read';
          }
          return msg;
        })
        return {...state,chat_messages:readMsgs,chat_count:(state.chat_count - 1) >= 0 ? state.chat_count - 1 : 0}

      case 'SHOW_CHAT_COUNT':
        return {...state,chat_count:action.payload}

      case 'SET_LOCAL_STORAGE_PROJECT':
      let tempStorageArray = state.localStorageProjectsId;
      let checkProjectIfPresent = state.localStorageProjectsId.find(project => project === action.projectId);
      if(!checkProjectIfPresent){
        tempStorageArray.push(action.projectId);
      }
      
      if(tempStorageArray.length <= 3){
        
        localStorage.setItem('RecentProjects', JSON.stringify(tempStorageArray));
      }else if(tempStorageArray.length > 3){
        tempStorageArray.shift();
        localStorage.setItem('RecentProjects', JSON.stringify(tempStorageArray))
      }
        return{
          ...state,
          localStorageProjectsId: tempStorageArray
        };
    case 'SET_RECENT_PROJECTS':
       return {
        ...state,
        recentProjects:action.projects
       };
    case GET_ARCHIVE_PROJECT:
    let proj;
      if(action.projects.availability){
        proj = action.projects.project;
        proj.total_tasks = action.projects.total_tasks;
        return{
          ...state,
          projects: [...state.projects,proj],
          archiveProjects:state.archiveProjects.filter((project) => (project._id !== action.projects.project._id))
        }
      }else{
       return{
        ...state,
        archiveProjects:action.projects
       }
     }

    case 'PROJECT_ACCESS_DENIED':
    return {
      ...state,
      projectAccess: action.projectAccess
    }

    case SET_WORKSPACE_PROJECTS:
    return {
      ...state,
      workspaceProjects: action.projects
    }

    case SET_MY_PROJECTS:
    return {
      ...state,
      myProjects: action.myProjects
    }
    case SET_WORKSPACE_KEYS:
      return {
        ...state,
 workspacekeys:action.keys
      }

    case "SET_SEARCHED_PROJECTS":
    const {val} = action;
     const projects = state.projects.filter(project =>{
       return project.name.includes(val) && (project.name.includes(" " + val) || project.name.indexOf(val) === 0)
     })
     return{
       ...state,
       searchedProjects:projects
     }
       
    default: return state;
  }
}
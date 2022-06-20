import { SET_SIDEBAR, SET_CHAT_CLIENT, SET_CHANNEL, SET_MESSAGES, ADD_MESSAGE,SET_RELATION, SAVE_ACTIVITIES,SET_CHECKLIST_ITEMS,ADD_CHECKLIST_ITEM,UPDATE_CHECKLIST_ITEM,DELETE_CHECKLIST_ITEM,SET_TASK_COMMENTS,ADD_TASK_COMMENT, DELETE_TASK_COMMENT} from './types';
import { UPDATE_TASK } from '../tasks/task/types'

const initialState = {
  sidebar: '',
  chatClient: null,
  channels: {},
  messages: {},
  relation: null,
  isFilterSidebar: false,
  isTeamSyncFileter: false,
  isMySpaceTeamSyncFilter: false,
  isWorkspaceTeamSyncFilter: false,
  isWorkspaceAnalyticsFilter: false,
  activities: [],
  followers: [],
  checkListItems: [],
  comments:[]
}

export default (state = initialState, action = {}) => {

  switch (action.type) {
    case SET_SIDEBAR:
      if (action.isFilterSidebar) {
        return {
          ...state,
          sidebar: action.sidebar,
          activities: action.sidebar == '' ? [] : state.activities,
          isFilterSidebar: action.isFilterSidebar,
          isTeamSyncFileter: false,
          isMySpaceTeamSyncFilter: false,
          isWorkspaceTeamSyncFilter: false,
          isWorkspaceAnalyticsFilter: false
        };

      } else if (action.isTeamSyncFileter) {
        return {
          ...state,
          sidebar: action.sidebar,
          activities: action.sidebar == '' ? [] : state.activities,
          isFilterSidebar: false,
          isTeamSyncFileter: action.isTeamSyncFileter,
          isMySpaceTeamSyncFilter: false,
          isWorkspaceTeamSyncFilter: false,
          isWorkspaceAnalyticsFilter: false
        }
      } else if (action.isMySpaceTeamSyncFilter) {
        return {
          ...state,
          sidebar: action.sidebar,
          activities: action.sidebar == '' ? [] : state.activities,
          isFilterSidebar: false,
          isTeamSyncFileter: false,
          isWorkspaceTeamSyncFilter: false,
          isMySpaceTeamSyncFilter: action.isMySpaceTeamSyncFilter,
          isWorkspaceAnalyticsFilter: false
        }
      } else if (action.isWorkspaceTeamSyncFilter) {
        return {
          ...state,
          sidebar: action.sidebar,
          activities: action.sidebar == '' ? [] : state.activities,
          isFilterSidebar: false,
          isTeamSyncFileter: false,
          isMySpaceTeamSyncFilter: false,
          isWorkspaceTeamSyncFilter: true
        }
      } else if(action.isWorkspaceAnalyticsFilter){
        return {
          ...state,
          sidebar: action.sidebar,
          activities: action.sidebar == '' ? [] : state.activities,
          isFilterSidebar: false,
          isTeamSyncFileter: false,
          isMySpaceTeamSyncFilter: false,
          isWorkspaceTeamSyncFilter: false,
          isWorkspaceAnalyticsFilter: true
        }
      }
      else {
        return {
          ...state,
          sidebar: action.sidebar,
          activities: action.sidebar == '' ? [] : state.activities,
          isFilterSidebar: false,
          isTeamSyncFileter: false,
          isMySpaceTeamSyncFilter: false,
          isWorkspaceAnalyticsFilter: false
        }
      }

    case 'ADDED_FOLLOWER':
      return {
        ...state,
        followers: [...state.followers, action.task]
      }

    case SET_CHAT_CLIENT:
      return {
        ...state,
        chatClient: action.chatClient
      };
    case SET_CHANNEL:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.name]: action.channel
        }
      };
    case SET_MESSAGES:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.channel]: action.messages
        }
      };
    case ADD_MESSAGE:
      return {

        ...state,
        messages: {
          ...state.messages,
          [action.channel]: [...state.messages[action.channel], action.message]
        }
      };
    case SET_CHECKLIST_ITEMS:
      return {
        ...state,
        checkListItems: action.checklistItems

      };
    case ADD_CHECKLIST_ITEM:
      return {
        ...state,
        checkListItems: [...state.checkListItems, action.checklistItem]

      };
    case UPDATE_CHECKLIST_ITEM:
      return {
        ...state,
        checkListItems: state.checkListItems.map((checklistItem) => (checklistItem._id === action.checklistItem._id) ? action.checklistItem : checklistItem)

      };
      case DELETE_CHECKLIST_ITEM:
      return  {
        ...state,
        checkListItems:state.checkListItems.filter((item) => (item._id !== action.id))
      
      };
     case SET_RELATION:
      return {
        ...state,
        relation: action.relation
      };
      case SET_TASK_COMMENTS:
      return {
        ...state,
        comments: action.comments
      };
      case ADD_TASK_COMMENT:
          // console.log("[...state.comments, action.comment]",[...state.comments, action.comment])
          // console.log("Actions from sidebarReducer------>",action.comment);
      return {
        ...state,
        comments: [...state.comments, action.comment]
        
      };
      
      case DELETE_TASK_COMMENT :
      return{
        ...state,
        comments: state.comments.filter((comment) => {
          // console.log("comment._id:"+comment._id+" !== action.id:"+action.id+" is (true/false):"+(comment._id !== action.id))
          return (comment._id !== action.id)
        })
      };

    case SAVE_ACTIVITIES:
      return { ...state, activities: action.payload }
    
    case UPDATE_TASK:
    if(action.activities){
      let tempActivities = state.activities;
    tempActivities.unshift(action.activities);
      return{
        ...state,
        activities: tempActivities
      }

    }else{
      return{
        ...state
      }
    }
    
    default: return state;
  }
}

import { SET_WORKSPACE, SET_USER,SET_USERS, SET_APPBAR_VIEW, SET_USER_WORKSPACE, SET_TEAM, UPDATE_ASSISTANT_NAME,USER_WORKSPACE_MEMBERSHIP } from './type';
import ReactGA from 'react-ga';

const initialState = {
  user:{},
  workspace: {},
  users:[],
  workspaces: [],
  userWorkspaces: [],
  appbarView:"",
  team: {},
  isAdmin : false,
  userworkspacemembership:{}
 };

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case SET_APPBAR_VIEW:
      return {
        ...state,
        appbarView: action.appbarView
      };
    case SET_WORKSPACE:
  				 return {
	        	...state, 
	        	workspace: action.workspace
		    };
	case SET_USER:
	if(!state.user._id){
		let name = (action.user.email.replace("@","_")).replace(".","_");
		ReactGA.initialize('UA-121416513-1', {
				gaOptions: {
				  userId: name
				}
		});
		ReactGA.pageview(window.location.pathname);
		ReactGA.set({userId:name})	
    }
		 return {
	        ...state, 
	        user: action.user
			};

  case SET_USERS:
	  return {
		  ...state,
		  users:action.users
	  }

    case 'SET_IS_ADMIN' :
      const user_id = localStorage.getItem('trooprUserId')
    
      let isAdmin = false;
        const currentUserFound = action.members.find(user => user&&user.user_id&&user.user_id._id&&user.user_id._id.toString() === user_id)

        if(currentUserFound) isAdmin = currentUserFound.role === 'admin' ? true : false
      return {
        ...state,
        isAdmin
      }

    case SET_USER_WORKSPACE:
    return {
      ...state,
      userWorkspaces: action.workspaces
    }

    case SET_TEAM:
      return {
        ...state,
        team: action.team
      }
    case UPDATE_ASSISTANT_NAME:
      return {
        ...state,
        team: {
          ...state.team,
          assisant_name: action.newName
        }
      }
    case USER_WORKSPACE_MEMBERSHIP:
      return {
        ...state,
        userworkspacemembership:action.usermembership
      }


    default: return state;
  }
}
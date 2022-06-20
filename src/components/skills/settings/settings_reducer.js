import {  GET_LAUNCHER_DATA, 
          GET_USER_DATA, 
          UPDATE_USER_ACTIONS,
          UPDATE_ACTIONS_DATA,
          GET_SKILLS_ACTION,   
          GET_RESET_DATA 
        } 
from './type';

const initialState = {
actions: [],
userData: [],
userActions: [],
allActions: [],
};

export default (state = initialState, action) => {
switch(action.type) {
    
  case GET_SKILLS_ACTION:
  return {
          ...state, 
          allActions: action.skillActions
      };

    case GET_LAUNCHER_DATA:
  return {
          ...state, 
          actions: action.alldata
      };

  case GET_USER_DATA:
  return {
          ...state, 
          userData: action.userdata
      };

  case GET_RESET_DATA:
  return {
          ...state, 
          userData: action.resetdata
      };

  case UPDATE_USER_ACTIONS:
  return {
          ...state, 
          userData: action.userActions
      };

  case UPDATE_ACTIONS_DATA:
  let isActionPresent = state.actions.find(skillAction => skillAction._id === action.userAction._id)
     if(isActionPresent) {
         return {
             ...state, 
             actions: state.actions.filter(skillAction => skillAction._id !== action.userAction._id)
        }
     } else {
         return {
            ...state,
            actions: [ ...state.actions, action.userAction]
      };
   }
  
  default: 
      return state;
}
}

import { 
    SET_GUEST_MANAGER,
    SET_GUEST_USERS,
    EDIT_GUEST_USERS
} from './types';

 


const initialState = {
 jiraGuestManager: {},
 jiraGuestUsers:[]
 
};

export default (state = initialState, action = {}) => {
      switch(action.type) {

      case SET_GUEST_MANAGER:
      return {
           ...state, 
           jiraGuestManager: action.manager
       };

       case SET_GUEST_USERS:
       return {
           ...state, 
           jiraGuestUsers: action.jiraGuestUsers
      };

      
            case EDIT_GUEST_USERS:
              return {
                      ...state, 
                      jiraGuestUsers: state.jiraGuestUsers.map(item=>(  item._id===action.jiraGuestUsers._id? action.jiraGuestUsers: item))
                 };
            
 

      default: return state;
      }   
  }
import { SET_CONFLUENCE_ALIAS,SET_CONFLUENCE_ALIASES,UPDATE_ALIAS,ADD_ALIAS,DELETE_ALIAS} from './types';
  
  const initialState = {
   aliases:[],
   currentAlias:{},
  };
  
  export default (state = initialState, action = {}) => {
  
    // console.log("STATE",action)
    switch (action.type) {
  
      case  SET_CONFLUENCE_ALIAS:
        return {
          ...state,
          currentAlias: action.alias
        };
     
  
     
  
      case SET_CONFLUENCE_ALIASES:
        return {
          ...state,
          aliases:action.aliases
        };
  
        case UPDATE_ALIAS:
          return {
            ...state,
            aliases: state.aliases.map(alias => {
              if (alias._id === action.alias._id) {
               return  action.alias
              }
              return alias
            })
          };
      case ADD_ALIAS:
        return {
          ...state,
          aliases:   [action.alias, ...state.aliases]
        };
  
     
        return state.filter((invite) => (invite._id !== action.id))
        case DELETE_ALIAS:
          return {
            ...state,
            aliases: state.aliases.filter(alias => (alias._id !== action.id))
          };
    
  
      
    
     
  
      default: return state;
    }
  
  }
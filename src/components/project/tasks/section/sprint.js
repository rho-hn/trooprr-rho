import { SET_SPRINTS, SET_CURRENT_SPRINT,SET_SPRINT_CONFIG, ADD_SPRINT, UPDATE_SPRINT, DELETE_SPRINT} from './types';

const initialState = {
  currentSprint: {},
  futureSprints: [], 
  sprintConfig :{}
};

export default (state = initialState, action = {}) => {
  	switch(action.type) {
		case SET_SPRINTS:
    		return {
          ...state,
          futureSprints: action.futureSprints
        }
    case SET_CURRENT_SPRINT:
    // console.log("setting currentSprint:", action.sprint)
      return {
        ...state,
        currentSprint: action.sprint?action.sprint:{}
      }
		case ADD_SPRINT:
			return {
        ...state,
        futureSprints: [...state.futureSprints, action.sprint]
      }
		case UPDATE_SPRINT:
      let  sprints= state.futureSprints.find( (sprint) => sprint._id===action.id);
      if(sprints.project_id!==action.sprint.project_id){
        return {
          ...state,
          futureSprints: state.futureSprints.filter((sprint, idx) => (sprint._id !== action.sprint._id))
        }
      }else{
        return {
          ...state,
          futureSprints: state.futureSprints.map(sprint => (sprint._id === action.id) ? action.sprint : sprint).sort((s1, s2) => s1.position - s2.position)
        }
      };
		case DELETE_SPRINT:
		  return {
        ...state,
        futureSprints: state.futureSprints.filter((sprint, idx) => (sprint._id !== action.id))
      }
      case SET_SPRINT_CONFIG:
      return {
        ...state,
        sprintConfig: action.config?action.config:{}
      }
		default: return state;
    }
    
	 
}
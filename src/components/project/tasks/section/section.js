import { SET_STATUSES, ADD_STATUS, UPDATE_STATUS ,DELETE_STATUS} from './types';

export default (state = [], action = {}) => {
  	switch(action.type) {
		case SET_STATUSES:
    		return action.statuses;
		case ADD_STATUS:
			return [...state, action.status];
		case UPDATE_STATUS:
					let  status= state.find( (status) => status._id===action.id);
					if(status.project_id!==action.status.project_id){
						return state.filter((status, idx) => (status._id !== action.status._id));

					}else{
						return state.map(status => (status._id === action.id) ? action.status : status).sort((status1, status2) => status1.position - status2.position);
					};
		case DELETE_STATUS:
		return state.filter((status, idx) => (status._id !== action.id));
		default: return state;
	  }
	 
}
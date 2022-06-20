		
import {SET_USER_PROJECT_INVITES,  DELETE_USER_PROJECT_INVITE } from './types';

export default (state = [], action = {}) => {
  	switch(action.type) {
		case SET_USER_PROJECT_INVITES:
			return action.invites;
		case DELETE_USER_PROJECT_INVITE:
			return state.filter((invite) => (invite._id !== action.id))
    	default: return state;
  	}
}
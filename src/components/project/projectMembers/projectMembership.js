import { SET_PROJECT_MEMBERS, DELETE_PROJECT_MEMBER,ADD_PROJECT_MEMBER, ADD_PROJECT_SHARE_URL,DELETE_PROJECT_INVITE,ADD_PROJECT_INVITE,SET_PROJECT_INVITES } from './types';
const initialState = {
	members: [],
	url:'',
	invites:[]
	
};
export default (state = initialState, action = {}) => {
  	switch(action.type) {
		case SET_PROJECT_MEMBERS:
		return {
				...state,
				members: action.members
			};
			case DELETE_PROJECT_MEMBER:
			return {
				...state,
				members: state.members.filter((member) => (member._id !== action.id))
			};
			case ADD_PROJECT_MEMBER:
      	return{
        ...state,
        members: [...state.members, action.member]
      };
      case  ADD_PROJECT_SHARE_URL:
      return{
        ...state,
        url:action.url
      };
      case SET_PROJECT_INVITES:
			return {
				...state,
				invites: action.invites
			};
      case DELETE_PROJECT_INVITE:
			return {
				...state,
				invites: state.invites.filter((invite) => (invite._id !== action.id))
			};
			case ADD_PROJECT_INVITE:
      return{
        ...state,
        invites: [...state.invites, action.invite]
			};

			case 'SET_PROJECT_ADMIN':
				let newMembersArray = state.members.map(member => {
					let tempObj = {...member};
					if(member._id === action.member){
						if(action.value === 'admin'){
							tempObj.role = 'admin'
						} else if(action.value === 'member'){
							tempObj.role = 'member'
						}
						
					}
					return tempObj;
				})

				return{
					...state,
					members: newMembersArray
				}
			
			

 
    	default: return state;
  	}
}
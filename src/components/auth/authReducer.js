import { SET_CURRENT_USER , SET_TOUR_INFO,UPDATE_TOUR_INFO,GET_TOUR_INFO, SET_DRIFT_INIT} from './type';
import isEmpty from 'lodash/isEmpty';

const initialState = {
  isAuthenticated: false,
  user: {},
  token:'',
  type:'',
  newLogin:"",
  new:'',
  team:"",
  tour:{},

};

export default (state = initialState, action = {}) => {
  switch(action.type) {

    case "NEW_GOOGLE_LOGIN":
      return{
        ...state,
        newLogin:"Google Signup is unavailable at the moment. Existing customers can signin with your Google or Slack accounts. New teams signup with Slack.",
        new:true
      }


    case SET_CURRENT_USER:
      return {
        isAuthenticated: !isEmpty(action.user),
        user: action.user
      }
      case SET_DRIFT_INIT:
      return {
        ...state,
        driftInit: action.driftInit
      }
      case SET_TOUR_INFO:
      return{
        ...state,
        tour:action.tourInfo
      }
      case UPDATE_TOUR_INFO:
      return{
        ...state,
        tour:action.tourInfo
      }
      case GET_TOUR_INFO:
      return{
        ...state,
        tour:action.tourInfo
      };
    default: return state;
  }
}
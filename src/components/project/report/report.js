import { GETREPORT, REMOVEREPORT } from './types' 

const initialState = {
  reports:{}
}

export default (state = initialState, action) => {
    switch(action.type){
        case GETREPORT:
            return {
                ...state,
                reports: action.reports
              }
        case REMOVEREPORT:
            return {...state, task_report:[],members:[]}
        default:
            return state;
    }
}

import { 
    SET_AUTOMATIONS,
    UPDATE_AUTOMATIONS,SET_AUTOMATION,ADD_AUTOMATION,DELETE_AUTOMATION,SET_REPOS,SET_GITHUB_PROJECTS,SET_GITHUB_COLUMNS,SET_REPO_LABELS,SET_REPO_ASSIGNABLEUSERS,
    SET_ORG_REPO_PROJECTS,SHOW_SET_V3_MILESTONES ,SET_REPO_PROJECTS,SET_ORG_PROJECTS } from './types';
const initialState = {
 
  repos:[],
  projects:[],
  automation:{},
  automations:[],
  columns:[],
  repo_assignableUsers:[],
repo_labels:[],
repoMileStones:[],
orgrepoProjects:[],
repoV3Milestones:[],
repo_projects:[],
org_projects:[]


};

export default (state = initialState, action = {}) => {
  switch(action.type) {

    case SET_AUTOMATIONS:
      return{
        ...state,
        automations:action.automations

      }

      case ADD_AUTOMATION:
        return{
          ...state,
          automations:[ action.automation,...state.automations]
  
        }
      case UPDATE_AUTOMATIONS:
        return{
          ...state,
          automations:state.automations.map(automation=>(automation._id==action.automation._id?action.automation:automation))
  
        }
      case DELETE_AUTOMATION:
        return{
              ...state,
              automations:state.automations.filter(automation=>(automation._id!==action.id))
      
        }

    case SET_AUTOMATION:
      return {
       automation:action.automation
      }
   
      case SET_REPOS:
      return{
        ...state,
        repos:action.repos
      }
      case SET_REPO_PROJECTS:
        // console.log("==>",action.projects)
      return{
        ...state,
        repo_projects:action.projects
      }
      case SET_ORG_PROJECTS:
        return{
          ...state,
          org_projects:action.projects
        }
      case SET_GITHUB_PROJECTS:
      return{
        ...state,
        projects:action.projects
      };

      case SET_GITHUB_COLUMNS:
        return{
          ...state,
          columns:action.columns
        }
        
        case   SET_REPO_LABELS:
            return{
              ...state,
            repo_labels:action.labels
            };;

            case   SET_REPO_ASSIGNABLEUSERS:
                return{
                  ...state,
                  repo_assignableUsers:action.users
                 
                };

                case "SHOW_SET_MILESTONES":
                  return{
                          ...state,
                          repoMileStones:action.mileStones
                  }
                case SET_ORG_REPO_PROJECTS:  
                  return{
                       ...state,
                       orgrepoProjects:action.projects

                  }
           
                case SHOW_SET_V3_MILESTONES:
                  return{
                    ...state,
                    repoV3Milestones:action.payload
                  }

        
        
    default: return state;
  }
}
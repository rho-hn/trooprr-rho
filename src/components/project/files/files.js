import {SET_PROJECT_FILES, SET_PROJECT_FILE,DELETE_PROJECT_FILE,ADD_PROJECT_FILE,UPDATE_PROJECT_FILE_NAME,ADD_FILE_PROGRESS,CLEAR_ALL_PROGRESS } from './types';

const initialState = {
  files:[],
  file: {},
  progress:[]
 };

export default (state = initialState, action = {}) => {
  switch(action.type) {

  	case SET_PROJECT_FILES:
  		return{
  			 ...state,
  			files:action.files
			};
  	case SET_PROJECT_FILE:
  		return {
  		...state,
  		file: action.file,
  		};
  		case DELETE_PROJECT_FILE:
      return {
        ...state,
        files: state.files.filter( (file) => (file._id !== action.id))
      };
      case ADD_PROJECT_FILE:
      return{
        ...state,
        files: [...state.files, action.file]
      };
      case UPDATE_PROJECT_FILE_NAME :
       return{
        ...state,
          files: state.files.map( (file) => (file._id === action.file._id)?action.file:file),
        //file: action.file
       };
      case ADD_FILE_PROGRESS:
   
      var fileProgress=state.progress.find(progress => progress.project_id === action.file.project_id && progress.name===action.file.name);
      if(fileProgress){
        return{ ...state, progress: state.progress.map((progress) => (progress.project_id === action.file.project_id && progress.name===action.file.name) ? action.file :progress)}
      }else{
       
        return{ ...state, progress: [...state.progress, action.file]}
      };
      case CLEAR_ALL_PROGRESS:
      return{
          ...state,
          progress:initialState.progress

      }

    
      default: return state;
  }};

 
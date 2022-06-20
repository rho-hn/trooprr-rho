import { SET_PROJECT_FILES,SET_PROJECT_FILE,ADD_PROJECT_FILE,DELETE_PROJECT_FILE,UPDATE_PROJECT_FILE_NAME,ADD_FILE_PROGRESS,CLEAR_ALL_PROGRESS } from './types';
import  axios  from 'axios';

export function setFile(file) {
  
  return {
    type: SET_PROJECT_FILE,
    file
  };
}

export function setFiles(files) {
	return {
  	type: SET_PROJECT_FILES,
  	files
	};
}

export function insertFile(file) {
  return {
      type: ADD_PROJECT_FILE,
      file
  };
}

export function removeFile(id) {
  return {
    type: DELETE_PROJECT_FILE,
    id
  };
}

export function setUpdateFileName(file){
  return {
    type : UPDATE_PROJECT_FILE_NAME,
    file
  };
}

export function fileProgress(file){
  return{
      type:ADD_FILE_PROGRESS,
      file
  };
}

export function clearProgress(){
  return{
    type:CLEAR_ALL_PROGRESS,
};
}

export function getFiles(id,pid) {
  return dispatch => {
    return axios.get('/api/files/'+id+'/project/'+pid).then(res => {
      if (res.data.success) {
        dispatch(setFiles(res.data.files));
      }
      return res;
    });
  }
}

export function addFile(data,file) {
  return dispatch => {
    return axios.post('/api/files',data, {
    onUploadProgress: progressEvent => {
     file.progress=((progressEvent.loaded*100) / progressEvent.total);
     file.status="Progress"
      fileProgress(file)
      dispatch(fileProgress(file));
    }}).then(res => {                
      if (res.data.success) {
         dispatch(insertFile(res.data.file));
         if(!res.data.file.is_dir){
         res.data.file.progress=100
         res.data.file.status="Success"
         dispatch(fileProgress(res.data.file));
        }
      }else{
        if(!res.data.file.is_dir){
        res.data.progress=0
        res.data.file.status="Error"
        res.data.file.err=res.data.message
        dispatch(fileProgress(res.data.file));
      }
      }
        return res;
    });
  }
}

export function getFile(id) {
  return dispatch => {
    return axios.get('/api/files/'+id).then(res => {
      if (res.data.success) {
        dispatch(setFile(res.data.file));
      }
      return res;
    });
  }
}

export function updateFileName(id,data){
  return dispatch => {
    return axios.put('/api/files/'+id,data)
                .then(res => {
                  if(res.data.success){
                    dispatch(setUpdateFileName(res.data.file));
                  }
                  return res;
                });
  }
}

export function deleteFile(id) {
  return dispatch => {
    return axios.delete('/api/files/'+id).then(res => {
      if (res.data.success) {
        dispatch(removeFile(id));
      }
      return res;
    });
  }
}

import axios from 'axios';

import { SET_STATUSES, ADD_STATUS, UPDATE_STATUS,DELETE_STATUS } from './types';
import {add_status} from '../task/taskActions.js'

export function setStatuses(statuses) {
	return {
	  	type: SET_STATUSES,
	  	statuses
	};
}

export function insertStatus(status) {
  return {
      type: ADD_STATUS,
      status
  };
}

export function editStatus(id, status) {
  return {
      type: UPDATE_STATUS,
      id,
      status
  };
}
export function removeStatus(id) {
	return {
	  	type: DELETE_STATUS,
	  	id
	};
}

export function getStatuses(wId,sId) {
  return dispatch => {
    // return axios.get('/api/workspace/'+wId+'/project/'+pId+'/status').then(res => {
    return axios.get('/api/'+wId+'/squad/'+sId+'/taskStatus').then(res => {
      if (res.data.success){
       
        dispatch(setStatuses(res.data.statuses));
      }
      return res;
    }).catch(err => {
      if(err.response.data.error === 'No such user'){
       dispatch({ type: 'PROJECT_ACCESS_DENIED', projectAccess: false })
       
      }
      console.error(err)
      return err;
    }) 
  }
}



// router.get('/api/workspace/:wId/project/:pId/status/:sId', TaskStatus.getStatusApi);

// router.put('/api/workspace/:wId/project/:pId/status/:sId',TaskStatus.updateProjectStatusApi);
// router.put('/api/workspace/:wId/project/:pId/status/:sId/move', TaskStatus.projectStatusMove);
// router.delete('/api/workspace/:wId/project/:pId/status/:sId', TaskStatus.deleteStatusApi);
export function addStatus(wId, secData) {
  return dispatch => {
    // return axios.post('/api/workspace/'+wId+'/project/'+pId+'/status', secData).then(res => {
    return axios.post('/api/'+wId+'/taskStatus', secData).then(res => {
      if (res.data.success){
        dispatch(insertStatus(res.data.status));

        dispatch(add_status(res.data.status._id) )
      }
      return res;
    });
  }
}

export function updateStatus(wId,pId,tsId, secData) {
  return dispatch => {
    // return axios.put('/api/workspace/'+wId+'/project/'+pId+'/status/'+sId, secData).then(res => {
    return axios.put('/api/'+wId+'/taskStatus/'+tsId, secData).then(res => {
      if (res.data.success){
        dispatch(editStatus(tsId, res.data.status));
      }
      return res;
    });
  }
}
export function moveStatus(wId,pId,tsId, secData) {
  return dispatch => {
    // return axios.put('api/workspace/'+wId+'/project/'+pId+'/status/'+sId+'/move', secData).then(res => {
    return axios.put('api/'+wId+'/taskStatus/'+tsId+'/move', secData).then(res => {
      if (res.data.success){
        dispatch(editStatus(tsId, res.data.status));
      }
      return res;
    });
  }

}
export function deleteStatus(wId,pId,tsId) {
  return dispatch => {
    // return axios.delete('/api/workspace/'+wId+'/project/'+pId+'/status/'+sId).then(res => {
    return axios.delete('/api/'+wId+'/taskStatus/'+tsId).then(res => {
      if (res.data.success){
        dispatch(removeStatus(tsId));
      }
      return res;
      // let data = "Delete all the tasks to delete the list";
      // dispatch(alertDeletePosition(data));
    });
  }
}


// export function alertDeletePosition(data){
//   return{
// type:"DELETED_SECTION",
// data
//   };
// }

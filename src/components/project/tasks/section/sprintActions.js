import axios from 'axios';

import { SET_SPRINTS, SET_CURRENT_SPRINT, ADD_SPRINT, UPDATE_SPRINT, DELETE_SPRINT ,SET_SPRINT_CONFIG} from './types';
import {addSprintTasks} from '../task/taskActions.js'

export function setFutureSprints(futureSprints) {
	return {
	  	type: SET_SPRINTS,
	  	futureSprints
	};
}
export function setSprintConfig(config) {
	return {
	  	type: SET_SPRINT_CONFIG,
	  	config
	};
}
export function getFutureSprints(wId, sqdId) {
  // console.log("getting sprints")
  return dispatch => {
    return axios.get('/api/'+wId+'/squad/'+sqdId+'/sprints?state=future').then(res => {
      if (res.data.success){   
        dispatch(setFutureSprints(res.data.sprints))
      }
      return res;
    }).catch(err => {
      console.error("error fetching future sprints..:"+err)
      console.error(err)
      return err;
    }) 
  }
}

export function getCurrentSprint(wId, sqdId) {
  // console.log("getting current sprint")
  return dispatch => {
    return axios.get('/api/'+wId+'/squad/'+sqdId+'/sprints?state=active').then(res => {
      if (res.data.success){
        if(res.data.sprints && res.data.sprints[0]){
          // console.log("dispatching current sprint:", res.data.sprints[0])
          dispatch({type:SET_CURRENT_SPRINT, sprint:res.data.sprints[0]})
        }else {
          dispatch({ type:SET_CURRENT_SPRINT, sprint:null })
        }
      }
      return res;
    }).catch(err => {
      console.error("error fetching current sprints..:"+err)
      console.error(err)
      return err;
    }) 
  }
}

export function addSprint(wId, sqdId, sprintObj) {
  return dispatch => {
    // console.log("api call for new sprint.. ")
    return axios.post('/api/'+wId+'/squad/'+sqdId+'/sprint', sprintObj).then(res => {
      if (res.data.success){
        dispatch({type: ADD_SPRINT, sprint:res.data.sprint})
        dispatch(addSprintTasks(res.data.sprint._id) )
      }
      return res;
    });
  }
}

export function updateSprint(wId,sqdId,sId, secData) {
  return dispatch => {
    return axios.put('/api/'+wId+'/squad/'+sqdId+'/sprint/'+sId, secData).then(res => {
      if (res.data.success){
        dispatch({type: UPDATE_SPRINT, id:sId, sprint:res.data.sprint});
      }
      return res;
    });
  }
}

export function startSprint(wId,sqdId,sId) {
  return dispatch => {
    return axios.put('/api/'+wId+'/squad/'+sqdId+'/sprint/'+sId, {state:"active"}).then(res => {
      if (res.data.success){
        // dispatch({type: UPDATE_SPRINT, id:sId, sprint:res.data.sprint});
        dispatch({type: DELETE_SPRINT, id:sId});        
      }
      return res;
    });
  }
}

export function completeCurrentSprint(wId,sqdId, spilloverSprint) {
  return dispatch => {
    return axios.put('/api/'+wId+'/squad/'+sqdId+'/completeSprint', {state:"completed",spilloverSprint}).then(res => {
      if (res.data.success){
        // dispatch({type: UPDATE_SPRINT, id:sId, sprint:res.data.sprint});
        dispatch({type: SET_CURRENT_SPRINT, sprint:null});        
      }
      return res;
    });
  }
}

export function completeSprint(wId,sqdId,sId, spilloverSprint) {
  return dispatch => {
    return axios.put('/api/'+wId+'/squad/'+sqdId+'/sprint/'+sId, {status:"completed", spilloverSprint}).then(res => {
      if (res.data.success){
        dispatch({type: UPDATE_SPRINT, id:sId, sprint:res.data.sprint});
      }
      return res;
    });
  }
}

export function deleteSprint(wId, sqdId,sId) {
  return dispatch => {
    return axios.delete('/api/'+wId+'/squad/'+sqdId+'/sprint/'+sId).then(res => {
      if (res.data.success){
        dispatch({type: DELETE_SPRINT, id:sId});
      }
    });
  }
}


//config





export function updateSprintConfig(wId, sqdId,data) {
  return dispatch => {
    return axios.post('/api/'+wId+'/squad/'+sqdId+'/sprintConfig',data).then(res => {
      if (res.data.success && res.data.sprintConfig){
    
        dispatch(setSprintConfig(res.data.sprintConfig));
      }
      return res;
    });
  }
}

export function getSprintConfig(wId, sqdId) {
  return dispatch => {
    return axios.get('/api/'+wId+'/squad/'+sqdId+'/sprintConfig').then(res => {
      if (res.data.success){
            dispatch(setSprintConfig(res.data.sprintConfig));
      }
      return res;
    });
  }
}

export function extendSprint(wId, sqdId,data) {
  return dispatch => {
    return axios.put('/api/'+wId+'/squad/'+sqdId+'/extendSprint',data).then(res => {
      if (res.data.success){
            dispatch(setSprintConfig(res.data.config));
      }
      return res;
    });
  }
}
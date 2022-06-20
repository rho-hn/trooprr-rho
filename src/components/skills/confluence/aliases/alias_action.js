//Use the URL to bypass CORS issue : - 
import axios from 'axios';


import { SET_CONFLUENCE_ALIAS,SET_CONFLUENCE_ALIASES,UPDATE_ALIAS,ADD_ALIAS,DELETE_ALIAS}from './types';

export function setAlias(alias) {
  return {
    type: SET_CONFLUENCE_ALIAS,
alias
  };
}
export function setAliases(aliases) {

  return {
    type: SET_CONFLUENCE_ALIASES,
    aliases
  };
}

export function updateAlias(alias) {
  return {
    type: UPDATE_ALIAS,
    alias
  };
}




export function addAlias(alias) {
    return {
      type: ADD_ALIAS,
        alias
    };
  }


  export function deleteAlias(id) {
    return {
      type:   DELETE_ALIAS,
      id
    };
  }


  



export function getAliases(wId, channel) {

  return dispatch => {
    return axios.get("/bot/api/" + wId + "/wiki/aliases?channel="+channel)
      .then(res => {
       
        if (res.data.success) {
            dispatch(setAliases(res.data.aliases))
          }
          return res;
  
      })
  }

}
export function editAlias(wId,aId,data) {

    return dispatch => {
      return axios.put("/bot/api/" + wId + "/wiki/"+aId+"/alias",data)
        .then(res => {
          
          if (res.data.success) {
              dispatch(updateAlias(res.data.alias))
            }
            return res;
    
        })
    }
  
  }




  export function createAlias(wId,data) {

    return dispatch => {
      return axios.post("/bot/api/" + wId + "/wiki/alias",data)
        .then(res => {

          if (res.data.success) {
              dispatch(addAlias(res.data.alias))
            }
            return res;
    
        })
    }
  
  }

  export function removeAlias(wId, aId) {

    return dispatch => {
      return axios.delete("/bot/api/" + wId + "/wiki/"+aId+"/alias")
        .then(res => {
          // console.log("res====>")
          if (res.data.success) {
              dispatch(deleteAlias(aId))
            }
            return res;
    
        })
    }
  
  }


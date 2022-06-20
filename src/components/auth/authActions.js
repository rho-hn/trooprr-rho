import axios from 'axios';
import jwt from 'jsonwebtoken';
import setAuthorizationToken from '../../utils/setAuthorizationToken';
import { 
       SET_CURRENT_USER,
       SET_TOUR_INFO,UPDATE_TOUR_INFO,GET_TOUR_INFO, SET_DRIFT_INIT
     } from './type';


export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  };
}





export function logout() {
  return dispatch => {
    // localStorage.removeItem('token');
    // localStorage.removeItem('trooprUserId');
    // localStorage.removeItem("teamId");  
    // localStorage.removeItem("userCurrentWorkspaceId");
    localStorage.clear();

    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
    return true
    
    
  }
}

export function login(code, inviteToken, timezone) {
  return dispatch => {
    return axios.post('/auth/google/token', { code: code, token: inviteToken, timezone: timezone })
                .then(res => {
                    if (res.data.success && res.data.status === "approved") {
                        const token = res.data.token;
                        localStorage.setItem('token', token);
                        setAuthorizationToken(token);
                        dispatch(setCurrentUser(jwt.decode(token)));
                    }
                    return res;
                    });
                }
            }


export function slackAccess(code) {
  return dispatch => {
    return axios.post('/auth/slack/access', { code: code })
      .then(res => {
      if(res && res.data && res.data.token){
        var base64Url = res.data.token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        let res1=JSON.parse(jsonPayload);
        let userId=res1._id;
        // console.log(res.data.success,res.data.status)
                  if (res.data.success && res.data.status === "approved") {
                      const token = res.data.token;
                      localStorage.setItem('token', token);
                      localStorage.setItem('teamId',res.data.teamId);
                      localStorage.setItem('trooprUserId',userId);
  
                      setAuthorizationToken(token);
                      dispatch(setCurrentUser(jwt.decode(token)));
                      return res;
                    }
                    else{
                      return res;
                    }
      }else return res;
      
    });
  }
}

export function submitUserDetails(userData) {
  return dispatch => {
    return axios.post('/auth/userDetails', userData)
                .then(res => {
                    if (res.data.success && res.data.status === "approved") {
                        const token = res.data.token;
                        localStorage.setItem('token', token);
                        setAuthorizationToken(token);
                        dispatch(setCurrentUser(jwt.decode(token)));
                    }
      return res;

    });

  }
}
export function slackApproval(_obj,params) {
  // var instance = axios.create();
  // delete instance.defaults.headers.common['Authorization'];
  var user = {}
  if (localStorage.token) {

    var token = localStorage.token
    user = jwt.decode(token)
  }

  return dispatch => {
    return axios.post('/bot/oauth?code=' + _obj.code + "&workspace_id=" + _obj.workspace_id + "&email=" + user.email + "&source="+_obj.source, params).then(res => {
      // var token=localStorage.token
      // console.log(res.data)

    if(res.data.success){
        localStorage.setItem('token', res.data.token);
        setAuthorizationToken(res.data.token);
        dispatch(setCurrentUser(jwt.decode(res.data.token)));
        return res;
      }


     
    });
  }
}

export function slackApprovalJiraApp(_obj) {
  // var instance = axios.create();
  // delete instance.defaults.headers.common['Authorization'];
  var user = {}
  if (localStorage.token) {

    var token = localStorage.token
    user = jwt.decode(token)
  }

  return dispatch => {
    return axios.post('/bot/slack_jira_oauth?code=' + _obj.code + "&workspace_id=" + _obj.workspace_id + "&email=" + user.email + "&source="+_obj.source).then(res => {
      // var token=localStorage.token
      // console.log(res.data)

    if(res.data.success){
        localStorage.setItem('token', res.data.token);
        setAuthorizationToken(res.data.token);
        dispatch(setCurrentUser(jwt.decode(res.data.token)));
        return res;
      }


     
    });
  }
}


export function slackApprovalStandupApp(_obj) {
  // var instance = axios.create();
  // delete instance.defaults.headers.common['Authorization'];
  var user = {}
  if (localStorage.token) {

    var token = localStorage.token
    user = jwt.decode(token)
  }

  return dispatch => {
    return axios.post('/bot/standupapp_oauth?code=' + _obj.code + "&workspace_id=" + _obj.workspace_id + "&email=" + user.email + "&source="+_obj.source).then(res => {
      // var token=localStorage.token
      // console.log(res.data)

    if(res.data.success){
        localStorage.setItem('token', res.data.token);
        setAuthorizationToken(res.data.token);
        dispatch(setCurrentUser(jwt.decode(res.data.token)));
        return res;
      }


     
    });
  }
}



export const createTourInfo = (data) => dispatch =>{
  return axios.post('/api/createTourInfo',data).then(res=>{
       if(res.data.success){
         dispatch({type:SET_TOUR_INFO,tourInfo:res.data.tourInfo})
       }
       return res;
  })          
}

export const updateTourInfo = (data) => dispatch =>{
  return axios.put('/api/updateTourInfo',data).then(res=>{
       if(res.data.success){
         dispatch({type:UPDATE_TOUR_INFO,tourInfo:res.data.tourInfo})
       }
       return res;
  })          
}
 

export const getTourInfo = () =>dispatch =>{
  
    return axios.get('/api/getTourInfo').then(res=>{
      if(res.data.success){
        dispatch({type:GET_TOUR_INFO,tourInfo:res.data.tourInfo})
      }
      return res;
 })
            
}

export function setDriftState(driftInit) {
  return {
    type: SET_DRIFT_INIT,
    driftInit
  };
}
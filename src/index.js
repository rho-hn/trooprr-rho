import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
// import { createLogger } from 'redux-logger';
import rootReducer from './rootReducer';
import setAuthorizationToken from './utils/setAuthorizationToken';
import jwt from 'jsonwebtoken';
import queryString from 'query-string';
import { setCurrentUser } from './components/auth/authActions';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import AuthRoutes from "./authRoutes";
import {saveState, loadState} from "./redux_localstorage"
import throttle from "lodash/throttle"
import HistoryChange from "./historyChange"

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { CaptureConsole } from '@sentry/integrations';





// const logger = createLogger();
const persistedStore = loadState()
const store = createStore(rootReducer, persistedStore, applyMiddleware(thunk));
//sync specific stores to localstorage
store.subscribe(throttle(()=>{
  // console.log("persisting redux store filterSidebarValue..", JSON.stringify(store.getState().filterSidebarValue))
  saveState({
    filterSidebarValue: store.getState().filterSidebarValue
  })
}, 1000)) 

if (window.location.search) {
  let qs = queryString.parse(window.location.search);
  // let userId = localStorage.getItem("trooprUserId");
  // if (Object.keys(queryString.parse(window.location.search))[0] === 'token') {
  if (qs.token) {
    localStorage.setItem('token', qs.token);

    let userObj = jwt.decode(qs.token);
    if (userObj._id) {
      localStorage.setItem('trooprUserId', userObj._id);
    }

    // window.location.href = `https://${window.location.hostname}${window.location.pathname}`;

    let url = `https://${window.location.hostname}${window.location.pathname}`

    if(qs.jira_login_type && qs.jira_type){
      url += `?jira_login_type=${qs.jira_login_type}&jira_type=${qs.jira_type}`
    }

    window.location.href = url;
    // store.dispatch(setCurrentUser(jwt.decode(localStorage.token)));
    // setAuthorizationToken(qs.token);
    // store.dispatch(setCurrentUser(jwt.decode(qs.token)));
    // console.log("1=========>")
  } else {
    if (localStorage.token) {
      let userId = localStorage.getItem('trooprUserId');
      if (!userId) {
        let userObj = jwt.decode(localStorage.token);
        if (userObj._id) {
          localStorage.setItem('trooprUserId', userObj._id);
        }
      }
      setAuthorizationToken(localStorage.token);
      store.dispatch(setCurrentUser(jwt.decode(localStorage.token)));
    }
  }
} else if (localStorage.token) {
  let userId = localStorage.getItem('trooprUserId');
  if (!userId) {
    let userObj = jwt.decode(localStorage.token);
    if (userObj._id) {
      localStorage.setItem('trooprUserId', userObj._id);
    }
  }

  setAuthorizationToken(localStorage.token);
  store.dispatch(setCurrentUser(jwt.decode(localStorage.token)));
}

if(!localStorage.getItem("theme")){
  localStorage.setItem("theme","default")
}else{
  // localStorage.setItem("theme","default")
}



if(window.location.host.includes("localhost"))
axios.defaults.baseURL = 'https://app-stage.troopr.io/';
axios.interceptors.request.use(config => {
  config.headers['X-Frame-Options'] = 'SAMEORIGIN'
  return config;
})
axios.interceptors.response.use(config => {
  config.headers['X-Frame-Options'] = 'SAMEORIGIN'
  return config;
})

// axios.interceptors.request.use(
//   request => {
//     // console.log(request);
//     // Edit request config
//     return request;
//   },
//   error => {
//     // console.log(error);
//     return Promise.reject(error);
//   }
// );

// axios.interceptors.response.use(
//   response => {
//     // console.log(response);
//     // Edit response config
//     return response;
//   },
//   error => {
//     console.log(error);
//     return Promise.reject(error);
//   }
// );

// Sentry
Sentry.init({
  dsn:  process.env.REACT_APP_SENTRY_UI,
  integrations: [new CaptureConsole({
    levels: ['error']
  })],
  beforeSend(event){
if(event&&event.exception&&event.exception.values&&event.exception.values.length>0&&event.exception.values[0]&&event.exception.values[0].value){
  event.exception.values[0].value=`${event.exception.values[0].value||""} (workspaceId:${localStorage.getItem("userCurrentWorkspaceId")||""} user_id:${localStorage.getItem("trooprUserId")}) ` 
}
return event
  },
  beforeBreadcrumb(breadcrumb, hint) {
    return breadcrumb.level!=='warning'?breadcrumb:null
  },
  tracesSampleRate: 1.0

});

// let originalErr=console.error
// console.error=(...e)=>{
// originalErr(e)
// let err=[e,JSON.stringify({workspace_id:localStorage.getItem("userCurrentWorkspaceId")||"",user_id:localStorage.getItem("trooprUserId")})]
//   Sentry.captureException(err)
// }

 

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <HistoryChange>
      <AuthRoutes />
      </HistoryChange>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();

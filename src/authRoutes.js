import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import queryString from 'query-string'
import signUpRoutes from "./routes/signUpRoutes";
import { getWorkspace, switchToRecentWorkspace, getProfileinfo } from "./components/common/common_action";

// import {getAssisantSkills} from "./components/skills/skills_action"
import App from "./App";
import JiraLogins from "./JiraLogins";

const isValidWorkspace = id => (id && (id.length === 24)) //TODO:improve this validation

class Routes extends Component {

  constructor(props) { 
    super(props)
    this.token = localStorage.getItem("token");
    // let token = localStorage.getItem("token");
   
  }

  async componentDidMount() {
  

    

    if (this.token) {    
      // Workspace priority list
      // 1. From URL
      // 2. From localStorage userCurrentWorkspaceId
      // 3. From localStorage teamId
      // 4. First of available workspaces
      let wId, wId_url, wId_local = null
      
      wId_url = window.location.href.split("/")[3];
      // console.log("wId_url: ", wId)
      
      wId_local = localStorage.getItem("userCurrentWorkspaceId");
      // console.log("wId_local: ", wId_local)

      wId = isValidWorkspace(wId_url) ? wId_url : isValidWorkspace(wId_local) ? wId_local : null

      if(!wId){
        //see if there is teamId amd get corresponding wId
        let teamId = localStorage.getItem("teamId")
        // console.log("localStorage teamId: ", teamId);
        if(teamId){
          try{
            let ws_team = await axios.get("/bot/slack/getTeamworkspace/" + teamId)
            if(ws_team.data.success && ws_team.data.teamData && ws_team.data.teamData.length>0)
              wId = ws_team.data.teamData[0].workspace_id
            // console.log("wId_team: ", wId)
          } catch(e){
            console.error("Error fetching workspace for Slack team", e)
          }        
        }
      }
      
      // console.log("verified wId: ",wId)  
      if (wId) {
        if (wId_local !== wId) {
          // console.log("updating local storage..")
          localStorage.setItem("userCurrentWorkspaceId", wId);          
        }
        // console.log("setting current workspace data in store")
        this.props.getWorkspace(wId).then(res => {
          // this.props.getAssisantSkills(wId)
        })
      } else {
        //fetch a workspace from server
        // console.log("fetch a workspace from server..")
        this.props.switchToRecentWorkspace()
      }      

      //populate the logged in user profile.. this is not needed if we use auth user (populated in index.js)
      this.props.getProfileinfo() 
    }
  }
 

  render() {
    const url = this.props.location.pathname;
    // console.log("rendering auth routes for wId: ", window.location.href)

    return (
      <div>
        <Switch>
          <Route
            path="/"
            render={() => {
              // if (props.isAuthenticated) {
              if (this.token && !url.match("/troopr_billing")) {
                const qs = queryString.parse(window.location.search)
                if(qs.jira_login_type && qs.jira_type) return <JiraLogins queryString={qs} workspace_id = {window.location.href.split("/")[3]}/>
                else if (qs.type && qs.type === 'botupdate') window.open('https://app.troopr.io/slack?source=botupdate', "_self");
                else return <App />;
              } else {
                return <Route component={signUpRoutes} />;
              }
            }}
          />
        </Switch>
      </div>
    )
  }
}

function mapStateToProps(store) {
  return {
    // isAuthenticated: store.auth.isAuthenticated,
    // workspace:store.common_reducer.workspace,
  };
}

export default withRouter(connect(mapStateToProps, {getProfileinfo, getWorkspace, switchToRecentWorkspace, /*getAssisantSkills*/})(Routes))
import React, { Component } from "react";
import { connect } from "react-redux";
// import axios from "axios";
// import { getWorkspace } from "./common/common_action";
import {Spin} from "antd" ; 
import { withRouter } from "react-router-dom";

class Blank extends Component {

  componentDidMount() {
    const {workspace} = this.props
    let wId = this.props.match.params.wId
    // console.log("Blank this.props.match.params.wId: ", this.props.match.params.wId)
    wId = wId?wId:this.props.workspace?this.props.workspace._id:null
    if(wId){
      // if(workspace && 'showSquads' in workspace){
      //   workspace.showSquads ? this.props.history.push(`${"/"+wId+"/squads"}`) : this.props.history.push(`${"/"+wId+"/teamsyncs"}`)
      // }else {
      //   this.props.history.push(`${"/"+wId+"/squads"}`)
      // }
      this.props.history.push(`/${wId}/dashboard`)
    }else {
      console.error("Blank No workspace info..")
    }
  }

  // componentDidMount() {
  //   const { getWorkspace } = this.props;

  //   const currentWorkspaceId = localStorage.getItem("userCurrentWorkspaceId")
  //   const defaultRoute = currentWorkspaceId+"/squads"

  //   if (currentWorkspaceId) {
  //     this.props.history.push(defaultRoute)
  //   } else {
  //     let teamId = localStorage.getItem("teamId")
  //     if (teamId) {
  //       axios.get("/bot/slack/getTeamworkspace/" + teamId).then(res => {
  //         if (res.data.success) {
  //           let workspace_id = res.data.teamData[0].workspace_id;
  //           localStorage.setItem("userCurrentWorkspaceId", workspace_id);
  //           this.props.history.push(defaultRoute)
  //         }
  //       }).catch(e => console.error("error ", e))
  //     } else {
  //       let userId = localStorage.getItem("trooprUserId")
  //       if (userId) {
  //         axios.get("/bot/slack/getUserworkspace/" + userId).then(res => {
  //           if (res.data.success) {
  //             let workspace_id = res.data.teamData.workspace_id;
  //             localStorage.setItem("userCurrentWorkspaceId", workspace_id);
  //             this.props.history.push(defaultRoute)
  //           }
  //         })
  //       } else {
  //         axios.get("/api/getUserWorkspaceMemberships").then(res => {
  //           if (res.data.success) {
  //             let { workspaceMemberships } = res.data;
  //             if (workspaceMemberships.length > 0) {
  //               let workspace_id = workspaceMemberships[0].workspace_id;
  //               localStorage.setItem("userCurrentWorkspaceId", workspace_id);
  //               getWorkspace(workspace_id).then(res => {
  //                 if (res.data.success) {
  //                   this.props.history.push(defaultRoute)
  //                 } else {
  //                   // console.log("could not get workspace")
  //                 }
  //               })
  //             }
  //           }
  //         }).catch(e => console.error("error ", e))
  //       }
  //     }
  //   }

  // }

  render() {
    return (
      // <div>This is a blank space</div>
      <Spin style={{ marginTop: "50vh" }} />
    );
  }
}
const mapStateToProps = state => ({
  workspace: state.common_reducer.workspace,
  teamId: state.auth.team
});

export default withRouter(
  connect(
    mapStateToProps,
    {
      // getWorkspace
    }
  )(Blank)
);

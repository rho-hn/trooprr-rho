import React, { Component } from 'react'
import {Layout,Result,Button} from "antd"
import {ClockCircleOutlined } from "@ant-design/icons";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux"
import moment from "moment-timezone"
import {getProjectTeamSyncInstance} from "../skills_action"
const {  Content } = Layout;
 class ReportNotGenerated extends Component {
getInstanceAgain=()=>{
  this.props.getProjectTeamSyncInstance(this.props.match.params.tId, this.props.match.params.instanceId && this.props.match.params.instanceId)
}

    render() {
     let projectTeamSyncInstance=this.props.projectTeamSyncInstance 
     let dateText=moment(projectTeamSyncInstance.teamsyncreporttime).format('LLL')
let reportTitle=`Report will be ready at ${dateText}`

        return (
          <Content style={{height:"100%"}}>
          <Result
            icon={
              <ClockCircleOutlined
                style={{ color: "#402e96" }}
              />
            }
            title={reportTitle}
            extra={
              <>
                <Button onClick={this.getInstanceAgain} type="primary">Refresh</Button>
                
              </>
            }
          />
          </Content>
        )
    }
}

export default withRouter(
  connect(null, {
    getProjectTeamSyncInstance,
  })(ReportNotGenerated)
);


// this.props
//           .getProjectTeamSyncInstance(this.props.match.params.tId, this.props.match.params.instanceId && this.props.match.params.instanceId)
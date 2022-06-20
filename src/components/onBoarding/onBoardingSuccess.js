import React from 'react'
import { CheckCircleOutlined, SlackOutlined } from '@ant-design/icons';
import { Button, Modal, Result } from 'antd';
import {withRouter} from "react-router-dom"

class onBoardingSuccess extends React.Component {
constructor(props) {
    super(props)

    this.state = {
visible:true,
loading:false         
    }
}
componentDidMount(){
  // if(!this.props.teamId.id){

  //   this.props.getTeamData(this.props.match.params.wId)
  //  }
}
sendToWebhookPage=()=>{
  this.props.history.push(`/${this.props.match.params.wId}/jira_notification_setup/${this.props.match.params.skill_id}`)
}
close=()=>{
 
this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}`)    
this.setState({visible:false})   
}
render(){
  const app = "AE4FF42BA"
  const teamId=localStorage.getItem("teamId")
  let slackurl=!this.props.location.state.channelInfo?`https://slack.com/app_redirect?app=${app}&team=${teamId}`:`https://slack.com/app_redirect?team=${teamId}&channel=${this.props.location.state.channelInfo}`
  // console.log(slackurl,"clll");
  
    return (
      <React.Fragment>
<Modal
        visible={this.state.visible}
        onCancel={this.close}
        footer={null}
        maskClosable={false}
        >
     <Result
                icon={<CheckCircleOutlined />}
                status="success"
                title={this.props.location.state.text}
                subTitle="Invite Troopr to a channel to start /invite @troopr. "
                extra={[this.props.location.state.name==="Jira"&&<Button type="primary" onClick={this.sendToWebhookPage} >
                  Configure Jira WebHook
                </Button>,
                  <Button icon={<SlackOutlined />} href={slackurl}  type="primary" key="slack">
                    Go to Slack
                  </Button>,
                  <br />
                ]}
              />              
    </Modal></React.Fragment>
    );
}
}
export default withRouter(onBoardingSuccess);

